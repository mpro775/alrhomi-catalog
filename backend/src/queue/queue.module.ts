import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redisConfig = configService.get('redis');
        return {
          redis: {
            host: redisConfig.host,
            port: redisConfig.port,
            username: redisConfig.username,
            password: redisConfig.password,
            ...(redisConfig.tls && { tls: redisConfig.tls }),
          },
        };
      },
    }),
    BullModule.registerQueue({
      name: 'image-processing',
    }),
  ],
  exports: [BullModule],
})
export class QueueModule {}
