/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { CreateManualRequestDTO } from '@app/common/dto/ms-loyalty/manual-request.dto';
import {
  OverviewQueryDto,
  TimeseriesQueryDto,
  ProcessingSpeedQueryDto,
  RequestType,
} from '@app/common/dto/ms-loyalty/admin.dto';
import { MessagePatternForMicro } from '@app/common/messagePattern/index.message';
import { Controller, HttpException, HttpStatus } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MsLoyaltyService } from './ms-loyalty.service';
import {
  EnumSortClaimMilesList,
  EnumStatusClaimMilesList,
} from 'apps/api-gateway/src/dto/claim';
import { PagingConfig } from '@app/common/decorators/paging.decorators';

@Controller()
export class MsLoyaltyController {
  constructor(private readonly msLoyaltyService: MsLoyaltyService) {}

  @MessagePattern({ cmd: MessagePatternForMicro.LOYALTY.CREATE_MANUAL_REQUEST })
  async createManualRequest(
    data: CreateManualRequestDTO & { userId: string },
  ): Promise<any> {
    try {
      if (!data.userId) {
        throw new Error('User ID is required');
      }
      return await this.msLoyaltyService.createManualRequest(data);
    } catch (error) {
      throw new HttpException(
        error?.message || 'Failed to create manual request',
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @MessagePattern({
    cmd: MessagePatternForMicro.LOYALTY.GET_LIST_MANUAL_REQUEST,
  })
  async getListManualRequest(
    query: {
      userId: string;
      status?: EnumStatusClaimMilesList;
      sort?: EnumSortClaimMilesList;
    } & PagingConfig,
  ) {
    try {
      return await this.msLoyaltyService.getListManualRequest(query);
    } catch (error) {
      throw new HttpException(
        error?.message || 'Failed to get manual requests',
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @MessagePattern({
    cmd: MessagePatternForMicro.LOYALTY.GET_LIST_MANUAL_REQUEST_FOR_ADMIN,
  })
  async getListManualRequestForAdmin(
    query: {
      status?: EnumStatusClaimMilesList;
      sort?: EnumSortClaimMilesList;
      byUser?: string;
      userName?: string;
    } & PagingConfig,
  ) {
    return await this.msLoyaltyService.getListManualRequestForAdmin(query);
  }

  // Admin endpoints
  @MessagePattern({
    cmd: MessagePatternForMicro.LOYALTY.ADMIN_OVERVIEW,
  })
  async getAdminOverview(query: OverviewQueryDto) {
    return await this.msLoyaltyService.getOverview(query);
  }

  @MessagePattern({
    cmd: MessagePatternForMicro.LOYALTY.ADMIN_TIMESERIES,
  })
  async getAdminTimeseries(query: TimeseriesQueryDto) {
    return await this.msLoyaltyService.getTimeseries(query);
  }

  @MessagePattern({
    cmd: MessagePatternForMicro.LOYALTY.ADMIN_PROCESSING_SPEED,
  })
  async getAdminProcessingSpeed(query: ProcessingSpeedQueryDto) {
    return await this.msLoyaltyService.getProcessingSpeed(query);
  }

  @MessagePattern({
    cmd: MessagePatternForMicro.LOYALTY.GET_MANUAL_REQUEST_DETAIL,
  })
  async getManualRequestDetail(data: {
    id: string;
    userId: string;
  }): Promise<any> {
    return await this.msLoyaltyService.getManualRequestDetail(data);
  }

  @MessagePattern({
    cmd: MessagePatternForMicro.LOYALTY.GET_MANUAL_REQUEST_DETAIL_FOR_ADMIN,
  })
  async getManualRequestDetailForAdmin(data: { id: string }): Promise<any> {
    return await this.msLoyaltyService.getManualRequestDetailForAdmin(data);
  }

  @MessagePattern({
    cmd: MessagePatternForMicro.LOYALTY.CHANGE_STATUS_MANUAL_REQUEST_FOR_ADMIN,
  })
  async changeStatusManualRequestForAdmin(data: {
    id: string;
    status: EnumStatusClaimMilesList;
    userId: string;
    reason?: string;
  }): Promise<any> {
    return await this.msLoyaltyService.changeStatusManualRequestForAdmin(data);
  }

  @MessagePattern({
    cmd: MessagePatternForMicro.LOYALTY.ADMIN_DIRECT_MILEAGE,
  })
  async adminDirectMileage(data: {
    userId: string;
    points: number;
    description: string;
    request_type: RequestType;
    user_number: string;
  }): Promise<any> {
    try {
      return await this.msLoyaltyService.adminDirectMileage(data);
    } catch (error) {
      throw new HttpException(
        error?.message || 'Failed to admin direct mileage',
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
