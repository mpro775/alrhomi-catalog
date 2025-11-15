import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ProductDocument } from '../database/schemas/product.schema';
import { ImageDocument } from '../database/schemas/image.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';

const extractCategoryName = (value: unknown): string | undefined => {
  if (value && typeof value === 'object' && 'name' in (value as Record<string, unknown>)) {
    return (value as { name?: string }).name;
  }
  return undefined;
};

const isMongoDuplicateError = (error: unknown): error is { code: number } => {
  return typeof error === 'object' && error !== null && 'code' in error;
};

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('Product')
    private productModel: Model<ProductDocument>,
    @InjectModel('Image')
    private imageModel: Model<ImageDocument>,
  ) {}

  private async prepareImageIds(imageIds: string[], currentProductId?: string) {
    const uniqueIds = Array.from(new Set(imageIds));
    if (uniqueIds.length === 0) {
      return [];
    }

    const objectIds = uniqueIds.map((id) => {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('أحد معرّفات الصور غير صالح');
      }
      return new Types.ObjectId(id);
    });

    const images = await this.imageModel
      .find({ _id: { $in: objectIds } })
      .select('_id product')
      .exec();

    if (images.length !== objectIds.length) {
      throw new NotFoundException('أحد الصور غير موجودة في مكتبة الوسائط');
    }

    const conflicting = images.find((img) => {
      if (!img.product) {
        return false;
      }
      if (currentProductId) {
        return img.product.toString() !== currentProductId;
      }
      return true;
    });

    if (conflicting) {
      throw new BadRequestException('لا يمكن ربط صورة مرتبطة بمنتج آخر');
    }

    return objectIds;
  }

  async findAll(queryDto: ProductQueryDto) {
    const { page = 1, limit = 24, q, category, model, productCode } = queryDto;

    // Build filter
    const filter: Record<string, unknown> = {};
    if (category) filter.category = category;
    if (model) filter.model = model;
    if (productCode) filter.productCode = productCode;

    if (q) {
      const regex = new RegExp(q.trim(), 'i');
      filter.$or = [
        { productName: regex },
        { description: regex },
        { productCode: regex },
        { tags: regex },
        { note: regex },
      ];
    }

    // Get total count
    const totalItems = await this.productModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / limit);

    // Get products with category
    const products = await this.productModel
      .find(filter)
      .populate('category', 'name')
      .populate('subcategory', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    // Add image count for each product
    const items = await Promise.all(
      products.map(async (product) => {
        const categoryName = extractCategoryName(product.category);
        const subcategoryName = extractCategoryName(product.subcategory);
        const imageIds = Array.isArray(product.images)
          ? product.images.map((imgId) => imgId.toString())
          : [];
        const imageCount =
          imageIds.length > 0
            ? imageIds.length
            : await this.imageModel.countDocuments({ product: product._id }).exec();

        return {
          _id: product._id,
          category: categoryName,
          subcategory: subcategoryName,
          model: product.model,
          productName: product.productName,
          productCode: product.productCode,
          variants: product.variants,
          tags: product.tags,
          note: product.note,
          description: product.description,
          imageIds,
          imageCount,
          createdAt: product.get('createdAt') as Date,
          updatedAt: product.get('updatedAt') as Date,
        };
      }),
    );

    return { page, totalPages, totalItems, items };
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('معرّف غير صالح');
    }

    const product = await this.productModel
      .findById(id)
      .populate('category', 'name')
      .populate('subcategory', 'name')
      .exec();

    if (!product) {
      throw new NotFoundException('المنتج غير موجود');
    }

    const images = await this.imageModel
      .find({ product: product._id })
      .select('_id originalUrl watermarkedUrl isWatermarked status createdAt')
      .sort({ createdAt: -1 })
      .exec();

    const categoryName = extractCategoryName(product.category);
    const subcategoryName = extractCategoryName(product.subcategory);
    const imageIds = Array.isArray(product.images)
      ? product.images.map((imgId) => imgId.toString())
      : [];

    return {
      _id: product._id,
      category: categoryName,
      subcategory: subcategoryName,
      model: product.model,
      productName: product.productName,
      productCode: product.productCode,
      variants: product.variants,
      tags: product.tags,
      note: product.note,
      description: product.description,
      images,
      imageIds,
      imageCount: images.length,
      createdAt: product.get('createdAt') as Date,
      updatedAt: product.get('updatedAt') as Date,
    };
  }

  async findAllPublic(queryDto: ProductQueryDto) {
    const { page = 1, limit = 24, q, category, model, productCode } = queryDto;

    const filter: Record<string, unknown> = {};
    if (category && Types.ObjectId.isValid(category)) {
      filter.category = new Types.ObjectId(category);
    }
    if (model) filter.model = model;
    if (productCode) filter.productCode = productCode;

    if (q) {
      const regex = new RegExp(q.trim(), 'i');
      filter.$or = [
        { productName: regex },
        { description: regex },
        { productCode: regex },
        { tags: regex },
        { note: regex },
      ];
    }

    const totalItems = await this.productModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / limit);

    const products = await this.productModel
      .find(filter)
      .populate('category', 'name')
      .populate('subcategory', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    const productIds = products.map((p) => p._id);
    const productImagesMap = new Map<string, { _id: Types.ObjectId; originalUrl: string; watermarkedUrl: string; isWatermarked: boolean }>();

    if (productIds.length > 0) {
      const images = await this.imageModel
        .aggregate([
          { $match: { product: { $in: productIds } } },
          { $sort: { createdAt: -1 } },
          {
            $group: {
              _id: '$product',
              firstImage: { $first: '$$ROOT' },
            },
          },
        ])
        .exec();

      images.forEach((item) => {
        if (item.firstImage) {
          productImagesMap.set(item._id.toString(), {
            _id: item.firstImage._id,
            originalUrl: item.firstImage.originalUrl,
            watermarkedUrl: item.firstImage.watermarkedUrl,
            isWatermarked: item.firstImage.isWatermarked,
          });
        }
      });
    }

    const items = products.map((product) => {
      const categoryName = extractCategoryName(product.category);
      const subcategoryName = extractCategoryName(product.subcategory);
      const productId = product._id instanceof Types.ObjectId ? product._id.toString() : String(product._id);
      const firstImage = productImagesMap.get(productId);

      return {
        _id: product._id,
        category: categoryName,
        subcategory: subcategoryName,
        model: product.model,
        productName: product.productName,
        productCode: product.productCode,
        description: product.description,
        tags: product.tags,
        originalUrl: firstImage?.watermarkedUrl || firstImage?.originalUrl || null,
        watermarkedUrl: firstImage?.watermarkedUrl || null,
        isWatermarked: firstImage?.isWatermarked || false,
        imageId: firstImage?._id || null,
        createdAt: product.get('createdAt') as Date,
      };
    });

    return { page, totalPages, totalItems, items };
  }

  async findOnePublic(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('معرّف غير صالح');
    }

    const product = await this.productModel
      .findById(id)
      .populate('category', 'name')
      .populate('subcategory', 'name')
      .exec();

    if (!product) {
      throw new NotFoundException('المنتج غير موجود');
    }

    // Get associated images
    const images = await this.imageModel
      .find({ product: product._id })
      .select('_id originalUrl watermarkedUrl isWatermarked status createdAt')
      .sort({ createdAt: -1 })
      .exec();

    const categoryName = extractCategoryName(product.category);
    const subcategoryName = extractCategoryName(product.subcategory);
    const imageIds = Array.isArray(product.images)
      ? product.images.map((imgId) => imgId.toString())
      : [];

    return {
      _id: product._id,
      category: categoryName,
      subcategory: subcategoryName,
      model: product.model,
      productName: product.productName,
      productCode: product.productCode,
      variants: product.variants,
      tags: product.tags,
      note: product.note,
      description: product.description,
      images,
      imageIds,
      imageCount: images.length,
      createdAt: product.get('createdAt') as Date,
      updatedAt: product.get('updatedAt') as Date,
    };
  }

  async create(createProductDto: CreateProductDto) {
    const {
      productCode,
      category,
      subcategory,
      model,
      productName,
      variants,
      tags,
      note,
      description,
      imageIds,
    } = createProductDto;

    // Validate ObjectIds
    if (!Types.ObjectId.isValid(category)) {
      throw new BadRequestException('معرّف الفئة غير صالح');
    }
    if (subcategory && !Types.ObjectId.isValid(subcategory)) {
      throw new BadRequestException('معرّف الفئة الفرعية غير صالح');
    }

    const normalizedImageIds = imageIds ? await this.prepareImageIds(imageIds) : [];

    try {
      const product = await this.productModel.create({
        productCode,
        category: new Types.ObjectId(category),
        subcategory: subcategory ? new Types.ObjectId(subcategory) : null,
        model: model?.trim() || null,
        productName,
        variants: variants || [],
        tags: tags || [],
        note: note || null,
        description: description || null,
        images: normalizedImageIds,
      });

      if (normalizedImageIds.length > 0) {
        await this.imageModel
          .updateMany({ _id: { $in: normalizedImageIds } }, { $set: { product: product._id } })
          .exec();
      }

      await product.populate('category', 'name');
      await product.populate('subcategory', 'name');

      return product;
    } catch (error: unknown) {
      if (isMongoDuplicateError(error) && error.code === 11000) {
        throw new ConflictException('المنتج موجود مسبقاً');
      }
      throw error;
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('معرّف غير صالح');
    }

    const {
      productCode,
      category,
      subcategory,
      model,
      productName,
      variants,
      tags,
      note,
      description,
      imageIds,
    } = updateProductDto;

    // Validate ObjectIds if provided
    if (category && !Types.ObjectId.isValid(category)) {
      throw new BadRequestException('معرّف الفئة غير صالح');
    }
    if (subcategory && subcategory !== null && !Types.ObjectId.isValid(subcategory)) {
      throw new BadRequestException('معرّف الفئة الفرعية غير صالح');
    }

    // Build update data
    const updateData: {
      category?: Types.ObjectId;
      subcategory?: Types.ObjectId | null;
      productCode?: string;
      model?: string;
      productName?: string;
      variants?: { name: string; values: string[] }[];
      tags?: string[];
      note?: string | null;
      description?: string | null;
      images?: Types.ObjectId[];
    } = {};
    if (productCode !== undefined) updateData.productCode = productCode;
    if (category !== undefined) updateData.category = new Types.ObjectId(category);
    if (subcategory !== undefined)
      updateData.subcategory = subcategory ? new Types.ObjectId(subcategory) : null;
    if (model !== undefined) updateData.model = model;
    if (productName !== undefined) updateData.productName = productName;
    if (variants !== undefined)
      updateData.variants = variants as {
        name: string;
        values: string[];
      }[];
    if (tags !== undefined) updateData.tags = tags;
    if (note !== undefined) updateData.note = note;
    if (description !== undefined) updateData.description = description;

    let normalizedImageIds: Types.ObjectId[] | undefined;
    if (imageIds !== undefined) {
      normalizedImageIds = await this.prepareImageIds(imageIds, id);
      updateData.images = normalizedImageIds;
    }

    try {
      const product = await this.productModel
        .findByIdAndUpdate(id, updateData, {
          new: true,
          runValidators: true,
        })
        .populate('category', 'name')
        .populate('subcategory', 'name')
        .exec();

      if (!product) {
        throw new NotFoundException('المنتج غير موجود');
      }

      if (normalizedImageIds) {
        await this.imageModel
          .updateMany(
            { product: product._id, _id: { $nin: normalizedImageIds } },
            { $set: { product: null } },
          )
          .exec();

        if (normalizedImageIds.length > 0) {
          await this.imageModel
            .updateMany({ _id: { $in: normalizedImageIds } }, { $set: { product: product._id } })
            .exec();
        }
      }

      return product;
    } catch (error: unknown) {
      if (isMongoDuplicateError(error) && error.code === 11000) {
        throw new ConflictException('المنتج موجود مسبقاً');
      }
      throw error;
    }
  }

  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('معرّف غير صالح');
    }

    // Check if product has associated images
    const imageCount = await this.imageModel.countDocuments({ product: id }).exec();

    if (imageCount > 0) {
      throw new BadRequestException({
        error: 'لا يمكن حذف المنتج لأنه يحتوي على صور مرتبطة',
        imageCount,
      });
    }

    const product = await this.productModel.findByIdAndDelete(id).exec();

    if (!product) {
      throw new NotFoundException('المنتج غير موجود');
    }

    return { message: 'تم حذف المنتج' };
  }
}
