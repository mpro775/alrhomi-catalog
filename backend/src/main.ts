import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS with better configuration
  app.enableCors({
    origin: true, // أو '*' للسماح لجميع المصادر
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global logging interceptor
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Product Catalog API')
    .setDescription('API documentation for Product Catalog Management System')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Authentication', 'Authentication endpoints')
    .addTag('Products', 'Product management endpoints')
    .addTag('Images', 'Image management endpoints')
    .addTag('Categories - Admin', 'Category management endpoints (Admin only)')
    .addTag('Admin - Users', 'User management endpoints (Admin only)')
    .addTag('Admin - Images', 'Image management endpoints (Admin only)')
    .addTag('Admin - Statistics', 'Statistics endpoints (Admin only)')
    .addTag('Job Status', 'Job status endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = parseInt(process.env.PORT || '5000', 10);
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Server running on port ${port}`);
  console.log(`📚 Swagger documentation available at http://localhost:${port}/api-docs`);
}

bootstrap();
