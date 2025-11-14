import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Categories - Admin')
@Controller('admin/categories')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@ApiBearerAuth()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'جلب قائمة جميع الفئات' })
  @ApiResponse({
    status: 200,
    description: 'قائمة الفئات',
  })
  async findAll() {
    return this.categoriesService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'إنشاء فئة جديدة' })
  @ApiResponse({
    status: 201,
    description: 'تم إنشاء الفئة بنجاح',
  })
  @ApiResponse({
    status: 400,
    description: 'بيانات غير صحيحة',
  })
  @ApiResponse({
    status: 409,
    description: 'الفئة موجودة مسبقاً',
  })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'تحديث فئة موجودة' })
  @ApiResponse({
    status: 200,
    description: 'تم تحديث الفئة بنجاح',
  })
  @ApiResponse({
    status: 404,
    description: 'الفئة غير موجودة',
  })
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'حذف فئة' })
  @ApiResponse({
    status: 200,
    description: 'تم حذف الفئة بنجاح',
  })
  @ApiResponse({
    status: 400,
    description: 'لا يمكن حذف فئة لأنها تحتوي على فئات فرعية',
  })
  @ApiResponse({
    status: 404,
    description: 'الفئة غير موجودة',
  })
  async remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
