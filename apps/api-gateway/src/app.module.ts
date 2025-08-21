import { HybridAuthGuard } from '@app/common/guards/auth/auth.guard';
import { RoleBaseAccessControlGuard } from '@app/common/guards/role/role.guard';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppService } from './app.service';
import { UsersController } from './controllers/user.controller';
import { AuthController } from './controllers/auth.controller';
import { RewardController } from './controllers/reward.controller';
import { LoyaltyController } from './controllers/loyalty.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 60000, // 1 minute
        limit: 10,
      },
      {
        name: 'medium',
        ttl: 600000, // 10 minutes
        limit: 20,
      },
      {
        name: 'long',
        ttl: 3600000, // 1 hour
        limit: 100,
      },
    ]),
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_KEY_JWT,
      secretOrPrivateKey: process.env.SECRET_KEY_JWT,
      signOptions: { expiresIn: '1h' },
    }),
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.API_HOST ?? 'localhost',
          port: Number(process.env.PORT_USER ?? 9998),
        },
      },
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.API_HOST ?? 'localhost',
          port: Number(process.env.PORT_AUTH ?? 9997),
        },
      },
      {
        name: 'REWARDS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.API_HOST ?? 'localhost',
          port: Number(process.env.PORT_REWARDS ?? 9996),
        },
      },
      {
        name: 'LOYALTY_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.API_HOST ?? 'localhost',
          port: Number(process.env.PORT_LOYALTY ?? 9995),
        },
      },
    ]),
  ],
  controllers: [
    UsersController,
    AuthController,
    RewardController,
    LoyaltyController,
  ],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: HybridAuthGuard },
    { provide: APP_GUARD, useClass: RoleBaseAccessControlGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
