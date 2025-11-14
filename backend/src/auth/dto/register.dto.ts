import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, MinLength, IsEnum } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'اسم المستخدم (يجب أن يكون فريداً)',
    example: 'john_doe',
  })
  @IsString()
  @IsNotEmpty({ message: 'اسم المستخدم مطلوب' })
  username: string;

  @ApiProperty({
    description: 'البريد الإلكتروني (يجب أن يكون فريداً)',
    example: 'john@example.com',
    format: 'email',
  })
  @IsEmail({}, { message: 'البريد الإلكتروني غير صالح' })
  @IsNotEmpty({ message: 'البريد الإلكتروني مطلوب' })
  email: string;

  @ApiProperty({
    description: 'كلمة المرور',
    example: 'SecurePassword123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6, { message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' })
  @IsNotEmpty({ message: 'كلمة المرور مطلوبة' })
  password: string;

  @ApiProperty({
    description: 'دور المستخدم',
    enum: ['rep', 'admin'],
    example: 'rep',
  })
  @IsEnum(['rep', 'admin'], { message: 'الدور يجب أن يكون rep أو admin' })
  @IsNotEmpty({ message: 'الدور مطلوب' })
  role: 'rep' | 'admin';
}
