import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from '../../database/schemas/user.schema';
import { UserPayload } from '../../common/interfaces/user.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectModel('User') private userModel: Model<UserDocument>,
  ) {
    const jwtConfig = configService.get('jwt');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.secret,
    });
  }

  async validate(payload: UserPayload): Promise<UserPayload> {
    try {
      console.log(`[${new Date().toISOString()}] JWT validate: Starting validation for sub=${payload?.sub}`);
      
      if (!payload || !payload.sub) {
        console.error(`[${new Date().toISOString()}] JWT validate: Invalid payload`, payload);
        throw new UnauthorizedException('حمولة التوكن غير صالحة');
      }

      console.log(`[${new Date().toISOString()}] JWT validate: Looking up user ${payload.sub}`);
      const user = await this.userModel.findById(payload.sub).exec();
      
      if (!user) {
        console.error(`[${new Date().toISOString()}] JWT validate: User not found`, payload.sub);
        throw new UnauthorizedException('المستخدم غير موجود');
      }

      console.log(`[${new Date().toISOString()}] JWT validate: User found, role=${user.role}`);
      return { sub: payload.sub, role: payload.role };
    } catch (error) {
      console.error(`[${new Date().toISOString()}] JWT validate error:`, error);
      throw error;
    }
  }
}
