import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsMongoId } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'اسم الفئة',
    example: 'إلكترونيات',
  })
  @IsString()
  @IsNotEmpty({ message: 'اسم الفئة مطلوب' })
  name: string;

  @ApiProperty({
    description: 'وصف الفئة',
    example: 'جميع الأجهزة الإلكترونية',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'رابط صورة الفئة',
    example: 'https://example.com/category.png',
    required: false,
  })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({
    description: 'معرف الفئة الأب (null للفئات الرئيسية)',
    example: '507f1f77bcf86cd799439011',
    required: false,
    nullable: true,
  })
  @IsMongoId({ message: 'معرّف الأب غير صالح' })
  @IsOptional()
  parent?: string;
}
