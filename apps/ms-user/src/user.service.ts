import { UserEntity } from '@app/database/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private userRepo: UserRepository) {}
  async findAll(): Promise<{ data: UserEntity[]; totalItems: number } | null> {
    const data = await this.userRepo.findAllUsers();
    return data;
  }
}
