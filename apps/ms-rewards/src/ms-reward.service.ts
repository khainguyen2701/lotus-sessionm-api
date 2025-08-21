import { Injectable } from '@nestjs/common';
import { BodyCreateTierDTO } from './dto/tier.dto';
import { TierRepository } from './repositories/tier.repository';
import { TransactionRepository } from './repositories/transaction.repository';

@Injectable()
export class MsRewardService {
  constructor(
    private readonly tierRepository: TierRepository,
    private readonly transactionRepository: TransactionRepository,
  ) {}
  async createTier(body: BodyCreateTierDTO): Promise<any> {
    return await this.tierRepository.createTier(body);
  }

  async getAllTiers(): Promise<any> {
    return await this.tierRepository.getAllTiers();
  }

  async getMemberTransactions(body: {
    userId: string;
    size?: number;
    page?: number;
  }): Promise<any> {
    return await this.transactionRepository.getMemberTransactions(body);
  }

  async getAdminTransactions(body: {
    size?: number;
    page?: number;
  }): Promise<any> {
    return await this.transactionRepository.getAdminTransactions(body);
  }
}
