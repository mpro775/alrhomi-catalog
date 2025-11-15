import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ProductDocument } from '../database/schemas/product.schema';
import { ImageDocument } from '../database/schemas/image.schema';
import { StorageService } from '../storage/storage.service';
import { UploadImageDto } from './dto/upload-image.dto';
import { ImageQueryDto } from './dto/image-query.dto';
import * as fs from 'fs';
import * as path from 'path';

const isProductDocument = (value: unknown): value is ProductDocument => {
  return (
    !!value &&
    typeof value === 'object' &&
    'model' in (value as Record<string, unknown>) &&
    'productName' in (value as Record<string, unknown>)
  );
};

@Injectable()
export class ImagesService {
  constructor(
    @InjectModel('Product')
    private productModel: Model<ProductDocument>,
    @InjectModel('Image')
    private imageModel: Model<ImageDocument>,
    @InjectQueue('image-processing')
    private imageQueue: Queue,
    private storageService: StorageService,
  ) {}

  async upload(file: Express.Multer.File, uploadDto: UploadImageDto) {
    const { productId } = uploadDto;
    let product: ProductDocument | null = null;

    if (productId) {
      if (!Types.ObjectId.isValid(productId)) {
        throw new BadRequestException('معرّف المنتج غير صالح');
      }

      product = await this.productModel
        .findById(productId)
        .select('productName productCode model category')
        .exec();
      if (!product) {
        throw new NotFoundException('المنتج غير موجود');
      }
    }

    const tempPath = file.path;
    const ext = path.extname(file.originalname).toLowerCase();
    const s3Key = `originals/${Date.now()}-${file.filename}${ext}`;

    try {
      // Upload original file to S3
      if (!fs.existsSync(tempPath)) {
        throw new BadRequestException('الملف المؤقت غير موجود');
      }

      const fileStream = fs.createReadStream(tempPath);
      const originalUrl = await this.storageService.uploadFile(s3Key, fileStream, file.mimetype);

      // Delete temp file
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }

      // Create image document مرتبط بالمنتج
      const imageDoc = await this.imageModel.create({
        product: product?._id ?? null,
        originalUrl,
        watermarkedUrl: '',
        isWatermarked: false,
        jobId: null,
        status: 'queued',
        progress: 0,
      });

      // Add job to queue
      const imageId =
        imageDoc._id instanceof Types.ObjectId ? imageDoc._id.toHexString() : String(imageDoc._id);

      const job = await this.imageQueue.add({
        metadata: {
          _id: imageId,
          description: product?.productName ?? file.originalname,
          s3Key,
        },
      });

      imageDoc.jobId = job.id.toString();
      await imageDoc.save();

      return {
        message: 'Upload queued',
        id: imageDoc._id,
        jobId: job.id,
        originalUrl,
      };
    } catch (error) {
      // Clean up temp file if exists
      if (fs.existsSync(tempPath)) {
        try {
          fs.unlinkSync(tempPath);
        } catch (unlinkError) {
          // Ignore unlink errors during cleanup
        }
      }
      throw error;
    }
  }

  async findAll(queryDto: ImageQueryDto) {
    const { page = 1, limit = 24, q, category, model, assigned, ids } = queryDto;

    const productFilter: Record<string, unknown> = {};
    if (category && Types.ObjectId.isValid(category)) {
      productFilter.category = new Types.ObjectId(category);
    }
    if (model) productFilter.model = model;

    if (q) {
      const regex = new RegExp(q.trim(), 'i');
      productFilter.$or = [
        { productName: regex },
        { description: regex },
        { productCode: regex },
        { tags: regex },
        { note: regex },
      ];
    }

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

    if (idList.length === 0 && Object.keys(productFilter).length > 0) {
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

    const items = images.map((img) => {
      const productDoc = isProductDocument(img.product) ? img.product : null;
      const categoryName =
        productDoc && productDoc.category && typeof productDoc.category === 'object'
          ? ((productDoc.category as { name?: string }).name ?? undefined)
          : undefined;
      const subcategoryName =
        productDoc && productDoc.subcategory && typeof productDoc.subcategory === 'object'
          ? ((productDoc.subcategory as { name?: string }).name ?? undefined)
          : undefined;

      return {
        _id: img._id,
        category: categoryName,
        subcategory: subcategoryName,
        model: productDoc?.model,
        productName: productDoc?.productName,
        productCode: productDoc?.productCode,
        description: productDoc?.description,
        note: productDoc?.note,
        tags: productDoc?.tags,
        originalUrl: img.originalUrl,
        watermarkedUrl: img.watermarkedUrl,
        isWatermarked: img.isWatermarked,
        productId: productDoc?._id ?? null,
        uploadedAt: img.get('createdAt') as Date,
      };
    });

    return { page, totalPages, totalItems, items };
  }

  async getDownloadUrl(id: string) {
    const img = await this.imageModel.findById(id).exec();
    if (!img) {
      throw new NotFoundException('الصورة غير موجودة');
    }

    let key: string | null = null;
    if (img.originalUrl) {
      const url = new URL(img.originalUrl);
      key = url.pathname.replace(/^\//, '');
    }

    if (!key) {
      throw new BadRequestException('لا يمكن العثور على الملف');
    }

    const presignedUrl = await this.storageService.generatePresignedUrl(key);
    return { url: presignedUrl };
  }

  async toggleWatermark(id: string) {
    const img = await this.imageModel.findById(id).populate('product').exec();

    if (!img) {
      throw new NotFoundException('الصورة غير موجودة');
    }

    img.isWatermarked = !img.isWatermarked;
    await img.save();

    return { id: img._id, isWatermarked: img.isWatermarked };
  }

  async findRelated(imageId: string) {
    if (!Types.ObjectId.isValid(imageId)) {
      throw new NotFoundException('معرف الصورة غير صالح');
    }

    // جلب الصورة الحالية مع تفاصيل المنتج والفئات
    const currentImage = await this.imageModel
      .findById(imageId)
      .populate({
        path: 'product',
        populate: [
          { path: 'category', select: '_id name' },
          { path: 'subcategory', select: '_id name' },
        ],
      })
      .exec();

    if (!currentImage || !currentImage.product) {
      return { items: [] };
    }

    const productDoc = isProductDocument(currentImage.product) ? currentImage.product : null;
    if (!productDoc) {
      return { items: [] };
    }

    const subcategoryId =
      productDoc.subcategory && typeof productDoc.subcategory === 'object'
        ? (productDoc.subcategory as { _id?: Types.ObjectId })._id
        : null;

    const categoryId =
      productDoc.category && typeof productDoc.category === 'object'
        ? (productDoc.category as { _id?: Types.ObjectId })._id
        : null;

    let relatedImages: ImageDocument[] = [];

    // أولاً: البحث في نفس الفئة الفرعية
    if (subcategoryId) {
      const subcategoryProducts = await this.productModel
        .find({ subcategory: subcategoryId, _id: { $ne: productDoc._id } })
        .select('_id')
        .limit(5)
        .exec();

      if (subcategoryProducts.length > 0) {
        const productIds = subcategoryProducts.map((p) => p._id);
        relatedImages = await this.imageModel
          .find({ product: { $in: productIds } })
          .populate({
            path: 'product',
            populate: [
              { path: 'category', select: 'name' },
              { path: 'subcategory', select: 'name' },
            ],
          })
          .limit(5)
          .exec();
      }
    }

    // ثانياً: إذا لم نجد كافي منتجات، نبحث في الفئة الرئيسية
    if (relatedImages.length < 5 && categoryId) {
      const remainingLimit = 5 - relatedImages.length;
      const existingProductIds = relatedImages
        .map((img) => (isProductDocument(img.product) ? img.product._id : null))
        .filter(Boolean);

      const categoryProducts = await this.productModel
        .find({
          category: categoryId,
          _id: {
            $ne: productDoc._id,
            $nin: existingProductIds,
          },
        })
        .select('_id')
        .limit(remainingLimit)
        .exec();

      if (categoryProducts.length > 0) {
        const productIds = categoryProducts.map((p) => p._id);
        const additionalImages = await this.imageModel
          .find({ product: { $in: productIds } })
          .populate({
            path: 'product',
            populate: [
              { path: 'category', select: 'name' },
              { path: 'subcategory', select: 'name' },
            ],
          })
          .limit(remainingLimit)
          .exec();

        relatedImages = [...relatedImages, ...additionalImages];
      }
    }

    // تنسيق النتائج
    const items = relatedImages.slice(0, 5).map((img) => {
      const imgProductDoc = isProductDocument(img.product) ? img.product : null;
      const categoryName =
        imgProductDoc && imgProductDoc.category && typeof imgProductDoc.category === 'object'
          ? ((imgProductDoc.category as { name?: string }).name ?? undefined)
          : undefined;
      const subcategoryName =
        imgProductDoc && imgProductDoc.subcategory && typeof imgProductDoc.subcategory === 'object'
          ? ((imgProductDoc.subcategory as { name?: string }).name ?? undefined)
          : undefined;

      return {
        _id: img._id,
        category: categoryName,
        subcategory: subcategoryName,
        model: imgProductDoc?.model,
        productName: imgProductDoc?.productName,
        productCode: imgProductDoc?.productCode,
        description: imgProductDoc?.description,
        note: imgProductDoc?.note,
        tags: imgProductDoc?.tags,
        originalUrl: img.originalUrl,
        watermarkedUrl: img.watermarkedUrl,
        isWatermarked: img.isWatermarked,
        productId: imgProductDoc?._id ?? null,
        uploadedAt: img.get('createdAt') as Date,
      };
    });

    return { items };
  }
}
