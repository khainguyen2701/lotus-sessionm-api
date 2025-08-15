import { RoleBaseAccessControl } from '@app/common/constant/index.constant';
import { Roles } from '@app/common/decorators/role.decorator';
import { MessagePatternForMicro } from '@app/common/messagePattern/index.message';
import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BodyCreateTierDTO } from 'apps/ms-rewards/src/dto/tier.dto';
import {
  TierCreateResponseDto,
  TierGetAllResponseDto,
} from '../dto/tier-response.dto';

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
}
