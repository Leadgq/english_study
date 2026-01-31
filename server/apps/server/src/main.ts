import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { InterceptorExceptionFilter } from '@libs/shared/interceptor/exceptionFilter';
import { InterceptorInterceptor } from '@libs/shared/interceptor/interceptor';
import { Config } from '@en/config';
import { VersioningType } from '@nestjs/common';
import { HttpStatus, ValidationPipe, BadRequestException } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      exceptionFactory: (errors) => {
        // 将自定义响应体作为第二个参数传递
        return new BadRequestException({
          code: HttpStatus.BAD_REQUEST,
          message: errors.map((error) => ({
            field: error.property,
            messages: Object.values(error.constraints || {}).map((item) => item),
          })),
          success: false
        });
      },
    }),
  );
  
  app.useGlobalInterceptors(new InterceptorInterceptor());
  app.useGlobalFilters(new InterceptorExceptionFilter());
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  
  await app.listen(Config.ports.server);
}
bootstrap();