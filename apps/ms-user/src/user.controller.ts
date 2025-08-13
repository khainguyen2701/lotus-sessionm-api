import { MessagePatternForMicro } from '@app/common/messagePattern/index.message';
import { BadRequestException, Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MemberProfileDto } from './dto/member-profile.dto';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  // get member profile
  @MessagePattern({ cmd: MessagePatternForMicro.USER.MEMBER_PROFILE })
  async memberProfile(data: MemberProfileDto) {
    try {
      return await this.userService.memberProfile(data.userId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // get admin profile
  @MessagePattern({ cmd: MessagePatternForMicro.USER.ADMIN_PROFILE })
  async adminProfile(data: MemberProfileDto) {
    try {
      return await this.userService.adminProfile(data.userId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
