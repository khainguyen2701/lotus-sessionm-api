import { PagingConfig } from '@app/common/decorators/paging.decorators';
import { CreateManualRequestDTO } from '@app/common/dto/ms-loyalty/manual-request.dto';
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
}
