import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
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
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'القيم داخل هذا المتغير',
    example: ['5kg', '10kg'],
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'يجب توفير قيمة واحدة على الأقل للمتغير' })
  @IsString({ each: true })
  @IsOptional()
  values?: string[];
}

export class UpdateProductDto {
  @ApiProperty({
    description: 'رقم/رمز المنتج (Q.R)',
    required: false,
  })
  @IsString()
  @IsOptional()
  productCode?: string;

  @ApiProperty({
    description: 'معرف الفئة الرئيسية',
    required: false,
  })
  @IsMongoId({ message: 'معرّف الفئة غير صالح' })
  @IsOptional()
  category?: string;

  @ApiProperty({
    description: 'معرف الفئة الفرعية',
    required: false,
    nullable: true,
  })
  @IsMongoId({ message: 'معرّف الفئة الفرعية غير صالح' })
  @IsOptional()
  subcategory?: string | null;

  @ApiProperty({
    description: 'الماركة',
    required: false,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  model?: string;

  @ApiProperty({
    description: 'اسم المنتج',
    required: false,
  })
  @IsString()
  @IsOptional()
  productName?: string;

  @ApiProperty({
    description: 'المقاسات/الأوزان',
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
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({
    description: 'ملاحظة',
    required: false,
  })
  @IsString()
  @IsOptional()
  note?: string;

  @ApiProperty({
    description: 'وصف المنتج',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'قائمة معرّفات الصور المرتبطة (يتم استبدال القائمة الحالية)',
    required: false,
    type: [String],
  })
  @IsArray()
  @IsMongoId({ each: true, message: 'أحد معرّفات الصور غير صالح' })
  @IsOptional()
  imageIds?: string[];

  @ApiProperty({
    description: 'معرّفات المنتجات المشابهة (يتم استبدال القائمة الحالية)',
    required: false,
    type: [String],
  })
  @IsArray()
  @IsMongoId({ each: true, message: 'أحد معرّفات المنتجات المشابهة غير صالح' })
  @IsOptional()
  similarProductIds?: string[];
}
