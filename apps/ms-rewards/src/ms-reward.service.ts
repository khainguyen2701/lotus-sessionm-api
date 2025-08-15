import { Injectable } from '@nestjs/common';
import { BodyCreateTierDTO } from './dto/tier.dto';
import { TierRepository } from './repositories/tier.repository';

@Injectable()
export class MsRewardService {
  constructor(private readonly tierRepository: TierRepository) {}
  async createTier(body: BodyCreateTierDTO): Promise<any> {
    return await this.tierRepository.createTier(body);
  }
}
