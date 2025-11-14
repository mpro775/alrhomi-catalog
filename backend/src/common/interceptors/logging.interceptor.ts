import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const ip = request.ip || request.connection?.remoteAddress || 'unknown';
    const now = Date.now();

    // تسجيل الطلب الوارد
    console.log(`[${new Date().toISOString()}] ${method} ${url} from ${ip}`);

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const delay = Date.now() - now;
        console.log(`[${new Date().toISOString()}] ${method} ${url} ${response.statusCode} - ${delay}ms`);
      }),
      catchError((error) => {
        const response = context.switchToHttp().getResponse();
        const delay = Date.now() - now;
        const status = error?.status || response.statusCode || 500;
        console.error(
          `[${new Date().toISOString()}] ${method} ${url} ERROR ${status} - ${delay}ms`,
          error.message || error,
        );
        return throwError(() => error);
      }),
    );
  }
}
