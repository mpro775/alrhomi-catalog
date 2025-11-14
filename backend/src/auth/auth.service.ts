import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { UserDocument } from '../database/schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { UserPayload } from '../common/interfaces/user.interface';

@Injectable()
export class AuthService {
  private readonly saltRounds = 10;

  constructor(
    @InjectModel('User') private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ message: string }> {
    const { username, email, password, role } = registerDto;

    // Check if user already exists
    const existingUser = await this.userModel.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      throw new ConflictException('المستخدم موجود مسبقاً');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, this.saltRounds);

    // Create user
    await this.userModel.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    return { message: 'تم إنشاء الحساب' };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { username, password } = loginDto;

    // Find user
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) {
      throw new UnauthorizedException('بيانات غير صحيحة');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('بيانات غير صحيحة');
    }

    // Generate JWT token
    const payload: UserPayload = {
      sub: user.id,
      role: user.role as 'rep' | 'admin',
    };

    const jwtConfig = this.configService.get('jwt');
    const token = this.jwtService.sign(payload, {
      expiresIn: jwtConfig.expiresIn,
    });

    return {
      token,
      role: user.role as 'rep' | 'admin',
    };
  }
}
