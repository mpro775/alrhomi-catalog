import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({
    required: true,
    unique: true,
    index: true,
  })
  productCode: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Category',
    required: true,
  })
  category: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Category',
    default: null,
  })
  subcategory?: MongooseSchema.Types.ObjectId;

  @Prop({ default: null })
  model?: string;

  @Prop({ required: true })
  productName: string;

  @Prop()
  description?: string;

  @Prop({
    type: [
      {
        name: { type: String, required: true },
        values: { type: [String], default: [] },
      },
    ],
    default: [],
  })
  variants: { name: string; values: string[] }[];

  @Prop({ type: [String] })
  tags: string[];

  @Prop()
  note?: string;

  @Prop({
    type: [MongooseSchema.Types.ObjectId],
    ref: 'Image',
    default: [],
  })
  images: MongooseSchema.Types.ObjectId[];

  @Prop({
    type: [MongooseSchema.Types.ObjectId],
    ref: 'Product',
    default: [],
  })
  similarProducts: MongooseSchema.Types.ObjectId[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// Text index for full-text search
ProductSchema.index({
  productName: 'text',
  description: 'text',
  tags: 'text',
  note: 'text',
  productCode: 'text',
});
