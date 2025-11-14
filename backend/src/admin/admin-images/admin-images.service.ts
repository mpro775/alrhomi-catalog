import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { ImageDocument } from '../../database/schemas/image.schema';
import { ProductDocument } from '../../database/schemas/product.schema';
import { JobStatusDocument } from '../../database/schemas/job-status.schema';
import { AdminImageQueryDto } from './dto/admin-image-query.dto';

const isProductDocument = (value: unknown): value is ProductDocument => {
  return (
    !!value &&
    typeof value === 'object' &&
    'model' in (value as Record<string, unknown>) &&
    'productName' in (value as Record<string, unknown>)
  );
};

const extractCategoryName = (product: ProductDocument | null): string | undefined => {
  const category = product?.category as unknown;
  if (category && typeof category === 'object' && 'name' in (category as Record<string, unknown>)) {
    return (category as { name?: string }).name;
  }
  return undefined;
};

@Injectable()
export class AdminImagesService {
  private s3Client: S3Client;
  private bucket: string;

  constructor(
    @InjectModel('Product')
    private productModel: Model<ProductDocument>,
    @InjectModel('Image')
    private imageModel: Model<ImageDocument>,
    @InjectModel('JobStatus')
    private jobStatusModel: Model<JobStatusDocument>,
    private configService: ConfigService,
  ) {
    const awsConfig = this.configService.get('aws');
    this.bucket = awsConfig.bucket;

    this.s3Client = new S3Client({
      region: awsConfig.region,
      credentials: {
        accessKeyId: awsConfig.accessKeyId,
        secretAccessKey: awsConfig.secretAccessKey,
      },
    });
  }

  async findAll(queryDto: AdminImageQueryDto) {
    const { page = 1, limit = 24, search, assigned, ids } = queryDto;

    const imageFilter: Record<string, unknown> = {};
    if (assigned === false) {
      imageFilter.product = null;
    } else if (assigned === true) {
      imageFilter.product = { $ne: null };
    }

    const idList = ids
      ? ids
          .split(',')
          .map((id) => id.trim())
          .filter(Boolean)
      : [];

    if (idList.length > 0) {
      const validIds = idList.filter((id) => Types.ObjectId.isValid(id));
      if (validIds.length === 0) {
        return { page: 1, totalPages: 0, totalItems: 0, items: [] };
      }
      imageFilter._id = { $in: validIds.map((id) => new Types.ObjectId(id)) };
    }

    if (idList.length === 0 && search) {
      const regex = new RegExp(search.trim(), 'i');
      const productFilter = {
        $or: [
          { model: regex },
          { productName: regex },
          { description: regex },
          { productCode: regex },
          { tags: regex },
          { note: regex },
        ],
      };
      if (assigned === false) {
        return { page, totalPages: 0, totalItems: 0, items: [] };
      }

      const products = await this.productModel.find(productFilter).select('_id').exec();
      const productIds = products.map((p) => p._id);
      if (productIds.length === 0) {
        return { page, totalPages: 0, totalItems: 0, items: [] };
      }
      const productCriteria: Record<string, unknown> = { $in: productIds };
      if (imageFilter.product && typeof imageFilter.product === 'object') {
        imageFilter.product = {
          ...(imageFilter.product as Record<string, unknown>),
          ...productCriteria,
        };
      } else {
        imageFilter.product = productCriteria;
      }
    }

    const totalItems = await this.imageModel.countDocuments(imageFilter);
    const totalPages = Math.ceil(totalItems / limit);

    const images = await this.imageModel
      .find(imageFilter)
      .populate({
        path: 'product',
        populate: [
          { path: 'category', select: 'name' },
          { path: 'subcategory', select: 'name' },
        ],
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    const items = await Promise.all(
      images.map(async (img) => {
        const job = await this.jobStatusModel.findOne({ jobId: img.jobId }).exec();
        const product = isProductDocument(img.product) ? img.product : null;
        const categoryName = extractCategoryName(product);

        return {
          _id: img._id,
          model: product?.model,
          category: categoryName,
          productName: product?.productName,
          productCode: product?.productCode,
          description: product?.description,
          note: product?.note,
          tags: product?.tags,
          originalUrl: img.originalUrl,
          watermarkedUrl: img.watermarkedUrl,
          isWatermarked: img.isWatermarked,
          uploadedAt: img.get('createdAt') as Date,
          status: job?.status ?? 'queued',
          progress: job?.progress ?? 0,
        };
      }),
    );

    return { page, totalPages, totalItems, items };
  }

  async remove(id: string) {
    const img = await this.imageModel.findById(id).exec();
    if (!img) {
      throw new NotFoundException('الصورة غير موجودة');
    }

    // Extract file name from originalUrl
    const urlParts = img.originalUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];

    const keys = [`originals/${fileName}`, `watermarked/${img._id}.png`];

    // Delete files from S3
    await Promise.all(
      keys.map(async (Key) => {
        try {
          await this.s3Client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key }));
        } catch (error) {
          if (error instanceof Error) {
            if (error.name !== 'NoSuchKey') {
              throw error;
            }
          } else if (error !== undefined) {
            throw error;
          }
        }
      }),
    );

    // Delete document from MongoDB
    await img.deleteOne();

    return { message: 'تم حذف الصورة' };
  }
}
