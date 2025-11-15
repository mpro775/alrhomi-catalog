import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Model } from 'mongoose';
import { ImageDocument } from '../../database/schemas/image.schema';

@Injectable()
export class AdminStatsService {
  constructor(
    @InjectModel('Image')
    private imageModel: Model<ImageDocument>,
    @InjectQueue('image-processing')
    private imageQueue: Queue,
  ) {}

  async getStats() {
    try {
      console.log(`[${new Date().toISOString()}] AdminStats: Starting stats calculation`);
      
      // Total images count
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
