import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const timestamp = new Date().toISOString();
      console.error(
        `[${timestamp}] JWT Auth failed: No authorization header for ${request.method} ${request.url}`,
      );
      throw new UnauthorizedException('توكن المصادقة مطلوب');
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const request = context?.switchToHttp()?.getRequest();
    const url = request?.url || 'unknown';
    const method = request?.method || 'unknown';
    const timestamp = new Date().toISOString();

    if (err) {
      console.error(
        `[${timestamp}] JWT validation error for ${method} ${url}:`,
        err.message || err,
      );
      throw err instanceof UnauthorizedException
        ? err
        : new UnauthorizedException('توكن المصادقة غير صالح');
    }

    if (!user) {
      console.error(
        `[${timestamp}] JWT validation failed: No user for ${method} ${url}`,
        info?.message || 'Unknown reason',
      );
      throw new UnauthorizedException('توكن المصادقة غير صالح');
    }

    return user;
  }
}
