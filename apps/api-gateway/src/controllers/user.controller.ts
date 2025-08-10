import { RoleBaseAccessControl } from '@app/common/constant/index.constant';
import { Roles } from '@app/common/decorators/role.decorator';
import { MessagePatternForMicro } from '@app/common/messagePattern/index.message';
import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@Controller('ms-users')
export class UsersController {
  constructor(@Inject('USER_SERVICE') private userClient: ClientProxy) {}

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of all users' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Super Admin role required',
  })
  @Roles(RoleBaseAccessControl.SuperAdmin)
  @Get()
  findAll() {
    return this.userClient.send(
      { cmd: MessagePatternForMicro.USER.GET_ALL },
      {},
    );
  }

  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User details' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userClient.send(
      { cmd: MessagePatternForMicro.USER.GET_DETAIL },
      { id },
    );
  }

  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Current user profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('profile')
  getProfile() {
    return this.userClient.send({ cmd: 'get_profile' }, {});
  }

  @ApiOperation({ summary: 'Create new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post()
  create(@Body() body: any) {
    return this.userClient.send({ cmd: 'create_user' }, body);
  }
}
