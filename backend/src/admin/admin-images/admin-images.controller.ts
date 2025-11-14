import { Controller, Get, Delete, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminImagesService } from './admin-images.service';
import { AdminImageQueryDto } from './dto/admin-image-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Admin - Images')
@Controller('admin/images')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@ApiBearerAuth()
export class AdminImagesController {
  constructor(private readonly adminImagesService: AdminImagesService) {}

  @Get()
  @ApiOperation({ summary: 'جلب قائمة جميع الصور' })
  @ApiResponse({
    status: 200,
    description: 'قائمة الصور مع حالة المعالجة',
  })
  async findAll(@Query() queryDto: AdminImageQueryDto) {
    return this.adminImagesService.findAll(queryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'حذف صورة' })
  @ApiResponse({
    status: 200,
    description: 'تم حذف الصورة بنجاح',
  })
  @ApiResponse({
    status: 404,
    description: 'الصورة غير موجودة',
  })
  async remove(@Param('id') id: string) {
    return this.adminImagesService.remove(id);
  }
}
