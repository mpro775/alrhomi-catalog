import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminImagesController } from './admin-images.controller';
import { AdminImagesService } from './admin-images.service';
import { ImageSchema } from '../../database/schemas/image.schema';
import { ProductSchema } from '../../database/schemas/product.schema';
import { JobStatusSchema } from '../../database/schemas/job-status.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Image', schema: ImageSchema },
      { name: 'Product', schema: ProductSchema },
      { name: 'JobStatus', schema: JobStatusSchema },
    ]),
  ],
  controllers: [AdminImagesController],
  providers: [AdminImagesService],
  exports: [AdminImagesService],
})
export class AdminImagesModule {}
