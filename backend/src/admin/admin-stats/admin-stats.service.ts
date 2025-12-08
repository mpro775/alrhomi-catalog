import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Model } from 'mongoose';
import { ImageDocument } from '../../database/schemas/image.schema';
import { ProductDocument } from '../../database/schemas/product.schema';

@Injectable()
export class AdminStatsService {
  constructor(
    @InjectModel('Image')
    private imageModel: Model<ImageDocument>,
    @InjectModel('Product')
    private productModel: Model<ProductDocument>,
    @InjectQueue('image-processing')
    private imageQueue: Queue,
  ) {}

  async getStats() {
    try {
      console.log(`[${new Date().toISOString()}] AdminStats: Starting stats calculation`);
      
      // Products statistics (الأساس)
      const totalProducts = await this.productModel.countDocuments().exec();
      console.log(`[${new Date().toISOString()}] AdminStats: Total products: ${totalProducts}`);

      // Products with images - استخدام aggregate للتحقق من وجود صور مرتبطة
      // نتحقق من وجود صور في جدول Image مرتبطة بالمنتج
      const productsWithImagesResult = await this.imageModel
        .aggregate([
          { $match: { product: { $ne: null } } },
          { $group: { _id: '$product' } },
          { $count: 'count' },
        ])
        .exec();
      const productsWithImages = productsWithImagesResult.length > 0 ? productsWithImagesResult[0].count : 0;
      console.log(`[${new Date().toISOString()}] AdminStats: Products with images: ${productsWithImages}`);

      // Products without images
      const productsWithoutImages = totalProducts - productsWithImages;
      console.log(`[${new Date().toISOString()}] AdminStats: Products without images: ${productsWithoutImages}`);

      // Images statistics (تابعة للمنتجات)
      const totalImages = await this.imageModel.countDocuments().exec();
      console.log(`[${new Date().toISOString()}] AdminStats: Total images: ${totalImages}`);

      // Watermarked images count
      const watermarkedCount = await this.imageModel.countDocuments({ isWatermarked: true }).exec();
      console.log(`[${new Date().toISOString()}] AdminStats: Watermarked: ${watermarkedCount}`);

      // Queue statistics
      const counts = await this.imageQueue.getJobCounts();
      const pendingJobs = counts.waiting + counts.active + counts.delayed;
      console.log(`[${new Date().toISOString()}] AdminStats: Pending jobs: ${pendingJobs}`);

      const result = {
        // Products (الأساس)
        totalProducts,
        productsWithImages,
        productsWithoutImages,
        // Images (تابعة)
        totalImages,
        watermarkedCount,
        pendingJobs,
      };

      console.log(`[${new Date().toISOString()}] AdminStats: Stats calculation completed`);
      return result;
    } catch (error) {
      console.error(`[${new Date().toISOString()}] AdminStats: Error calculating stats:`, error);
      throw error;
    }
  }
}
