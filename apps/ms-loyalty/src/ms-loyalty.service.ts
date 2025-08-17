import { CreateManualRequestDTO } from '@app/common/dto/ms-loyalty/manual-request.dto';
import { Injectable } from '@nestjs/common';
import { ClaimMilesRepository } from './repositories/claimMiles.repository';

@Injectable()
export class MsLoyaltyService {
  constructor(private readonly claimMilesRepository: ClaimMilesRepository) {}

  async createManualRequest(data: CreateManualRequestDTO): Promise<any> {
    return await this.claimMilesRepository.createManualRequest(data);
  }
}
