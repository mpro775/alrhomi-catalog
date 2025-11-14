import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesController } from './categories.controller';
import { PublicCategoriesController } from './public-categories.controller';
import { CategoriesService } from './categories.service';
import { CategorySchema } from '../database/schemas/category.schema';
import { ProductSchema } from '../database/schemas/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Category', schema: CategorySchema },
      { name: 'Product', schema: ProductSchema },
    ]),
  ],
  controllers: [CategoriesController, PublicCategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
