import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsOptional } from 'class-validator';

export class UploadImageDto {
  @ApiPropertyOptional({
    description: 'معرّف المنتج الذي ستُربط به الصورة (اختياري)',
    example: '665f1f77bcf86cd799439099',
  })
  @IsOptional()
  @IsMongoId({ message: 'معرّف المنتج غير صالح' })
  productId?: string;
}
