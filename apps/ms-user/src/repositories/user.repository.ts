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

  // Admin Get Detail User
  async adminGetDetailUser(data: { id: string; adminId: string }) {
    try {
      const { id, adminId } = data;

      const queryBuilder = this.userEntities
        .createQueryBuilder('user')
        .where('user.id = :id', { id })
        .andWhere('user.user_type = :userType', { userType: 'user' })
        .leftJoinAndSelect('user.tier', 'tier')
        .leftJoinAndSelect('user.points', 'points');

      const user = await queryBuilder.getOne();

      if (!user) {
        return { user: {}, statistics: {} };
      }

      // Calculate membership duration
      const membershipDuration = Math.floor(
        (Date.now() - new Date(user.created_at).getTime()) /
          (1000 * 60 * 60 * 24),
      );

      // Get current month boundaries
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      // Get points transactions statistics
      const pointsTransactionsQuery = `
        SELECT 
          COUNT(*) as total_transactions,
          SUM(CASE WHEN transaction_type = 'earn' THEN points_used ELSE 0 END) as total_earned,
          SUM(CASE WHEN transaction_type = 'spend' THEN points_used ELSE 0 END) as total_spent,
          COUNT(CASE WHEN created_at >= $2 AND created_at <= $3 THEN 1 END) as monthly_transactions,
          SUM(CASE WHEN created_at >= $2 AND created_at <= $3 AND transaction_type = 'earn' THEN points_used ELSE 0 END) as monthly_earned,
          SUM(CASE WHEN created_at >= $2 AND created_at <= $3 AND transaction_type = 'spend' THEN points_used ELSE 0 END) as monthly_spent,
          MAX(created_at) as last_transaction_date
        FROM point_transactions 
        WHERE user_id = $1
      `;

      const pointsStats = await this.userEntities.manager.query(
        pointsTransactionsQuery,
        [id, startOfMonth, endOfMonth],
      );

      // Get manual requests statistics
      const manualRequestsQuery = `
        SELECT 
          COUNT(*) as total_requests,
          COUNT(CASE WHEN status = 'processing' THEN 1 END) as pending_requests,
          COUNT(CASE WHEN status = 'processed' THEN 1 END) as processed_requests,
          COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_requests,
          COUNT(CASE WHEN uploaded_at >= $2 AND uploaded_at <= $3 THEN 1 END) as monthly_requests,
          SUM(CASE WHEN status = 'processed' THEN points ELSE 0 END) as total_approved_points,
          MAX(uploaded_at) as last_request_date
        FROM manual_points_request 
        WHERE "userId" = $1
      `;

      const manualRequestsStats = await this.userEntities.manager.query(
        manualRequestsQuery,
        [id, startOfMonth, endOfMonth],
      );

      // Format statistics
      const pointsData = pointsStats[0] || {};
      const requestsData = manualRequestsStats[0] || {};

      const statistics = {
        // Points & Transactions Statistics
        total_accumulated_points: parseInt(pointsData.total_earned || '0'),
        total_spent_points: parseInt(pointsData.total_spent || '0'),
        current_balance: user.points?.balance_points || 0,
        total_transactions: parseInt(pointsData.total_transactions || '0'),

        // Monthly Statistics
        monthly_transactions: parseInt(pointsData.monthly_transactions || '0'),
        monthly_earned_points: parseInt(pointsData.monthly_earned || '0'),
        monthly_spent_points: parseInt(pointsData.monthly_spent || '0'),

        // Manual Requests Statistics
        total_manual_requests: parseInt(requestsData.total_requests || '0'),
        pending_manual_requests: parseInt(requestsData.pending_requests || '0'),
        processed_manual_requests: parseInt(
          requestsData.processed_requests || '0',
        ),
        rejected_manual_requests: parseInt(
          requestsData.rejected_requests || '0',
        ),
        monthly_manual_requests: parseInt(requestsData.monthly_requests || '0'),
        total_manual_approved_points: parseInt(
          requestsData.total_approved_points || '0',
        ),

        // Activity Statistics
        membership_duration_days: membershipDuration,
      };

      return { user, statistics };
    } catch (error) {
      throw new Error(error?.message || 'Failed to get admin detail user');
    }
  }

  // Admin Update User
  async adminUpdateUser(data: { id: string; adminId: string; status: string }) {
    try {
      const { id, adminId, status } = data;

      const user = await this.userEntities.findOne({
        where: { id, user_type: 'user' },
      });

      if (!user) {
        throw new Error('User not found');
      }

      user.status = status;
      await this.userEntities.save(user);

      return user;
    } catch (error) {
      throw new Error(error?.message || 'Failed to update admin user');
    }
  }
}
