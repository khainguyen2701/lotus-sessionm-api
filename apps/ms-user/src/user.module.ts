import { UserEntity } from '@app/database/entities/user.entity';
import { PostEntity } from '@app/database/entities/post.entity';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DatabaseModule } from '@app/database';
import { CategoriesEntity } from '@app/database/entities/categories.entity';
import { TagsEntity } from '@app/database/entities/tag.entity';
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
  controllers: [UserController],
  providers: [UserService, UserRepository],
})
export class UserModule {}
