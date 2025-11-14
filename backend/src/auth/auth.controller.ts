import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'تسجيل مستخدم جديد' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'تم إنشاء الحساب بنجاح',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'تم إنشاء الحساب',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'بيانات غير صحيحة',
  })
  @ApiResponse({
    status: 409,
    description: 'المستخدم موجود مسبقاً',
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'تسجيل الدخول' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'تم تسجيل الدخول بنجاح',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'بيانات غير صحيحة',
  })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }
}
