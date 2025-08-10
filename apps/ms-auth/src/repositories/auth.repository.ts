/* eslint-disable no-useless-catch */
import { Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { Repository } from 'typeorm';
import { AuthSignUpDTO } from '../dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthRepository {
  // constructor(
  //   @InjectRepository(UserEntity) private userEntities: Repository<UserEntity>,
  // ) {}
  // async signUp(body: AuthSignUpDTO): Promise<{ id: string }> {
  //   try {
  //     const { password, username } = body;
  //     const hash_password = await hash(password, 10);
  //     const data = await this.userEntities.save({
  //       username: username,
  //       password: hash_password,
  //     });
  //     return { id: data.id };
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
