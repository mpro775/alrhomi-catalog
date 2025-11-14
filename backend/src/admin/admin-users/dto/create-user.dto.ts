import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, IsEnum } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'اسم المستخدم',
    example: 'john_doe',
  })
  @IsString()
  @IsNotEmpty({ message: 'اسم المستخدم مطلوب' })
  username: string;

  @ApiProperty({
    description: 'البريد الإلكتروني',
    example: 'john@example.com',
  })
  @IsEmail({}, { message: 'البريد الإلكتروني غير صالح' })
  @IsNotEmpty({ message: 'البريد الإلكتروني مطلوب' })
  email: string;

  @ApiProperty({
    description: 'دور المستخدم',
    enum: ['rep', 'admin'],
    example: 'rep',
  })
  @IsEnum(['rep', 'admin'], { message: 'الدور يجب أن يكون rep أو admin' })
  @IsNotEmpty({ message: 'الدور مطلوب' })
  role: 'rep' | 'admin';
}
