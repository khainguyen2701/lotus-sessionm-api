import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';
import { TierRepository } from './repositories/tier.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DatabaseModule } from '@app/database';
import { GitHubService } from '@app/common';
import * as entities from '@app/database/entities';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    TypeOrmModule.forFeature(Object.values(entities)),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, TierRepository, GitHubService],
})
export class UserModule {}
