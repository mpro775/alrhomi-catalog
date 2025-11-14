import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception instanceof HttpException ? exception.getResponse() : 'فشل العملية';
    const errorPayload =
      typeof message === 'string' ? { error: message } : (message as Record<string, unknown>);

    // تسجيل الخطأ
    console.error(
      `[${new Date().toISOString()}] ERROR ${request.method} ${request.url} ${status}`,
      exception instanceof Error ? exception.message : 'Unknown error',
    );
    if (exception instanceof Error && exception.stack) {
      console.error('Stack trace:', exception.stack);
    }

    response.status(status).json({
      ...errorPayload,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
