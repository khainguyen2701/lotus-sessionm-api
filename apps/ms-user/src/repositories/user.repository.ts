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
        relations: ['tier', 'points'],
        select: [
          'id',
          'user_type',
          'first_name',
          'last_name',
          'created_at',
          'updated_at',
          'user_email',
          'user_number',
        ],
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async findUserById(userId: string) {
    try {
      const user = await this.userEntities.findOne({
        where: {
          id: userId,
        },
        relations: ['tier', 'points'],
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async updateUserProfile(userId: string, updateData: Partial<UsersEntity>) {
    try {
      await this.userEntities.update(userId, updateData);

      // Return updated user with relations
      const updatedUser = await this.userEntities.findOne({
        where: {
          id: userId,
        },
        relations: ['tier', 'points'],
        select: [
          'id',
          'user_type',
          'first_name',
          'last_name',
          'gender',
          'dob',
          'address',
          'city',
          'state',
          'zip',
          'country',
          'phone_numbers',
          'created_at',
          'updated_at',
          'user_email',
          'user_number',
        ],
      });

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async updateUserTier(userId: string, tierId: string) {
    try {
      await this.userEntities.update(userId, { tier: { id: tierId } });

      // Return updated user with relations
      const updatedUser = await this.userEntities.findOne({
        where: {
          id: userId,
        },
        relations: ['tier', 'points'],
      });

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }
}
