import configuration from '@app/common/config/config';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from './database.service';
import createTypeOrmPgFactory from './createTypeOrmFactory/pg.factory';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => createTypeOrmPgFactory(config),
    }),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService, ConfigModule, TypeOrmModule],
})
export class DatabaseModule {}
