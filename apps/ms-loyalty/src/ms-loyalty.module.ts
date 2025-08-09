import { Module } from '@nestjs/common';
import { MsLoyaltyController } from './ms-loyalty.controller';
import { MsLoyaltyService } from './ms-loyalty.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/database';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([]),
  ],
  controllers: [MsLoyaltyController],
  providers: [MsLoyaltyService],
})
export class MsLoyaltyModule {}
