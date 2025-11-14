import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JobStatusDocument } from '../database/schemas/job-status.schema';

@Injectable()
export class JobStatusService {
  constructor(
    @InjectModel('JobStatus')
    private jobStatusModel: Model<JobStatusDocument>,
  ) {}

  async getJobStatus(jobId: string) {
    const jobStatus = await this.jobStatusModel.findOne({ jobId }).exec();
    if (!jobStatus) {
      throw new NotFoundException('Job not found');
    }
    return {
      status: jobStatus.status,
      progress: jobStatus.progress,
      startedAt: jobStatus.startedAt,
      finishedAt: jobStatus.finishedAt,
    };
  }

  async getJobStatusSimple(jobId: string) {
    const jobStatus = await this.jobStatusModel.findOne({ jobId }).exec();
    if (!jobStatus) {
      throw new NotFoundException('Not found');
    }
    return {
      status: jobStatus.status,
      progress: jobStatus.progress,
    };
  }
}
