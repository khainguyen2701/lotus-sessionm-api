/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable no-useless-catch */
import { UsersEntity } from '@app/database';
import {
  UsersOverviewQueryDto,
  UsersTimeseriesQueryDto,
  UserTier,
  UserStatus,
  UserBucketType,
} from '@app/common/dto/ms-user/admin.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EnumSortClaimMilesList } from 'apps/api-gateway/src/dto/claim';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UsersEntity)
    private userEntities: Repository<UsersEntity>,
  ) {}

  async findUserByIdAndType(userId: string, type: 'user' | 'admin') {
    try {
      const user = await this.userEntities.findOne({
        where: {
          id: userId,
          user_type: type,
        },
        relations: ['tier', 'points'],
        select: [
          'id',
          'user_type',
          'first_name',
          'last_name',
          'created_at',
          'updated_at',
          'user_email',
          'user_number',
          'phone_numbers',
          'address',
          'city',
          'country',
          'dob',
          'gender',
          'state',
          'zip',
          'user_type',
          'district',
          'ward',
        ],
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async findUserById(userId: string) {
    try {
      const user = await this.userEntities.findOne({
        where: {
          id: userId,
        },
        relations: ['tier', 'points'],
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async updateUserProfile(userId: string, updateData: Partial<UsersEntity>) {
    try {
      await this.userEntities.update(userId, updateData);

      // Return updated user with relations
      const updatedUser = await this.userEntities.findOne({
        where: {
          id: userId,
        },
        relations: ['tier', 'points'],
        select: [
          'id',
          'user_type',
          'first_name',
          'last_name',
          'gender',
          'dob',
          'address',
          'city',
          'state',
          'zip',
          'country',
          'phone_numbers',
          'created_at',
          'updated_at',
          'user_email',
          'user_number',
          'district',
          'ward',
        ],
      });

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async updateUserTier(userId: string, tierId: string) {
    try {
      await this.userEntities.update(userId, { tier: { id: tierId } });

      // Return updated user with relations
      const updatedUser = await this.userEntities.findOne({
        where: {
          id: userId,
        },
        relations: ['tier', 'points'],
      });

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async adminGetListMember(query: {
    page: number;
    size: number;
    sort?: EnumSortClaimMilesList;
    search?: string;
  }): Promise<any> {
    try {
      const { page = 1, size = 10, sort = 'desc', search } = query;
      const queryBuild = this.userEntities
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.tier', 'tier')
        .leftJoinAndSelect('user.points', 'points')
        .where('user.user_type = :user_type', { user_type: 'user' });

      if (search) {
        queryBuild.andWhere(
          '(user.user_name ILIKE :search OR user.user_email ILIKE :search OR user.user_number ILIKE :search)',
          { search: `${search}%` }, // Prefix search for better index usage
        );
      }
      queryBuild
        .orderBy('user.created_at', sort.toUpperCase() as any)
        .addOrderBy('user.user_name', 'ASC') // Secondary sort only
        .skip((page - 1) * size)
        .take(size);

      const [data, total] = await queryBuild.getManyAndCount();
      return {
        data,
        pagination: {
          total,
          page,
          size,
          totalPages: Math.ceil(total / size),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  // Admin Users Overview
  async getUsersOverview(query: UsersOverviewQueryDto) {
    try {
      const { from, to, tz = 'UTC', tier, status } = query;

      // Set default date range (last 7 days) if not provided
      const endDate = to ? new Date(to) : new Date();
      const startDate = from
        ? new Date(from)
        : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      // Build base query for total members
      let totalMembersQuery = this.userEntities
        .createQueryBuilder('user')
        .where('user.user_type = :userType', { userType: 'user' });

      // Apply tier filter
      if (tier && tier?.length > 0) {
        totalMembersQuery = totalMembersQuery
          .leftJoin('user.tier', 'tier')
          .andWhere(
            '(tier.tier_name IN (:...tier) OR (tier.tier_name IS NULL AND :memberTier IN (:...tier)))',
            {
              tier,
              memberTier: UserTier.MEMBER,
            },
          );
      }

      // Apply status filter (assuming active means user has recent activity)
      if (status === UserStatus.ACTIVE) {
        // Consider users active if they have logged in within last 30 days
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        totalMembersQuery = totalMembersQuery.andWhere(
          'user.updated_at >= :thirtyDaysAgo',
          { thirtyDaysAgo },
        );
      } else if (status === UserStatus.INACTIVE) {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        totalMembersQuery = totalMembersQuery.andWhere(
          'user.updated_at < :thirtyDaysAgo',
          { thirtyDaysAgo },
        );
      }

      // Get total members count
      const totalMembers = await totalMembersQuery.getCount();

      // Get new members in the specified period
      let newMembersQuery = this.userEntities
        .createQueryBuilder('user')
        .where('user.user_type = :userType', { userType: 'user' })
        .andWhere(
          'user.created_at >= :startDate AND user.created_at <= :endDate',
          {
            startDate,
            endDate,
          },
        );

      if (tier && tier?.length > 0) {
        newMembersQuery = newMembersQuery
          .leftJoin('user.tier', 'tier')
          .andWhere(
            '(tier.tier_name IN (:...tier) OR (tier.tier_name IS NULL AND :memberTier IN (:...tier)))',
            {
              tier,
              memberTier: UserTier.MEMBER,
            },
          );
      }

      const newMembers = await newMembersQuery.getCount();

      // Get active members (users with activity in last 30 days)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      let activeMembersQuery = this.userEntities
        .createQueryBuilder('user')
        .where('user.user_type = :userType', { userType: 'user' })
        .andWhere('user.updated_at >= :thirtyDaysAgo', { thirtyDaysAgo });

      if (tier && tier?.length > 0) {
        activeMembersQuery = activeMembersQuery
          .leftJoin('user.tier', 'tier')
          .andWhere(
            '(tier.tier_name IN (:...tier) OR (tier.tier_name IS NULL AND :memberTier IN (:...tier)))',
            {
              tier,
              memberTier: UserTier.MEMBER,
            },
          );
      }

      const activeMembers = await activeMembersQuery.getCount();

      // Get breakdown by tier
      const tierBreakdown = await this.userEntities
        .createQueryBuilder('user')
        .leftJoin('user.tier', 'tier')
        .select('COALESCE(tier.tier_name, :defaultTier)', 'tier_name')
        .addSelect('COUNT(*)', 'count')
        .where('user.user_type = :userType', { userType: 'user' })
        .setParameter('defaultTier', UserTier.MEMBER)
        .groupBy('tier.tier_name')
        .getRawMany();

      // Initialize tier counts
      const byTier = {
        member: 0,
        bronze: 0,
        silver: 0,
        gold: 0,
      };

      // Map tier breakdown
      tierBreakdown.forEach((item) => {
        const tierName = item.tier_name?.toLowerCase();
        if (tierName && tierName in byTier) {
          byTier[tierName] = parseInt(item.count, 10);
        }
      });

      return {
        total_members: totalMembers,
        new_members: newMembers,
        active_members: activeMembers,
        by_tier: byTier,
      };
    } catch (error) {
      throw new Error(error?.message || 'Failed to get users overview');
    }
  }

  // Admin Users Timeseries
  async getUsersTimeseries(query: UsersTimeseriesQueryDto) {
    try {
      const { from, to, tz = 'UTC', bucket = UserBucketType.DAY } = query;

      // Set default date range (last 7 days) if not provided
      const endDate = to ? new Date(to) : new Date();
      const startDate = from
        ? new Date(from)
        : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      // Get new members timeseries
      const newMembersData = await this.userEntities
        .createQueryBuilder('user')
        .select(
          `DATE_TRUNC('${bucket}', user.created_at AT TIME ZONE '${tz}')`,
          'ts',
        )
        .addSelect('COUNT(*)', 'count')
        .where('user.user_type = :userType', { userType: 'user' })
        .andWhere(
          'user.created_at >= :startDate AND user.created_at <= :endDate',
          {
            startDate,
            endDate,
          },
        )
        .groupBy('ts')
        .orderBy('ts', 'ASC')
        .getRawMany();

      // Format response
      const formatTimeseries = (data: any[]) => {
        return data.map((item) => ({
          ts: item.ts.toISOString().split('T')[0], // Format as YYYY-MM-DD
          count: parseInt(item.count || '0', 10),
        }));
      };

      return {
        new_members: formatTimeseries(newMembersData),
      };
    } catch (error) {
      throw new Error(error?.message || 'Failed to get users timeseries');
    }
  }
}
