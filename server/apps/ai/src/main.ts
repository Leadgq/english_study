import { NestFactory } from '@nestjs/core';
import { AiModule } from './ai.module';
import { InterceptorExceptionFilter } from '@libs/shared/interceptor/exceptionFilter';
import { InterceptorInterceptor } from '@libs/shared/interceptor/interceptor';
import { Config } from '@en/config';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AiModule);
  app.useGlobalInterceptors(new InterceptorInterceptor());
  app.useGlobalFilters(new InterceptorExceptionFilter());
  // 设置全局前缀
  app.setGlobalPrefix('ai');
  // 版本号
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  await app.listen(Config.ports.ai);
}
bootstrap();
