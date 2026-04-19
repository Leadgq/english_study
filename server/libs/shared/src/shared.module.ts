import { Module, Global } from '@nestjs/common';
import { SharedService } from './shared.service';
import { PrismaModule } from './prisma/prisma.module';
import { ResponseModule } from './response/response.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MinioModule } from './minio/minio.module';
import { PayModule } from './pay/pay.module';
import { EmailModule } from './email/email.module';
import { BullModule } from  "@nestjs/bullmq"
@Global()
@Module({
  providers: [SharedService],
  exports: [
    SharedService,
    PrismaModule,
    ResponseModule,
    JwtModule,
    ConfigModule,
    MinioModule,
    PayModule,
    EmailModule,
  ],
  imports: [
    PrismaModule,
    ResponseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const rawPort = configService.get<string | number>('REDIS_PORT');
        const port = Number(rawPort);
        const host = configService.get<string>('REDIS_HOST') ?? '127.0.0.1';
        const password = configService.get<string>('REDIS_PASSWORD');
        return {
          connection: {
            host,
            port: Number.isFinite(port) ? port : 6379,
            maxRetriesPerRequest: null,
            enableReadyCheck: true,
            // Windows 上 localhost 常解析到 IPv6，与仅监听 127.0.0.1 的 Redis 组合时易异常
            family: 4,
            keepAlive: 30_000,
            connectTimeout: 10_000,
            retryStrategy: (times: number) => Math.min(times * 100, 3_000),
            ...(password ? { password } : {}),
          },
        };
      },
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('SECRET_KEY'),
        signOptions: { expiresIn: '1d' }
      }),
    }),
    MinioModule,
    PayModule,
    EmailModule,
  ],
})
export class SharedModule { }
