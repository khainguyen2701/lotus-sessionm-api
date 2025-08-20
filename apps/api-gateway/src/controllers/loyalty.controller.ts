/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { RoleBaseAccessControl } from '@app/common/constant/index.constant';
import {
  PagingConfig,
  PagingDecorator,
} from '@app/common/decorators/paging.decorators';
import { Roles } from '@app/common/decorators/role.decorator';
import { UserIdDecorator } from '@app/common/decorators/userId.decorators';
import { CreateManualRequestDTO } from '@app/common/dto/ms-loyalty/manual-request.dto';
import { MessagePatternForMicro } from '@app/common/messagePattern/index.message';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
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
import { EnumSortClaimMilesList, EnumStatusClaimMilesList } from '../dto/claim';
import {
  ClaimMilesManualSchema,
  GetListClaimMilesSchema,
  GetManualRequestDetailSchema,
  GetManualRequestDetailSchemaError,
} from '../schema/claimMiles';

import {
  DashboardApiResponseDto,
  DashboardOverviewQueryDto,
  DashboardOverviewResponseDto,
  DateField,
  OverviewQueryDto,
  OverviewResponseDto,
  ProcessingSpeedQueryDto,
  TimeseriesQueryDto,
  UsersOverviewQueryDto,
  UsersTimeseriesQueryDto,
} from '@app/common';
import { HttpException, HttpStatus } from '@nestjs/common';

import { firstValueFrom } from 'rxjs';
import {
  AdminClaimMilesManualOverviewDto,
  AdminClaimMilesManualProcessingSpeedDto,
  AdminClaimMilesManualTimeseriesDto,
  AdminDashboardOverviewDto,
  AdminOverViewDto,
  AdminTimeseriesDto,
} from '../dto/admin-overview.dto';
import { OverviewResponse } from '../transfer/overview';

@ApiTags('Loyalty')
@ApiBearerAuth('JWT-auth')
@Controller('ms-loyalty')
export class LoyaltyController {
  constructor(
    @Inject('LOYALTY_SERVICE') private loyaltyClient: ClientProxy,
    @Inject('USER_SERVICE') private userClient: ClientProxy,
  ) {}

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

  // #region admin Overview
  // MS-LOYALTY Admin Endpoints
  @Get('admin/claim-miles-manual/overview')
  @Roles(RoleBaseAccessControl.Admin)
  @ApiOperation({ summary: 'Get claim miles manual overview' })
  @ApiResponse({
    status: 200,
    description: 'Overview data retrieved successfully',
    type: AdminClaimMilesManualOverviewDto,
  })
  async getClaimMilesOverview(@Query() query: OverviewQueryDto): Promise<any> {
    try {
      const data = await firstValueFrom(
        this.loyaltyClient.send(
          { cmd: MessagePatternForMicro.LOYALTY.ADMIN_OVERVIEW },
          query,
        ),
      );

      return data;
    } catch (error) {
      throw new HttpException(
        error?.message || 'Failed to get overview data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('admin/claim-miles-manual/timeseries')
  @Roles(RoleBaseAccessControl.Admin)
  @ApiOperation({ summary: 'Get claim miles manual timeseries' })
  @ApiResponse({
    status: 200,
    description: 'Timeseries data retrieved successfully',
    type: AdminClaimMilesManualTimeseriesDto,
  })
  async getClaimMilesTimeseries(
    @Query() query: TimeseriesQueryDto,
  ): Promise<any> {
    try {
      const data = await firstValueFrom(
        this.loyaltyClient.send(
          { cmd: MessagePatternForMicro.LOYALTY.ADMIN_TIMESERIES },
          query,
        ),
      );

      return data;
    } catch (error) {
      throw new HttpException(
        error?.message || 'Failed to get timeseries data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('admin/claim-miles-manual/processing-speed')
  @Roles(RoleBaseAccessControl.Admin)
  @ApiOperation({ summary: 'Get claim miles manual processing speed' })
  @ApiResponse({
    status: 200,
    description: 'Processing speed data retrieved successfully',
    type: AdminClaimMilesManualProcessingSpeedDto,
  })
  async getClaimMilesProcessingSpeed(
    @Query() query: ProcessingSpeedQueryDto,
  ): Promise<any> {
    try {
      const data = await firstValueFrom(
        this.loyaltyClient.send(
          { cmd: MessagePatternForMicro.LOYALTY.ADMIN_PROCESSING_SPEED },
          query,
        ),
      );

      return data;
    } catch (error) {
      throw new HttpException(
        error?.message || 'Failed to get processing speed data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // MS-USER Admin Endpoints
  @Get('admin/overview')
  @Roles(RoleBaseAccessControl.Admin)
  @ApiOperation({ summary: 'Get admin overview' })
  @ApiResponse({
    status: 200,
    description: 'Admin overview data retrieved successfully',
    type: AdminOverViewDto,
  })
  async getUsersOverview(@Query() query: UsersOverviewQueryDto): Promise<any> {
    try {
      const data = await firstValueFrom(
        this.userClient.send(
          { cmd: MessagePatternForMicro.USER.ADMIN_USERS_OVERVIEW },
          query,
        ),
      );

      return data;
    } catch (error) {
      throw new HttpException(
        error?.message || 'Failed to get admin overview data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('admin/timeseries')
  @Roles(RoleBaseAccessControl.Admin)
  @ApiOperation({ summary: 'Get admin timeseries' })
  @ApiResponse({
    status: 200,
    description: 'Admin timeseries data retrieved successfully',
    type: AdminTimeseriesDto,
  })
  async getAdminTimeseries(
    @Query() query: UsersTimeseriesQueryDto,
  ): Promise<any> {
    try {
      const data = await firstValueFrom(
        this.userClient.send(
          { cmd: MessagePatternForMicro.USER.ADMIN_USERS_TIMESERIES },
          query,
        ),
      );

      return data;
    } catch (error) {
      throw new HttpException(
        error?.message || 'Failed to get users timeseries data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Combined Dashboard Endpoint
  @Get('admin/dashboard/overview')
  @Roles(RoleBaseAccessControl.Admin)
  @ApiOperation({ summary: 'Get combined dashboard overview' })
  @ApiResponse({
    status: 200,
    description: 'Dashboard overview data retrieved successfully',
    type: AdminDashboardOverviewDto,
  })
  async getDashboardOverview(
    @Query() query: DashboardOverviewQueryDto,
  ): Promise<DashboardApiResponseDto<DashboardOverviewResponseDto>> {
    try {
      // Prepare queries for each service
      const overviewQuery: OverviewQueryDto = {
        from: query.from,
        to: query.to,
        tz: query.tz,
      };

      const timeseriesQuery: TimeseriesQueryDto = {
        from: query.from,
        to: query.to,
        tz: query.tz,
        bucket: query.bucket,
      };

      const processingSpeedQuery: ProcessingSpeedQueryDto = {
        from: query.from,
        to: query.to,
        tz: query.tz,
      };

      const usersOverviewQuery: UsersOverviewQueryDto = {
        from: query.from,
        to: query.to,
        tz: query.tz,
      };

      // Execute all requests in parallel
      const [requests, requestsTimeseries, processingSpeed, members] =
        await Promise.allSettled([
          firstValueFrom(
            this.loyaltyClient.send(
              { cmd: MessagePatternForMicro.LOYALTY.ADMIN_OVERVIEW },
              overviewQuery,
            ),
          ),
          firstValueFrom(
            this.loyaltyClient.send(
              { cmd: MessagePatternForMicro.LOYALTY.ADMIN_TIMESERIES },
              timeseriesQuery,
            ),
          ),
          firstValueFrom(
            this.loyaltyClient.send(
              { cmd: MessagePatternForMicro.LOYALTY.ADMIN_PROCESSING_SPEED },
              processingSpeedQuery,
            ),
          ),
          firstValueFrom(
            this.userClient.send(
              { cmd: MessagePatternForMicro.USER.ADMIN_USERS_OVERVIEW },
              usersOverviewQuery,
            ),
          ),
        ]);

      const func = new OverviewResponse<OverviewResponseDto>();

      const requestsData = func.convert(requests as any);

      const requestsTimeseriesData = func.convert(requestsTimeseries as any);

      const processingSpeedData = func.convert(processingSpeed as any);

      const membersData = func.convert(members as any);

      // Calculate miles this month
      const currentMonth = new Date();
      const startOfMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        1,
      );

      const endOfMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        0,
      );

      const monthlyOverviewQuery: OverviewQueryDto = {
        from: startOfMonth.toISOString(),
        to: endOfMonth.toISOString(),
        tz: query.tz,
        date_field: DateField.PROCESSED,
      };

      const monthlyData = await firstValueFrom(
        this.loyaltyClient.send(
          { cmd: MessagePatternForMicro.LOYALTY.ADMIN_OVERVIEW },
          monthlyOverviewQuery,
        ),
      );

      const dashboardData: DashboardOverviewResponseDto = {
        requests: requestsData as any,
        requests_timeseries: requestsTimeseriesData as any,
        processing_speed: processingSpeedData as any,
        members: membersData as any,
        miles_this_month: monthlyData.total_miles || 0,
      };

      return {
        success: true,
        data: dashboardData,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new HttpException(
        error?.message || 'Failed to get dashboard overview data',
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Get detail manual request for member account
  @ApiOperation({ summary: 'Get detail manual request for member' })
  @ApiHeader({
    name: 'x-user-id',
    description: 'User ID',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Manual request created successfully',
    schema: GetManualRequestDetailSchema,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data',
    schema: GetManualRequestDetailSchemaError,
  })
  @Roles(RoleBaseAccessControl.User)
  @Get('member/claim-miles-manual/:id')
  getManualRequestDetail(
    @Param('id', ParseUUIDPipe) id: string,
    @UserIdDecorator() userId: string,
  ) {
    if (!id || !userId) {
      throw new HttpException(
        'Manual request ID and user ID are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.loyaltyClient.send(
      { cmd: MessagePatternForMicro.LOYALTY.GET_MANUAL_REQUEST_DETAIL },
      { id, userId },
    );
  }

  // Get detail manual request for admin account
  @ApiOperation({ summary: 'Get detail manual request for admin' })
  @ApiHeader({
    name: 'x-user-id',
    description: 'User ID',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Manual request created successfully',
    schema: GetManualRequestDetailSchema,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data',
    schema: GetManualRequestDetailSchemaError,
  })
  @Roles(RoleBaseAccessControl.Admin)
  @Get('admin/claim-miles-manual/:id')
  getManualRequestDetailForAdmin(@Param('id', ParseUUIDPipe) id: string) {
    if (!id) {
      throw new HttpException(
        'Manual request ID is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.loyaltyClient.send(
      {
        cmd: MessagePatternForMicro.LOYALTY.GET_MANUAL_REQUEST_DETAIL_FOR_ADMIN,
      },
      { id },
    );
  }
}
