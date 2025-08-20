import { PagingConfig } from '@app/common/decorators/paging.decorators';
import { CreateManualRequestDTO } from '@app/common/dto/ms-loyalty/manual-request.dto';
import {
  OverviewQueryDto,
  TimeseriesQueryDto,
  ProcessingSpeedQueryDto,
} from '@app/common/dto/ms-loyalty/admin.dto';
import { Injectable } from '@nestjs/common';
import {
  EnumSortClaimMilesList,
  EnumStatusClaimMilesList,
} from 'apps/api-gateway/src/dto/claim';
import { ClaimMilesRepository } from './repositories/claimMiles.repository';

@Injectable()
export class MsLoyaltyService {
  constructor(private readonly claimMilesRepository: ClaimMilesRepository) {}

  async createManualRequest(
    data: CreateManualRequestDTO & { userId: string },
  ): Promise<any> {
    return await this.claimMilesRepository.createManualRequest(data);
  }

  async getListManualRequest(
    query: {
      userId: string;
      status?: EnumStatusClaimMilesList;
      sort?: EnumSortClaimMilesList;
    } & PagingConfig,
  ) {
    return await this.claimMilesRepository.getListManualRequest(query);
  }

  async getListManualRequestForAdmin(
    query: {
      status?: EnumStatusClaimMilesList;
      sort?: EnumSortClaimMilesList;
      byUser?: string;
      userName?: string;
    } & PagingConfig,
  ) {
    return await this.claimMilesRepository.getListManualRequestForAdmin(query);
  }

  // Admin endpoints
  async getOverview(query: OverviewQueryDto) {
    return await this.claimMilesRepository.getOverview(query);
  }

  async getTimeseries(query: TimeseriesQueryDto) {
    return await this.claimMilesRepository.getTimeseries(query);
  }

  async getProcessingSpeed(query: ProcessingSpeedQueryDto) {
    return await this.claimMilesRepository.getProcessingSpeed(query);
  }

  async getManualRequestDetail(data: {
    id: string;
    userId: string;
  }): Promise<any> {
    return await this.claimMilesRepository.getManualRequestDetail(data);
  }

  async getManualRequestDetailForAdmin(data: { id: string }): Promise<any> {
    return await this.claimMilesRepository.getManualRequestDetailForAdmin(data);
  }

  async changeStatusManualRequestForAdmin(data: {
    id: string;
    status: EnumStatusClaimMilesList;
    userId: string;
    reason?: string;
  }): Promise<any> {
    return await this.claimMilesRepository.changeStatusManualRequestForAdmin(
      data,
    );
  }
}
