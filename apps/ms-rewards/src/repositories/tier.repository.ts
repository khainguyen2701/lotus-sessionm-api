/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable } from '@nestjs/common';
import { BodyCreateTierDTO } from '../dto/tier.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TiersEntity } from '@app/database';
import { Repository } from 'typeorm';

@Injectable()
export class TierRepository {
  constructor(
    @InjectRepository(TiersEntity)
    private tierRepository: Repository<TiersEntity>,
  ) {}
  async createTier(body: BodyCreateTierDTO): Promise<any> {
    try {
      const tier = await this.tierRepository.save(body);
      return tier;
    } catch (error) {
      console.log('error', error);
      throw new Error(error?.message || 'Error create tier');
    }
  }

  async getAllTiers(): Promise<TiersEntity[]> {
    try {
      const tiers = await this.tierRepository.find();
      return tiers;
    } catch (error) {
      console.log('error', error);
      throw new Error(error?.message || 'Error get all tiers');
    }
  }
}
