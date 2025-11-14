import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JobStatusService } from './job-status.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Job Status')
@Controller()
export class JobStatusController {
  constructor(private readonly jobStatusService: JobStatusService) {}

  @Get('jobs/:jobId/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'جلب حالة المهمة' })
  @ApiParam({ name: 'jobId', description: 'معرف المهمة' })
  @ApiResponse({
    status: 200,
    description: 'حالة المهمة',
  })
  @ApiResponse({
    status: 404,
    description: 'المهمة غير موجودة',
  })
  async getJobStatus(@Param('jobId') jobId: string) {
    return this.jobStatusService.getJobStatus(jobId);
  }

  @Get('job-status/:jobId')
  @Public()
  @ApiOperation({ summary: 'جلب حالة المهمة (عام)' })
  @ApiParam({ name: 'jobId', description: 'معرف المهمة' })
  @ApiResponse({
    status: 200,
    description: 'حالة المهمة المبسطة',
  })
  @ApiResponse({
    status: 404,
    description: 'المهمة غير موجودة',
  })
  async getJobStatusSimple(@Param('jobId') jobId: string) {
    return this.jobStatusService.getJobStatusSimple(jobId);
  }
}
