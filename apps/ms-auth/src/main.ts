import { RpcToHttpExceptionFilter } from '@app/common/filters/rpc-exception.filter';
import { ResponseInterceptor } from '@app/common/interceptors/error.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { MsAuthModule } from './ms-auth.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MsAuthModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.API_HOST ?? 'localhost',
        port: Number(process.env.PORT_AUTH ?? 9997),
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
      `Auth service is running on port ${process.env.PORT_AUTH ?? 9996}`,
    );
  })
  .catch(() => {});
