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

    console.log(`[AuthService] Login attempt for username: ${username}`);

    // Find user
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) {
      console.error(`[AuthService] ❌ User not found: ${username}`);
      // Check if any users exist
      const userCount = await this.userModel.countDocuments().exec();
      console.log(`[AuthService] Total users in database: ${userCount}`);
      throw new UnauthorizedException('بيانات غير صحيحة');
    }

    console.log(`[AuthService] ✓ User found: ${username}, role: ${user.role}`);

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.error(`[AuthService] ❌ Invalid password for user: ${username}`);
      throw new UnauthorizedException('بيانات غير صحيحة');
    }

    console.log(`[AuthService] ✓ Password verified for user: ${username}`);

    // Generate JWT token
    // Use _id.toString() instead of id for MongoDB
    const userId = user._id ? user._id.toString() : (user as any).id;
    const payload: UserPayload = {
      sub: userId,
      role: user.role as 'rep' | 'admin',
    };

    const jwtConfig = this.configService.get('jwt');
    const token = this.jwtService.sign(payload, {
      expiresIn: jwtConfig.expiresIn,
    });

    console.log(`[AuthService] Login successful for user: ${username}, role: ${user.role}`);

    return {
      token,
      role: user.role as 'rep' | 'admin',
    };
  }
}
