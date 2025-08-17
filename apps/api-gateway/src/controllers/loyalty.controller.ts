/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  PagingConfig,
  PagingDecorator,
} from '@app/common/decorators/paging.decorators';
import { UserIdDecorator } from '@app/common/decorators/userId.decorators';
import { CreateManualRequestDTO } from '@app/common/dto/ms-loyalty/manual-request.dto';
import { MessagePatternForMicro } from '@app/common/messagePattern/index.message';
import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
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
import { EnumSortClaimMilesList, EnumStatusClaimMilesList } from '../dto/claim';
import {
  ClaimMilesManualSchema,
  GetListClaimMilesSchema,
} from '../schema/claimMiles';
import { Roles } from '@app/common/decorators/role.decorator';
import { RoleBaseAccessControl } from '@app/common/constant/index.constant';

@ApiTags('Loyalty')
@ApiBearerAuth('JWT-auth')
@Controller('ms-loyalty')
export class LoyaltyController {
  constructor(@Inject('LOYALTY_SERVICE') private loyaltyClient: ClientProxy) {}

  @ApiOperation({ summary: 'Create manual request' })
  @ApiHeader({
    name: 'x-user-id',
    description: 'User ID',
    required: true,
  })
  @ApiBody({ type: CreateManualRequestDTO })
  @ApiResponse({
    status: 201,
    description: 'Manual request created successfully',
    schema: ClaimMilesManualSchema,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data',
  })
  @Post('/claim-miles-manual/create')
  createManualRequest(
    @Body() body: CreateManualRequestDTO,
    @UserIdDecorator() userId: string,
  ) {
    return this.loyaltyClient.send(
      { cmd: MessagePatternForMicro.LOYALTY.CREATE_MANUAL_REQUEST },
      { ...body, userId },
    );
  }

  //Get list manual request for member
  @ApiOperation({ summary: 'Get list manual request for member' })
  @ApiHeader({
    name: 'x-user-id',
    description: 'User ID',
    required: true,
  })
  @ApiQuery({
    name: 'sort',
    enum: EnumSortClaimMilesList,
    required: false,
    description: 'Sort by uploaded_at',
  })
  @ApiQuery({
    name: 'status',
    enum: EnumStatusClaimMilesList,
    required: false,
    description: 'Filter by status',
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'size',
    type: Number,
    required: false,
    description: 'Pagination',
  })
  @ApiQuery({
    name: 'size',
    type: Number,
    required: false,
    description: 'Page size',
  })
  @ApiResponse({
    status: 200,
    description: 'Get list manual request successfully',
    schema: GetListClaimMilesSchema,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data',
  })
  @Get('/member/claim-miles-manual')
  @Roles(RoleBaseAccessControl.User)
  getListManualRequest(
    @UserIdDecorator() userId: string,
    @Query('sort') sort?: EnumSortClaimMilesList,
    @PagingDecorator() pagination?: PagingConfig,
    @Query('status') status?: EnumStatusClaimMilesList,
  ) {
    const payload = {
      userId,
      sort: sort ?? EnumSortClaimMilesList.desc,
      page: pagination?.page ?? 1,
      size: pagination?.size ?? 10,
      ...(status && { status }),
    };

    if (!userId) {
      throw new Error('User ID is required');
    }

    const data = this.loyaltyClient.send(
      { cmd: MessagePatternForMicro.LOYALTY.GET_LIST_MANUAL_REQUEST },
      payload,
    );

    return data;
  }

  //Get list manual request for admin
  @ApiOperation({ summary: 'Get list manual request for admin' })
  // @ApiHeader({
  //   name: 'x-user-id',
  //   description: 'User ID',
  //   required: true,
  // })
  @ApiQuery({
    name: 'sort',
    enum: EnumSortClaimMilesList,
    required: false,
    description: 'Sort by uploaded_at',
  })
  @ApiQuery({
    name: 'status',
    enum: EnumStatusClaimMilesList,
    required: false,
    description: 'Filter by status',
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'size',
    type: Number,
    required: false,
    description: 'Pagination',
  })
  @ApiQuery({
    name: 'size',
    type: Number,
    required: false,
    description: 'Page size',
  })
  @ApiQuery({
    name: 'by-user',
    type: String,
    required: false,
    description: 'By user',
  })
  @ApiResponse({
    status: 200,
    description: 'Get list manual request successfully',
    schema: GetListClaimMilesSchema,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data',
  })
  @Get('/admin/claim-miles-manual')
  @Roles(RoleBaseAccessControl.Admin)
  getListManualRequestForAdmin(
    // @UserIdDecorator() userId: string,
    @Query('sort') sort?: EnumSortClaimMilesList,
    @PagingDecorator() pagination?: PagingConfig,
    @Query('by-user') byUser?: string,
    @Query('status') status?: EnumStatusClaimMilesList,
  ) {
    const payload = {
      sort: sort ?? EnumSortClaimMilesList.desc,
      page: pagination?.page ?? 1,
      size: pagination?.size ?? 10,
      ...(status && { status }),
      ...(byUser && { byUser }),
      // ...(userId && { userId }),
    };

    // if (!userId) {
    //   throw new Error('User ID is required');
    // }

    const data = this.loyaltyClient.send(
      { cmd: MessagePatternForMicro.LOYALTY.GET_LIST_MANUAL_REQUEST_FOR_ADMIN },
      payload,
    );

    return data;
  }
}
