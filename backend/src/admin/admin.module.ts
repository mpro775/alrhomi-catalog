import { Module } from '@nestjs/common';
import { AdminUsersModule } from './admin-users/admin-users.module';
import { AdminImagesModule } from './admin-images/admin-images.module';
import { AdminStatsModule } from './admin-stats/admin-stats.module';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [AdminUsersModule, AdminImagesModule, AdminStatsModule, CategoriesModule],
})
export class AdminModule {}
