import { Module, Logger, OnModuleInit } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redisConfig = configService.get('redis');
        const config = {
          redis: {
            host: redisConfig.host,
            port: redisConfig.port,
            username: redisConfig.username,
            password: redisConfig.password,
            ...(redisConfig.tls && { tls: redisConfig.tls }),
          },
        };
        console.log(`[${new Date().toISOString()}] QueueModule: Bull Redis config:`, {
          host: redisConfig.host,
          port: redisConfig.port,
          hasPassword: !!redisConfig.password,
        });
        return config;
      },
    }),
    BullModule.registerQueue({
      name: 'image-processing',
    }),
  ],
  exports: [BullModule],
})
export class QueueModule implements OnModuleInit {
  private readonly logger = new Logger(QueueModule.name);

  onModuleInit() {
    this.logger.log('🚀 QueueModule initialized');
    this.logger.log('✅ Bull queue "image-processing" registered');
  }
}
