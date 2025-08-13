/* eslint-disable no-useless-catch */
import { UsersEntity } from '@app/database';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UsersEntity)
    private userEntities: Repository<UsersEntity>,
  ) {}

  async findUserByIdAndType(userId: string, type: 'user' | 'admin') {
    try {
      const user = await this.userEntities.findOne({
        where: {
          id: userId,
          user_type: type,
        },
        relations: ['sessionm_account', 'tier'],
        select: [
          'id',
          'user_type',
          'first_name',
          'last_name',
          'created_at',
          'updated_at',
          'user_email',
          'sessionm_account',
        ],
      });
      return user;
    } catch (error) {
      throw error;
    }
  }
}
