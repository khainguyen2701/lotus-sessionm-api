import { RpcToHttpExceptionFilter } from '@app/common/filters/rpc-exception.filter';
import { ResponseInterceptor } from '@app/common/interceptors/error.interceptor';
import { TransformInterceptor } from '@app/common/interceptors/transform.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new RpcToHttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(process.env.PORT_API_GATEWAY ?? 9999);
}

bootstrap()
  .then(() => {
    console.log(
      `API Gateway is running on port ${process.env.PORT_API_GATEWAY ?? 9999}`,
    );
  })
  .catch((err) => {
    console.error('Error starting API Gateway:', err);
    process.exit(1);
  });
