import { RpcToHttpExceptionFilter } from '@app/common/filters/rpc-exception.filter';
import { ResponseInterceptor } from '@app/common/interceptors/error.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { MsRewardModule } from './ms-reward.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MsRewardModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.API_HOST ?? 'localhost',
        port: Number(process.env.REWARD_PORT ?? 9996),
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
      `Reward service is running on port ${process.env.REWARD_PORT ?? 9996}`,
    );
  })
  .catch(() => {});
