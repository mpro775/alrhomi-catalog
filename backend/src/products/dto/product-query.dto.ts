import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductQueryDto {
  @ApiProperty({
    description: 'رقم الصفحة',
    example: 1,
    minimum: 1,
    required: false,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'عدد العناصر في الصفحة',
    example: 24,
    minimum: 1,
    maximum: 100,
    required: false,
    default: 24,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 24;

  @ApiProperty({
    description: 'البحث في اسم المنتج، الماركة، التاغز، أو الملاحظات',
    required: false,
  })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiProperty({
    description: 'فلترة حسب الفئة (ObjectId)',
    required: false,
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({
    description: 'فلترة حسب الماركة',
    required: false,
  })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiProperty({
    description: 'فلترة حسب رقم/رمز المنتج',
    required: false,
  })
  @IsOptional()
  @IsString()
  productCode?: string;
}
