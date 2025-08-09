import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserService } from './user.service';
import { UserEntity } from '../../../libs/database/src/entities/user.entity';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'user.get_users' })
  async getUsers(): Promise<{ data: UserEntity[]; totalItems: number } | null> {
    return await this.userService.findAll();
  }

  @MessagePattern({ cmd: 'get_user_by_id' })
  getUserById(data: { id: string }): string {
    return `User with ID: ${data.id}`;
  }
}
