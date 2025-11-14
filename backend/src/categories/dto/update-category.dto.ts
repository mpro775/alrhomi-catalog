import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsMongoId } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({
    description: 'اسم الفئة',
    example: 'إلكترونيات محدثة',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'وصف الفئة',
    example: 'وصف محدث',
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
    example: '507f1f77bcf86cd799439012',
    required: false,
    nullable: true,
  })
  @IsMongoId({ message: 'معرّف الأب غير صالح' })
  @IsOptional()
  parent?: string;
}
