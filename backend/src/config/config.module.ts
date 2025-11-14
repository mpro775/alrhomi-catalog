import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import databaseConfig from './database.config';
import awsConfig from './aws.config';
import redisConfig from './redis.config';
import jwtConfig from './jwt.config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, awsConfig, redisConfig, jwtConfig],
      envFilePath: '.env',
    }),
  ],
  exports: [NestConfigModule],
})
export class ConfigModule {}
