import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ImageDocument = Image & Document;

@Schema({ timestamps: true })
export class Image {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Product',
    default: null,
  })
  product?: MongooseSchema.Types.ObjectId | null;

  @Prop({ required: true })
  originalUrl: string;

  @Prop({ default: '' })
  watermarkedUrl: string;

  @Prop({ default: false })
  isWatermarked: boolean;

  @Prop({ default: null })
  jobId: string;

  @Prop({
    enum: ['queued', 'processing', 'completed', 'failed'],
    default: 'queued',
  })
  status: string;

  @Prop({ min: 0, max: 100, default: 0 })
  progress: number;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
