import { RoleBaseAccessControl } from '@app/common/constant/index.constant';
import { Roles } from '@app/common/decorators/role.decorator';
import { MessagePatternForMicro } from '@app/common/messagePattern/index.message';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BodyCreateTierDTO } from 'apps/ms-rewards/src/dto/tier.dto';
import {
  TierCreateResponseDto,
  TierGetAllResponseDto,
} from '../dto/tier-response.dto';
import {
  PagingConfig,
  PagingDecorator,
} from '@app/common/decorators/paging.decorators';
import { UserIdDecorator } from '@app/common/decorators/userId.decorators';
import {
  BadRequestSchemaError,
  ForbiddenSchemaError,
  GetTransactionResponse,
  TokenSchemaError,
} from '../schema/reward.schema';

@ApiTags('Rewards')
@ApiBearerAuth('JWT-auth')
@Controller('ms-reward')
export class RewardController {
  constructor(@Inject('REWARDS_SERVICE') private rewardsClient: ClientProxy) {}

  @ApiOperation({ summary: 'Create new tier for admin portal' })
  @ApiBody({
    type: BodyCreateTierDTO,
    description: 'Tier creation data',
  })
  @ApiResponse({
    status: 201,
    description: 'Tier created successfully',
    type: TierCreateResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid tier data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin role required',
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
  @Post('/tier/create')
  @Roles(RoleBaseAccessControl.Admin)
  create(@Body() body: BodyCreateTierDTO) {
    return this.rewardsClient.send(
      { cmd: MessagePatternForMicro.REWARDS.CREATE_TIER },
      { ...body },
    );
  }

  // Get all tiers
  @ApiOperation({ summary: 'Get all tiers' })
  @ApiResponse({
    status: 200,
    description: 'List of all tiers',
    type: TierGetAllResponseDto,
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
    required: true,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin role required',
  })
  @Get('/tiers')
  // @Roles(RoleBaseAccessControl.Admin)
  getAll() {
    return this.rewardsClient.send(
      { cmd: MessagePatternForMicro.REWARDS.GET_ALL_TIERS },
      {},
    );
  }

  // Get list transaction for member
  @ApiOperation({ summary: 'Get list transaction for member' })
  @ApiQuery({
    name: 'size',
    type: Number,
    required: false,
    description: 'Page size',
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Page number',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all transactions',
    schema: GetTransactionResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
    schema: TokenSchemaError,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User role required',
    schema: ForbiddenSchemaError,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid user ID',
    schema: BadRequestSchemaError,
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
  @Get('/member/transactions')
  @Roles(RoleBaseAccessControl.User)
  getMemberTransactions(
    @UserIdDecorator() userId: string,
    @PagingDecorator() pagination?: PagingConfig,
  ) {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }
    const body = {
      userId,
      size: pagination?.size ?? 10,
      page: pagination?.page ?? 1,
    };
    return this.rewardsClient.send(
      { cmd: MessagePatternForMicro.REWARDS.GET_MEMBER_TRANSACTIONS },
      { ...body },
    );
  }

  // Get list transaction for admin
  @ApiOperation({ summary: 'Get list transaction for admin' })
  @ApiResponse({
    status: 200,
    description: 'List of all transactions',
    schema: GetTransactionResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid user ID',
    schema: BadRequestSchemaError,
  })
  @ApiQuery({
    name: 'size',
    type: Number,
    required: false,
    description: 'Page size',
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Page number',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin role required',
    schema: ForbiddenSchemaError,
  })
  @ApiHeader({
    name: 'x-user-id',
    description: 'User ID (UUID format)',
    required: false,
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
    required: true,
  })
  @Get('/admin/transactions')
  @Roles(RoleBaseAccessControl.Admin)
  getAdminTransactions(@PagingDecorator() pagination?: PagingConfig) {
    const body = {
      size: pagination?.size ?? 10,
      page: pagination?.page ?? 1,
    };
    return this.rewardsClient.send(
      { cmd: MessagePatternForMicro.REWARDS.GET_ADMIN_TRANSACTIONS },
      { ...body },
    );
  }
}
