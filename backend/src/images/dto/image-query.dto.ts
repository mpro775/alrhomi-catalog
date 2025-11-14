import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class ImageQueryDto {
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
    required: false,
    default: 24,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 24;

  @ApiProperty({
    description: 'البحث في اسم المنتج، الموديل، التاغز، أو الملاحظات',
    required: false,
  })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiProperty({
    description: 'فلترة حسب الفئة',
    required: false,
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({
    description: 'فلترة حسب الموديل',
    required: false,
  })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional({
    description: 'تحديد ما إذا كانت الصورة مرتبطة بمنتج',
    example: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  assigned?: boolean;

  @ApiPropertyOptional({
    description: 'قائمة معرّفات الصور (مفصولة بفواصل) لجلب عناصر محددة',
    example: '665f1f77bcf86cd799439099,665f1f77bcf86cd79943909a',
  })
  @IsOptional()
  @IsString()
  ids?: string;
}
