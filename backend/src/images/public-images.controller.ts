import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ImagesService } from './images.service';
import { ImageQueryDto } from './dto/image-query.dto';

@ApiTags('Images - Public')
@Controller('public/images')
export class PublicImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get()
  @ApiOperation({ summary: 'جلب قائمة الصور للعرض العام' })
  @ApiResponse({
    status: 200,
    description: 'قائمة الصور',
  })
  async findAll(@Query() queryDto: ImageQueryDto) {
    return this.imagesService.findAll(queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'جلب صورة واحدة حسب المعرف' })
  @ApiResponse({
    status: 200,
    description: 'تفاصيل الصورة',
  })
  @ApiResponse({
    status: 404,
    description: 'الصورة غير موجودة',
  })
  async findOne(@Param('id') id: string) {
    // نفس الكود من findAll ولكن لصورة واحدة
    const result = await this.imagesService.findAll({
      ids: id,
      page: 1,
      limit: 1,
    });

    if (!result.items || result.items.length === 0) {
      throw new NotFoundException('الصورة غير موجودة');
    }

    return result.items[0];
  }

  @Get(':id/related')
  @ApiOperation({ summary: 'جلب المنتجات المشابهة بناءً على الفئة الفرعية أو الرئيسية' })
  @ApiResponse({
    status: 200,
    description: 'قائمة المنتجات المشابهة',
  })
  @ApiResponse({
    status: 404,
    description: 'الصورة غير موجودة',
  })
  async findRelated(@Param('id') id: string) {
    return this.imagesService.findRelated(id);
  }
}
