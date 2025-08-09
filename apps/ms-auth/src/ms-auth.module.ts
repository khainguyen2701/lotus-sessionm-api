import { UserEntity } from '@app/database/entities/user.entity';
import { PostEntity } from '@app/database/entities/post.entity';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MsAuthController } from './ms-auth.controller';
import { MsAuthService } from './ms-auth.service';
import { AuthRepository } from './repositories/auth.repository';
import { DatabaseModule } from '@app/database';
import { TagsEntity } from '@app/database/entities/tag.entity';
import { CategoriesEntity } from '@app/database/entities/categories.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([
      UserEntity,
      PostEntity,
      TagsEntity,
      CategoriesEntity,
    ]),
  ],
  controllers: [MsAuthController],
  providers: [MsAuthService, AuthRepository, JwtService],
})
export class MsAuthModule {}
