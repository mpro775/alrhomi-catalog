import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { UserSchema } from './schemas/user.schema';
import { ProductSchema } from './schemas/product.schema';
import { ImageSchema } from './schemas/image.schema';
import { CategorySchema } from './schemas/category.schema';
import { JobStatusSchema } from './schemas/job-status.schema';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseConfig = configService.get('database');
        return {
          uri: databaseConfig.uri,
          ...databaseConfig.options,
        };
      },
    }),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Product', schema: ProductSchema },
      { name: 'Image', schema: ImageSchema },
      { name: 'Category', schema: CategorySchema },
      { name: 'JobStatus', schema: JobStatusSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
