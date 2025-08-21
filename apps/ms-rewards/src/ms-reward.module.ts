import { Module } from '@nestjs/common';
import { MsRewardController } from './ms-reward.controller';
import { MsRewardService } from './ms-reward.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/database';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as entities from '@app/database/entities';
import { TierRepository } from './repositories/tier.repository';
import { TransactionRepository } from './repositories/transaction.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    TypeOrmModule.forFeature(Object.values(entities)),
  ],
  controllers: [MsRewardController],
  providers: [MsRewardService, TierRepository, TransactionRepository],
})
export class MsRewardModule {}
