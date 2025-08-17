import { CreateManualRequestDTO } from '@app/common/dto/ms-loyalty/manual-request.dto';
import { MessagePatternForMicro } from '@app/common/messagePattern/index.message';
import { Controller } from '@nestjs/common';
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
    if (!data.userId) {
      throw new Error('User ID is required');
    }
    return await this.msLoyaltyService.createManualRequest(data);
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
    return await this.msLoyaltyService.getListManualRequest(query);
  }

  @MessagePattern({
    cmd: MessagePatternForMicro.LOYALTY.GET_LIST_MANUAL_REQUEST_FOR_ADMIN,
  })
  async getListManualRequestForAdmin(
    query: {
      status?: EnumStatusClaimMilesList;
      sort?: EnumSortClaimMilesList;
      byUser?: string;
    } & PagingConfig,
  ) {
    return await this.msLoyaltyService.getListManualRequestForAdmin(query);
  }
}
