import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MsAuthController } from './ms-auth.controller';
import { MsAuthService } from './ms-auth.service';
import { AuthRepository } from './repositories/auth.repository';
import { DatabaseModule } from '@app/database';
import * as entities from '@app/database/entities';
import { CommonModule, HttpClientService } from '@app/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    TypeOrmModule.forFeature(Object.values(entities)),
    CommonModule,
  ],
  controllers: [MsAuthController, HttpClientService],
  providers: [MsAuthService, AuthRepository, JwtService, HttpClientService],
})
export class MsAuthModule {}
