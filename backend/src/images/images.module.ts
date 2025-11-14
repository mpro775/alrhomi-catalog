import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
import { ImagesController } from './images.controller';
import { PublicImagesController } from './public-images.controller';
import { ImagesService } from './images.service';
import { WatermarkProcessor } from './processors/watermark.processor';
import { ProductSchema } from '../database/schemas/product.schema';
import { ImageSchema } from '../database/schemas/image.schema';
import { CategorySchema } from '../database/schemas/category.schema';
import { JobStatusSchema } from '../database/schemas/job-status.schema';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Product', schema: ProductSchema },
      { name: 'Image', schema: ImageSchema },
      { name: 'Category', schema: CategorySchema },
      { name: 'JobStatus', schema: JobStatusSchema },
    ]),
    BullModule.registerQueue({
      name: 'image-processing',
    }),
    StorageModule,
  ],
  controllers: [ImagesController, PublicImagesController],
  providers: [ImagesService, WatermarkProcessor],
  exports: [ImagesService],
})
export class ImagesModule {}
