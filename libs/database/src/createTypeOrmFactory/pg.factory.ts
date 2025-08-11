import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';

export default function createTypeOrmPgFactory(
  config: ConfigService,
): TypeOrmModuleOptions {
  const dbConfig = {
    type: 'postgres' as const,
    host: config.get<string>('database.host'),
    port: config.get<number>('database.port'),
    username: config.get<string>('database.username'),
    password: config.get<string>('database.password'),
    database: config.get<string>('database.database'),
    autoLoadEntities: true,
    synchronize: config.get<boolean>('database.synchronize'),
    ssl: true,
    extra: {
      ssl: {
        ca: config.get<string>('database.ca_cert'),
      },
    },
  };

  // Debug logging
  const logger = new Logger('TypeORM');
  logger.log('🔧 TypeORM Configuration:');
  logger.log(`- Host: ${dbConfig.host}`);
  logger.log(`- Port: ${dbConfig.port}`);
  logger.log(`- Database: ${dbConfig.database}`);
  logger.log(`- Username: ${dbConfig.username}`);
  logger.log(`- Synchronize: ${dbConfig.synchronize}`);
  logger.log(`- AutoLoadEntities: ${dbConfig.autoLoadEntities}`);
  logger.log(`- SSL Enabled: ${dbConfig.ssl}`);

  return dbConfig;
}
