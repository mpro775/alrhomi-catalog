import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CategoryDocument } from '../database/schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category')
    private categoryModel: Model<CategoryDocument>,
  ) {}

  async findAll() {
    const categories = await this.categoryModel
      .find()
      .populate('parent', '_id name')
      .sort({ name: 1 })
      .lean();

    // Count products for each category
    const categoryIds = categories.map((cat) => cat._id);

    // Get product model from mongoose
    const ProductModel = this.categoryModel.db.model('Product');

    // Count products per category
    const productCounts = await ProductModel.aggregate([
      { $match: { category: { $in: categoryIds } } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);

    // Create a map for quick lookup
    const countMap = productCounts.reduce(
      (acc, item) => {
        acc[item._id.toString()] = item.count;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Add count to each category
    const categoriesWithCount = categories.map((cat) => ({
      ...cat,
      itemsCount: countMap[cat._id.toString()] || 0,
    }));

    return { items: categoriesWithCount };
  }

  async create(createCategoryDto: CreateCategoryDto) {
    const { name, description, image, parent } = createCategoryDto;

    // Check if category already exists
    const exists = await this.categoryModel.findOne({ name }).exec();
    if (exists) {
      throw new ConflictException('الفئة موجودة مسبقاً');
    }

    // Validate parent if provided
    let parentId: Types.ObjectId | null = null;
    if (parent) {
      if (!Types.ObjectId.isValid(parent)) {
        throw new BadRequestException('معرّف الأب غير صالح');
      }
      const parentCat = await this.categoryModel.findById(parent).exec();
      if (!parentCat) {
        throw new NotFoundException('الفئة الأب غير موجودة');
      }
      parentId = new Types.ObjectId(parent);
    }

    const category = await this.categoryModel.create({
      name,
      description,
      image,
      parent: parentId,
    });

    await category.populate('parent', '_id name');
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('معرّف غير صالح');
    }

    const { name, description, image, parent } = updateCategoryDto;

    // Validate parent if provided
    let parentId: Types.ObjectId | null | undefined = undefined;
    if (parent !== undefined) {
      if (parent === null) {
        parentId = null;
      } else {
        if (!Types.ObjectId.isValid(parent)) {
          throw new BadRequestException('معرّف الأب غير صالح');
        }
        if (parent === id) {
          throw new BadRequestException('لا يمكن أن تكون الفئة أبّا لنفسها');
        }
        const parentCat = await this.categoryModel.findById(parent).exec();
        if (!parentCat) {
          throw new NotFoundException('الفئة الأب غير موجودة');
        }
        parentId = new Types.ObjectId(parent);
      }
    }

    const updateData: {
      name?: string;
      description?: string;
      image?: string;
      parent?: Types.ObjectId | null;
    } = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (image !== undefined) updateData.image = image;
    if (parentId !== undefined) updateData.parent = parentId;

    const category = await this.categoryModel
      .findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
      .populate('parent', '_id name')
      .exec();

    if (!category) {
      throw new NotFoundException('الفئة غير موجودة');
    }

    return category;
  }

  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('معرّف غير صالح');
    }

    // Check if category has children
    const child = await this.categoryModel.findOne({ parent: id }).exec();
    if (child) {
      throw new BadRequestException('لا يمكن حذف فئة لأنها تحتوي على فئات فرعية');
    }

    const result = await this.categoryModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('الفئة غير موجودة');
    }

    return { message: 'تم حذف الفئة' };
  }
}
