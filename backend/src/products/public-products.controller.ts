import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { ProductQueryDto } from './dto/product-query.dto';

@ApiTags('Products - Public')
@Controller('public/products')
export class PublicProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'جلب قائمة المنتجات للعرض العام' })
  @ApiResponse({
    status: 200,
    description: 'قائمة المنتجات مع الصور الأولى',
  })
  async findAll(@Query() queryDto: ProductQueryDto) {
    return this.productsService.findAllPublic(queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'جلب منتج واحد حسب المعرف' })
  @ApiResponse({
    status: 200,
    description: 'تفاصيل المنتج',
  })
  @ApiResponse({
    status: 404,
    description: 'المنتج غير موجود',
  })
  async findOne(@Param('id') id: string) {
    const product = await this.productsService.findOnePublic(id);
    if (!product) {
      throw new NotFoundException('المنتج غير موجود');
    }
    return product;
  }
}

