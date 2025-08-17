import { Module } from '@nestjs/common';
import { MsLoyaltyController } from './ms-loyalty.controller';
import { MsLoyaltyService } from './ms-loyalty.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/database';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as entities from '@app/database/entities';
import { ClaimMilesRepository } from './repositories/claimMiles.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    TypeOrmModule.forFeature(Object.values(entities)),
  ],
  controllers: [MsLoyaltyController],
  providers: [MsLoyaltyService, ClaimMilesRepository],
})
export class MsLoyaltyModule {}
