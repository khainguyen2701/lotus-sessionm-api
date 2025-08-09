import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default function createTypeOrmPgFactory(
  config: ConfigService,
): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    host: config.get('database.host'),
    port: config.get<number>('database.port'),
    username: config.get('database.username'),
    password: config.get('database.password'),
    database: config.get('database.database'),
    autoLoadEntities: true,
    synchronize: config.get('database.synchronize'),
    ssl: true,
    extra: {
      ssl: {
        ca: config.get<string>('database.ca_cert'),
      },
    },
  };
}
