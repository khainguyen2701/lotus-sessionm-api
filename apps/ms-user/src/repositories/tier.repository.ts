/* eslint-disable no-useless-catch */
import { TiersEntity } from '@app/database';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TierRepository {
  constructor(
    @InjectRepository(TiersEntity)
    private tierEntities: Repository<TiersEntity>,
  ) {}

  async findTierByPointsRange(points: number): Promise<TiersEntity | null> {
    try {
      // Tìm tier phù hợp với số điểm trong khoảng min_points và max_points
      const tier = await this.tierEntities
        .createQueryBuilder('tier')
        .where('tier.min_points <= :points', { points })
        .andWhere('tier.max_points >= :points', { points })
        .orderBy('tier.priority', 'ASC') // Ưu tiên tier có priority thấp hơn
        .getOne();

      return tier;
    } catch (error) {
      throw error;
    }
  }

  async findAllTiers(): Promise<TiersEntity[]> {
    try {
      return await this.tierEntities.find({
        order: {
          priority: 'ASC',
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findTierById(tierId: string): Promise<TiersEntity | null> {
    try {
      return await this.tierEntities.findOne({
        where: { id: tierId },
      });
    } catch (error) {
      throw error;
    }
  }

  async findTierByName(tierName: string): Promise<TiersEntity | null> {
    try {
      return await this.tierEntities.findOne({
        where: { tier_name: tierName },
      });
    } catch (error) {
      throw error;
    }
  }
}
