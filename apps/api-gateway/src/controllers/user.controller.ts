import { RoleBaseAccessControl } from '@app/common/constant/index.constant';
import { Roles } from '@app/common/decorators/role.decorator';
import { MessagePatternForMicro } from '@app/common/messagePattern/index.message';
import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('api/v1/users')
export class UsersController {
  constructor(@Inject('USER_SERVICE') private userClient: ClientProxy) {}

  @Roles(RoleBaseAccessControl.SuperAdmin)
  @Get()
  findAll() {
    return this.userClient.send(
      { cmd: MessagePatternForMicro.USER.GET_ALL },
      {},
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userClient.send(
      { cmd: MessagePatternForMicro.USER.GET_DETAIL },
      { id },
    );
  }

  @Get('profile')
  getProfile() {
    return this.userClient.send({ cmd: 'get_profile' }, {});
  }

  @Post()
  create(@Body() body: any) {
    return this.userClient.send({ cmd: 'create_user' }, body);
  }
}
