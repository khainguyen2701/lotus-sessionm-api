/* eslint-disable no-useless-catch */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository {
  // constructor(
  //   @InjectRepository(UserEntity)
  //   private userEntities: Repository<UserEntity>,
  // ) {}
  // async findAllUsers(): Promise<{
  //   data: UserEntity[];
  //   totalItems: number;
  // } | null> {
  //   try {
  //     const users = await this.userEntities.findAndCount();
  //     const [data = [], totalItems = 0] = users;
  //     return { data, totalItems };
  //   } catch (error) {
  //     throw error;
  //   }
  // }
  // async findOneByUserName({
  //   username,
  // }: {
  //   username: string;
  // }): Promise<UserEntity | null> {
  //   try {
  //     const user = await this.userEntities.findOne({ where: { username } });
  //     return user;
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}
