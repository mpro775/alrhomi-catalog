import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Products')
@Controller('products')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'جلب قائمة المنتجات' })
  @ApiResponse({
    status: 200,
    description: 'قائمة المنتجات',
  })
  async findAll(@Query() queryDto: ProductQueryDto) {
    return this.productsService.findAll(queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'جلب منتج واحد' })
  @ApiResponse({
    status: 200,
    description: 'تفاصيل المنتج',
  })
  @ApiResponse({
    status: 404,
    description: 'المنتج غير موجود',
  })
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'إنشاء منتج جديد' })
  @ApiResponse({
    status: 201,
    description: 'تم إنشاء المنتج بنجاح',
  })
  @ApiResponse({
    status: 400,
    description: 'بيانات غير صحيحة',
  })
  @ApiResponse({
    status: 409,
    description: 'المنتج موجود مسبقاً',
  })
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'تحديث منتج' })
  @ApiResponse({
    status: 200,
    description: 'تم تحديث المنتج بنجاح',
  })
  @ApiResponse({
    status: 404,
    description: 'المنتج غير موجود',
  })
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'حذف منتج' })
  @ApiResponse({
    status: 200,
    description: 'تم حذف المنتج بنجاح',
  })
  @ApiResponse({
    status: 400,
    description: 'لا يمكن حذف منتج يحتوي على صور مرتبطة',
  })
  @ApiResponse({
    status: 404,
    description: 'المنتج غير موجود',
  })
  async remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
