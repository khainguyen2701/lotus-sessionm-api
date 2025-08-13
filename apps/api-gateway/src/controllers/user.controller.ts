import { RoleBaseAccessControl } from '@app/common/constant/index.constant';
import { Roles } from '@app/common/decorators/role.decorator';
import { UserIdDecorator } from '@app/common/decorators/userId.decorators';
import { MessagePatternForMicro } from '@app/common/messagePattern/index.message';
import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  UserGetProfileSchemaError,
  UserGetProfileSchemaSuccess,
} from '../schema/user.schema';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@Controller('ms-users')
export class UsersController {
  constructor(@Inject('USER_SERVICE') private userClient: ClientProxy) {}

  // @ApiOperation({ summary: 'Get all users' })
  // @ApiResponse({ status: 200, description: 'List of all users' })
  // @ApiResponse({
  //   status: 403,
  //   description: 'Forbidden - Super Admin role required',
  // })
  // @Roles(RoleBaseAccessControl.Admin)
  // @Get()
  // findAll() {
  //   return this.userClient.send(
  //     { cmd: MessagePatternForMicro.USER.GET_ALL },
  //     {},
  //   );
  // }

  // Get member profile
  @ApiOperation({ summary: 'Get member portal profile' })
  @ApiResponse({
    status: 200,
    description: 'Member portal profile success',
    schema: UserGetProfileSchemaSuccess,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
    schema: UserGetProfileSchemaError,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
    schema: UserGetProfileSchemaError,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: UserGetProfileSchemaError,
  })
  @ApiHeader({
    name: 'x-user-id',
    description: 'User ID (UUID format)',
    required: true,
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
    required: true,
  })
  @Get('/member/profile')
  @Roles(RoleBaseAccessControl.User)
  memberProfile(@UserIdDecorator() userId: string) {
    return this.userClient.send(
      {
        cmd: MessagePatternForMicro.USER.MEMBER_PROFILE,
      },
      { userId },
    );
  }

  // Get admin profile
  @ApiOperation({ summary: 'Get admin portal profile' })
  @ApiResponse({
    status: 200,
    description: 'Admin portal profile success',
    schema: UserGetProfileSchemaSuccess,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
    schema: UserGetProfileSchemaError,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
    schema: UserGetProfileSchemaError,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: UserGetProfileSchemaError,
  })
  @ApiHeader({
    name: 'x-user-id',
    description: 'User ID (UUID format)',
    required: true,
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
    required: true,
  })
  @Get('/admin/profile')
  @Roles(RoleBaseAccessControl.Admin)
  adminProfile(@UserIdDecorator() userId: string) {
    return this.userClient.send(
      {
        cmd: MessagePatternForMicro.USER.ADMIN_PROFILE,
      },
      { userId },
    );
  }
}
