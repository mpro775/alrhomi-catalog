import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'اسم المستخدم',
    example: 'john_doe',
  })
  @IsString()
  @IsNotEmpty({ message: 'اسم المستخدم مطلوب' })
  username: string;

  @ApiProperty({
    description: 'كلمة المرور',
    example: 'SecurePassword123',
  })
  @IsString()
  @IsNotEmpty({ message: 'كلمة المرور مطلوبة' })
  password: string;
}
