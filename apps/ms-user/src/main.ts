/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { RpcToHttpExceptionFilter } from '@app/common/filters/rpc-exception.filter';
import { ResponseInterceptor } from '@app/common/interceptors/error.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { UserModule } from './user.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.API_HOST ?? 'localhost',
        port: Number(process.env.PORT_USER ?? 9998),
      },
    },
  );

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new RpcToHttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen();
}

bootstrap()
  .then(() => {
    console.log(
      `User service is running on port ${process.env.PORT_USER ?? 9998}`,
    );
  })
  .catch((err) => {
    console.error('Error starting User service:', err);
    process.exit(1);
  });
