import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';

@ApiTags('Categories - Public')
@Controller('categories')
export class PublicCategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'جلب قائمة الفئات للعرض العام' })
  @ApiResponse({
    status: 200,
    description: 'قائمة الفئات',
  })
  async findAll() {
    // استدعاء نفس الـ service method
    // يمكن إضافة pagination لاحقاً إذا لزم الأمر
    return this.categoriesService.findAll();
  }
}
