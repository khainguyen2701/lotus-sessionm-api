import { Injectable } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private userRepo: UserRepository) {}
  async memberProfile(userId: string) {
    if (!userId) {
      throw new BadRequestException('Invalid or missing userId');
    }
    // Logic xử lý profile
    return await this.userRepo.findUserByIdAndType(userId, 'user');
  }

  async adminProfile(userId: string) {
    if (!userId) {
      throw new BadRequestException('Invalid or missing userId');
    }
    // check user type
    const user = await this.userRepo.findUserByIdAndType(userId, 'admin');
    if (!user) {
      throw new BadRequestException('Admin not found');
    }
    // Logic xử lý profile
    return user;
  }
}
