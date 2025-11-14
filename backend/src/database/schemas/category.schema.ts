import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description?: string;

  @Prop()
  image?: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Category',
    default: null,
  })
  parent?: MongooseSchema.Types.ObjectId;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

// Text index
CategorySchema.index({ name: 'text', description: 'text' });

// Virtual for children
CategorySchema.virtual('children', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent',
});
