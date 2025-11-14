import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { ImagesModule } from './images/images.module';
import { AdminModule } from './admin/admin.module';
import { StorageModule } from './storage/storage.module';
import { QueueModule } from './queue/queue.module';
import { JobStatusModule } from './job-status/job-status.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    AuthModule,
    CategoriesModule,
    ProductsModule,
    ImagesModule,
    AdminModule,
    StorageModule,
    QueueModule,
    JobStatusModule,
    HealthModule,
  ],
})
export class AppModule {}
