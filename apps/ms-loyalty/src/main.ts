import { NestFactory } from '@nestjs/core';
import { MsLoyaltyModule } from './ms-loyalty.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ResponseInterceptor } from '@app/common/interceptors/error.interceptor';
import { RpcToHttpExceptionFilter } from '@app/common/filters/rpc-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MsLoyaltyModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.API_HOST ?? 'localhost',
        port: Number(process.env.LOYALTY_PORT ?? 9995),
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
      `Loyalty service is running on port ${process.env.LOYALTY_PORT ?? 9995}`,
    );
  })
  .catch(() => {});
