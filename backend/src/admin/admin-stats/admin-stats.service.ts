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
    // Total images count
    const totalImages = await this.imageModel.countDocuments().exec();

    // Watermarked images count
    const watermarkedCount = await this.imageModel.countDocuments({ isWatermarked: true }).exec();

    // Queue statistics
    const counts = await this.imageQueue.getJobCounts();
    const pendingJobs = counts.waiting + counts.active + counts.delayed;

    return {
      totalImages,
      watermarkedCount,
      pendingJobs,
    };
  }
}
