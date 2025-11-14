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
    const user = await this.userModel.findById(payload.sub).exec();
    if (!user) {
      throw new UnauthorizedException('المستخدم غير موجود');
    }
    return { sub: payload.sub, role: payload.role };
  }
}
