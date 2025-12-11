import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsMongoId,
  IsArray,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

class VariantDto {
  @ApiProperty({
    description: 'اسم مجموعة المتغيرات (مثل المقاسات، الأوزان)',
    example: 'المقاسات',
  })
  @IsString()
  @IsNotEmpty({ message: 'اسم المتغير مطلوب' })
  name: string;

  @ApiProperty({
    description: 'القيم داخل هذا المتغير',
    example: ['5kg', '10kg'],
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'يجب توفير قيمة واحدة على الأقل للمتغير' })
  @IsString({ each: true })
  values: string[];
}

export class CreateProductDto {
  @ApiProperty({
    description: 'رقم/رمز المنتج (Q.R)',
    example: 'QR-2024-XYZ',
  })
  @IsString()
  @IsNotEmpty({ message: 'رقم المنتج مطلوب' })
  productCode: string;

  @ApiProperty({
    description: 'معرف الفئة الرئيسية',
    example: '507f1f77bcf86cd799439012',
  })
  @IsMongoId({ message: 'معرّف الفئة غير صالح' })
  @IsNotEmpty({ message: 'حقل الفئة مطلوب' })
  category: string;

  @ApiProperty({
    description: 'معرف الفئة الفرعية',
    example: '507f1f77bcf86cd799439013',
    required: false,
    nullable: true,
  })
  @IsMongoId({ message: 'معرّف الفئة الفرعية غير صالح' })
  @IsOptional()
  subcategory?: string;

  @ApiProperty({
    description: 'الماركة (اختياري)',
    example: 'BrandX',
    required: false,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  model?: string;

  @ApiProperty({
    description: 'اسم المنتج',
    example: 'هاتف ذكي',
  })
  @IsString()
  @IsNotEmpty({ message: 'حقل اسم المنتج مطلوب' })
  productName: string;

  @ApiProperty({
    description: 'المقاسات/الأوزان',
    example: [
      { name: 'المقاسات', values: ['S', 'M', 'L'] },
      { name: 'الأوزان', values: ['5kg', '10kg'] },
    ],
    required: false,
    type: [VariantDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantDto)
  @IsOptional()
  variants?: VariantDto[];

  @ApiProperty({
    description: 'التاغز',
    example: ['إلكترونيات', 'هواتف'],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({
    description: 'ملاحظة',
    example: 'ملاحظة خاصة',
    required: false,
  })
  @IsString()
  @IsOptional()
  note?: string;

  @ApiProperty({
    description: 'وصف المنتج',
    example: 'وصف مختصر يوضح مزايا المنتج',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'معرّفات الصور المرتبطة بالمنتج (من مكتبة الوسائط)',
    example: ['665f1f77bcf86cd799439099', '665f1f77bcf86cd79943909a'],
    required: false,
    type: [String],
  })
  @IsArray()
  @IsMongoId({ each: true, message: 'أحد معرّفات الصور غير صالح' })
  @IsOptional()
  imageIds?: string[];

  @ApiProperty({
    description: 'معرّفات المنتجات المشابهة',
    example: ['665f1f77bcf86cd799439099', '665f1f77bcf86cd79943909a'],
    required: false,
    type: [String],
  })
  @IsArray()
  @IsMongoId({ each: true, message: 'أحد معرّفات المنتجات المشابهة غير صالح' })
  @IsOptional()
  similarProductIds?: string[];
}
