import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JobStatusController } from './job-status.controller';
import { JobStatusService } from './job-status.service';
import { JobStatusSchema } from '../database/schemas/job-status.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'JobStatus', schema: JobStatusSchema }])],
  controllers: [JobStatusController],
  providers: [JobStatusService],
  exports: [JobStatusService],
})
export class JobStatusModule {}
