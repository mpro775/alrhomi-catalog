import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type JobStatusDocument = JobStatus & Document;

@Schema()
export class JobStatus {
  @Prop({ required: true, unique: true })
  jobId: string;

  @Prop({
    enum: ['queued', 'processing', 'completed', 'failed'],
    default: 'queued',
  })
  status: string;

  @Prop({ min: 0, max: 100, default: 0 })
  progress: number;

  @Prop({ default: null })
  startedAt: Date;

  @Prop({ default: null })
  finishedAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const JobStatusSchema = SchemaFactory.createForClass(JobStatus);
