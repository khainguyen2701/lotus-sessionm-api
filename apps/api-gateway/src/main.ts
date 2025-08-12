import { RpcToHttpExceptionFilter } from '@app/common/filters/rpc-exception.filter';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    },
  });

  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  // app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new RpcToHttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  // app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Lotus SessionM API')
    .setDescription('API documentation for Lotus SessionM microservices')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(process.env.PORT || 10000);
}

bootstrap()
  .then(() => {
    const port = process.env.PORT || 10000;
    console.log(`API Gateway is running on port ${port}`);
    console.log(
      `Swagger documentation available at http://localhost:${port}/api-docs`,
    );
  })
  .catch((err) => {
    console.error('Error starting API Gateway:', err);
    process.exit(1);
  });
