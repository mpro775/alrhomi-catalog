import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminStatsService } from './admin-stats.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Admin - Statistics')
@Controller('admin/stats')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@ApiBearerAuth()
export class AdminStatsController {
  constructor(private readonly adminStatsService: AdminStatsService) {}

  @Get()
  @ApiOperation({ summary: 'جلب إحصائيات النظام' })
  @ApiResponse({
    status: 200,
    description: 'إحصائيات النظام',
    schema: {
      type: 'object',
      properties: {
        totalProducts: {
          type: 'number',
          description: 'إجمالي عدد المنتجات في النظام',
          example: 100,
        },
        productsWithImages: {
          type: 'number',
          description: 'عدد المنتجات التي تحتوي على صور',
          example: 85,
        },
        productsWithoutImages: {
          type: 'number',
          description: 'عدد المنتجات التي لا تحتوي على صور',
          example: 15,
        },
        totalImages: {
          type: 'number',
          description: 'إجمالي عدد الصور في النظام',
          example: 150,
        },
        watermarkedCount: {
          type: 'number',
          description: 'عدد الصور المعلّمة (مع علامة مائية)',
          example: 120,
        },
        pendingJobs: {
          type: 'number',
          description: 'عدد المهام المعلّقة في الطابور',
          example: 5,
        },
      },
    },
  })
  async getStats() {
    console.log(`[${new Date().toISOString()}] AdminStats: Request received`);
    try {
      const result = await this.adminStatsService.getStats();
      console.log(`[${new Date().toISOString()}] AdminStats: Request completed successfully`);
      return result;
    } catch (error) {
      console.error(`[${new Date().toISOString()}] AdminStats: Request failed:`, error);
      throw error;
    }
  }
}
