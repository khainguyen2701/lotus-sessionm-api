/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { PagingConfig } from '@app/common/decorators/paging.decorators';
import {
  BucketType,
  DateField,
  OverviewQueryDto,
  ProcessingSpeedQueryDto,
  RequestStatus,
  RequestType,
  TimeseriesQueryDto,
} from '@app/common/dto/ms-loyalty/admin.dto';
import { CreateManualRequestDTO } from '@app/common/dto/ms-loyalty/manual-request.dto';
import { calculatePointsByDistance } from '@app/common/utils/caculatePointsByDistane';
import {
  FlightInfoEntity,
  ManualPointsRequestEntity,
  PointsEntity,
  PointTransactionsEntity,
  SyncLogEntity,
  UsersEntity,
} from '@app/database';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EnumSortClaimMilesList,
  EnumStatusClaimMilesList,
} from 'apps/api-gateway/src/dto/claim';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ClaimMilesRepository {
  constructor(
    @InjectRepository(ManualPointsRequestEntity)
    private manualPointsRequestRepository: Repository<ManualPointsRequestEntity>,
    private dataSource: DataSource,
    @InjectRepository(FlightInfoEntity)
    private flightInfoRepository: Repository<FlightInfoEntity>,
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
  ) {}
  async createManualRequest(
    data: CreateManualRequestDTO & { userId: string },
  ): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const {
      userId,
      description,
      file_url,
      request_type,
      seat_code,
      ticket_number,
      amount = 0,
    } = data;

    try {
      const manual_point = await this.manualPointsRequestRepository
        .createQueryBuilder('manual_points_request')
        .where('manual_points_request.ticket_number = :ticket_number', {
          ticket_number,
        })
        .useIndex('idx_manual_points_request_ticket_number')
        .getOne();

      if (manual_point) {
        throw new BadRequestException('Ticket number already exists');
      }

      const user = await this.usersRepository
        .createQueryBuilder('user')
        .where('user.id = :userId', { userId })
        .useIndex('idx_users_id') // Use index on id column
        .getOne();

      if (!user) {
        throw new Error('User not found');
      }

      if (request_type === 'flight') {
        // Tìm flight info để validate
        const flight = await this.findFlightInfoBySomeFields(
          ticket_number,
          seat_code,
        );

        if (!flight) {
          throw new Error('Flight information not found');
        }

        const points = calculatePointsByDistance({
          request_type,
          distance_km: flight?.distance,
          classTicket: flight?.class_ticket,
          amount,
        });

        // Tạo manual request với flight info và user relation
        const manualRequest = queryRunner.manager.create(
          ManualPointsRequestEntity,
          {
            user: user, // Set user relation
            description,
            file_url,
            request_type,
            seat_code,
            ticket_number,
            status: 'processing', // Sử dụng enum value đúng
            // Copy flight info vào manual request
            flight_code: flight?.flight || '',
            flight_departure_airport: flight?.flight_departure_airport || '',
            flight_arrival_airport: flight?.flight_arrival_airport || '',
            flight_departure_date: flight?.flight_departure_date || '',
            flight_arrival_date: flight?.flight_arrival_date || '',
            distance: flight?.distance || 0,
            seat_class: flight?.class_ticket || '',
            flight_airline: flight.flight, // Default airline
            request_number: `REQ-${Date.now()}`, // Generate unique request number
            uploaded_at: new Date(),
            processed_at: new Date(),
            points: points?.points_awarded ?? 0,
          },
        );

        const savedRequest = await queryRunner.manager.save(manualRequest);

        // Commit transaction
        await queryRunner.commitTransaction();

        return savedRequest;
      } else {
        const points = calculatePointsByDistance({
          request_type,
          amount,
        });

        // Tạo manual request với flight info và user relation
        const manualRequest = queryRunner.manager.create(
          ManualPointsRequestEntity,
          {
            user: user, // Set user relation
            description,
            file_url,
            request_type,
            ticket_number,
            status: 'processing', // Sử dụng enum value đúng
            // Copy flight info vào manual request
            request_number: `REQ-${Date.now()}`, // Generate unique request number
            uploaded_at: new Date(),
            processed_at: new Date(),
            points: points?.points_awarded ?? 0,
            invoice_number: ticket_number,
          },
        );

        const savedRequest = await queryRunner.manager.save(manualRequest);

        // Commit transaction
        await queryRunner.commitTransaction();

        return savedRequest;
      }
    } catch (error) {
      // Rollback transaction on error
      await queryRunner.rollbackTransaction();
      throw new Error(error?.message || 'Failed to create manual request');
    } finally {
      await queryRunner.release();
    }
  }

  async findFlightInfoBySomeFields(ticketNumber: string, seat_code?: string) {
    try {
      if (!ticketNumber) {
        throw new Error('Ticket number is required');
      }

      // Index đã được tạo trong migration FlightInfoIndexes1755279000000
      // idx_flight_info_ticket_number, idx_flight_info_seat_code, idx_flight_info_ticket_seat

      let queryBuilder = this.flightInfoRepository
        .createQueryBuilder('flight')
        .select([
          'flight.id',
          'flight.flight',
          'flight.flight_arrival_airport',
          'flight.flight_departure_airport',
          'flight.flight_arrival_date',
          'flight.flight_departure_date',
          'flight.ticket_number',
          'flight.class_ticket',
          'flight.seat_code',
          'flight.distance',
        ]);

      if (seat_code) {
        // Query với cả ticket_number và seat_code
        queryBuilder = queryBuilder
          .where(
            'flight.ticket_number = :ticketNumber AND flight.seat_code = :seat_code',
            { ticketNumber, seat_code },
          )
          .useIndex('idx_flight_info_ticket_seat');
      } else {
        // Query chỉ với ticket_number
        queryBuilder = queryBuilder
          .where('flight.ticket_number = :ticketNumber', { ticketNumber })
          .useIndex('idx_flight_info_ticket_number');
      }

      const flight = await queryBuilder.getOne();

      return flight; // Không throw error nếu không tìm thấy, để caller xử lý
    } catch (error: any) {
      throw new Error(error?.message);
    }
  }

  async getListManualRequest(
    query: {
      userId: string;
      status?: EnumStatusClaimMilesList;
      sort?: EnumSortClaimMilesList;
    } & PagingConfig,
  ) {
    try {
      const { userId, status, sort = 'desc', page = 1, size = 10 } = query;
      if (!userId) {
        throw new Error('User ID is required');
      }

      // Build base query with user relation filter
      const queryBuilder = this.manualPointsRequestRepository
        .createQueryBuilder('manualPointsRequest')
        .leftJoinAndSelect('manualPointsRequest.user', 'user')
        .where('user.id = :userId', { userId })
        .select([
          'manualPointsRequest.id',
          'manualPointsRequest.request_type',
          'manualPointsRequest.status',
          'manualPointsRequest.points',
          'manualPointsRequest.description',
          'manualPointsRequest.ticket_number',
          'manualPointsRequest.seat_code',
          'manualPointsRequest.flight_code',
          'manualPointsRequest.flight_departure_airport',
          'manualPointsRequest.flight_arrival_airport',
          'manualPointsRequest.flight_departure_date',
          'manualPointsRequest.flight_arrival_date',
          'manualPointsRequest.uploaded_at',
          'manualPointsRequest.processed_at',
          'manualPointsRequest.request_number',
          'user.id',
          'user.first_name',
          'user.last_name',
          'user.user_name',
          'user.user_number',
        ]);

      // Add status filter if provided
      if (status) {
        queryBuilder.andWhere('manualPointsRequest.status = :status', {
          status,
        });
      }

      // Add sorting - sử dụng uploaded_at thay vì created_at
      if (sort) {
        switch (sort) {
          case EnumSortClaimMilesList.asc:
            queryBuilder.orderBy('manualPointsRequest.uploaded_at', 'ASC');
            break;
          case EnumSortClaimMilesList.desc:
            queryBuilder.orderBy('manualPointsRequest.uploaded_at', 'DESC');
            break;
        }
      } else {
        // Default sort by newest
        queryBuilder.orderBy('manualPointsRequest.uploaded_at', 'DESC');
      }

      // Add pagination
      const skip = (page - 1) * size;
      queryBuilder.skip(skip).take(size);

      // Get total count for pagination
      const [data, total] = await queryBuilder.getManyAndCount();

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
      throw new Error(error?.message || 'Failed to get manual requests list');
    }
  }

  // Get list manual request for admin
  async getListManualRequestForAdmin(
    query: {
      status?: EnumStatusClaimMilesList;
      sort?: EnumSortClaimMilesList;
      byUser?: string;
      userName?: string;
    } & PagingConfig,
  ) {
    try {
      const {
        status,
        sort = 'desc',
        page = 1,
        size = 10,
        byUser,
        userName,
      } = query;

      // Build base query with user relation filter
      const queryBuilder = this.manualPointsRequestRepository
        .createQueryBuilder('manualPointsRequest')
        .leftJoinAndSelect('manualPointsRequest.user', 'user')
        .select([
          'manualPointsRequest.id',
          'manualPointsRequest.request_type',
          'manualPointsRequest.status',
          'manualPointsRequest.points',
          'manualPointsRequest.description',
          'manualPointsRequest.ticket_number',
          'manualPointsRequest.seat_code',
          'manualPointsRequest.flight_code',
          'manualPointsRequest.flight_departure_airport',
          'manualPointsRequest.flight_arrival_airport',
          'manualPointsRequest.flight_departure_date',
          'manualPointsRequest.flight_arrival_date',
          'manualPointsRequest.uploaded_at',
          'manualPointsRequest.processed_at',
          'manualPointsRequest.request_number',
          'user.id',
          'user.first_name',
          'user.last_name',
          'user.user_name',
          'user.user_number',
        ]);

      // Add status filter if provided
      if (status) {
        queryBuilder.andWhere('manualPointsRequest.status = :status', {
          status,
        });
      }

      if (byUser) {
        queryBuilder.andWhere('user.id = :byUser', { byUser });
      }

      if (userName) {
        queryBuilder.andWhere('user.user_name LIKE :userName', {
          userName: `%${userName}%`,
        });
      }

      // Add sorting - sử dụng uploaded_at thay vì created_at
      if (sort) {
        switch (sort) {
          case EnumSortClaimMilesList.asc:
            queryBuilder.orderBy('manualPointsRequest.uploaded_at', 'ASC');
            break;
          case EnumSortClaimMilesList.desc:
            queryBuilder.orderBy('manualPointsRequest.uploaded_at', 'DESC');
            break;
        }
      } else {
        // Default sort by newest
        queryBuilder.orderBy('manualPointsRequest.uploaded_at', 'DESC');
      }

      // Add pagination
      const skip = (page - 1) * size;
      queryBuilder.skip(skip).take(size);

      // Get total count for pagination
      const [data, total] = await queryBuilder.getManyAndCount();

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
      throw new Error(error?.message || 'Failed to get manual requests list');
    }
  }

  // Admin Overview
  async getOverview(query: OverviewQueryDto) {
    try {
      const {
        from,
        to,
        tz = 'UTC',
        status,
        request_type,
        date_field = DateField.UPLOADED,
      } = query;

      // Set default date range (last 7 days) if not provided
      const endDate = to ? new Date(to) : new Date();
      const startDate = from
        ? new Date(from)
        : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      // Build base query
      let baseQuery =
        this.manualPointsRequestRepository.createQueryBuilder('request');

      // Apply date filter based on date_field
      const dateColumn =
        date_field === DateField.PROCESSED ? 'processed_at' : 'uploaded_at';
      baseQuery = baseQuery.where(
        `request.${dateColumn} >= :startDate AND request.${dateColumn} <= :endDate`,
        {
          startDate,
          endDate,
        },
      );

      // Apply status filter
      if (status && status.length > 0) {
        baseQuery = baseQuery.andWhere('request.status IN (:...status)', {
          status,
        });
      }

      // Apply request_type filter
      if (request_type && request_type.length > 0) {
        baseQuery = baseQuery.andWhere(
          'request.request_type IN (:...request_type)',
          { request_type },
        );
      }

      // Get counts by status
      const statusCounts = await baseQuery
        .select('request.status', 'status')
        .addSelect('COUNT(*)', 'count')
        .groupBy('request.status')
        .getRawMany();

      // Get total miles for approved requests
      const totalMilesResult = await baseQuery
        .andWhere('request.status = :approvedStatus', {
          approvedStatus: RequestStatus.PROCESSED,
        })
        .select('SUM(request.points)', 'total_miles')
        .getRawOne();

      // Initialize counts
      const counts = {
        processed: 0,
        rejected: 0,
        processing: 0,
      };

      // Map status counts
      statusCounts.forEach((item) => {
        if (item.status in counts) {
          counts[item.status] = parseInt(item.count, 10);
        }
      });

      // Calculate delta (vs yesterday and vs week)
      const delta = await this.calculateDelta(query);

      return {
        processed: counts.processed,
        rejected: counts.rejected,
        processing: counts.processing,
        total_miles: parseInt(totalMilesResult?.total_miles || '0', 10),
        delta,
      };
    } catch (error) {
      throw new Error(error?.message || 'Failed to get overview data');
    }
  }

  // Calculate delta for overview
  private async calculateDelta(query: OverviewQueryDto) {
    const { date_field = DateField.UPLOADED, status, request_type } = query;
    const dateColumn =
      date_field === DateField.PROCESSED ? 'processed_at' : 'uploaded_at';

    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const dayBeforeYesterday = new Date(
      now.getTime() - 2 * 24 * 60 * 60 * 1000,
    );

    const thisWeekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastWeekStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const lastWeekEnd = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Build base query for delta calculations
    const buildDeltaQuery = (
      startDate: Date,
      endDate: Date,
      targetStatus?: string,
    ) => {
      let query = this.manualPointsRequestRepository
        .createQueryBuilder('request')
        .where(
          `request.${dateColumn} >= :startDate AND request.${dateColumn} <= :endDate`,
          {
            startDate,
            endDate,
          },
        );

      if (targetStatus) {
        query = query.andWhere('request.status = :status', {
          status: targetStatus,
        });
      }

      if (status && status.length > 0) {
        query = query.andWhere('request.status IN (:...statusFilter)', {
          statusFilter: status,
        });
      }

      if (request_type && request_type.length > 0) {
        query = query.andWhere('request.request_type IN (:...request_type)', {
          request_type,
        });
      }

      return query.getCount();
    };

    // Calculate yesterday vs day before yesterday for pending
    const [pendingYesterday, pendingDayBefore] = await Promise.all([
      buildDeltaQuery(yesterday, now, RequestStatus.PROCESSING),
      buildDeltaQuery(dayBeforeYesterday, yesterday, RequestStatus.PROCESSING),
    ]);

    // Calculate this week vs last week for approved and rejected
    const [
      approvedThisWeek,
      approvedLastWeek,
      rejectedThisWeek,
      rejectedLastWeek,
    ] = await Promise.all([
      buildDeltaQuery(thisWeekStart, now, RequestStatus.PROCESSED),
      buildDeltaQuery(lastWeekStart, lastWeekEnd, RequestStatus.PROCESSED),
      buildDeltaQuery(thisWeekStart, now, RequestStatus.REJECTED),
      buildDeltaQuery(lastWeekStart, lastWeekEnd, RequestStatus.REJECTED),
    ]);

    return {
      processing_vs_yesterday: Math.abs(pendingYesterday - pendingDayBefore),
      approved_vs_week: Math.abs(approvedThisWeek - approvedLastWeek),
      rejected_vs_week: Math.abs(rejectedThisWeek - rejectedLastWeek),
    };
  }

  // Admin Timeseries
  async getTimeseries(query: TimeseriesQueryDto) {
    try {
      const {
        from,
        to,
        tz = 'UTC',
        bucket = BucketType.DAY,
        request_type,
      } = query;

      // Set default date range (last 7 days) if not provided
      const endDate = to ? new Date(to) : new Date();
      const startDate = from
        ? new Date(from)
        : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      // Get bucket format for PostgreSQL
      const bucketFormat = this.getBucketFormat(bucket);

      // Build base query with timezone conversion
      const buildTimeseriesQuery = (
        dateColumn: string,
        statusFilter?: string,
        sumPoints = false,
      ) => {
        let query = this.manualPointsRequestRepository
          .createQueryBuilder('request')
          .select(
            `DATE_TRUNC('${bucket}', ${dateColumn} AT TIME ZONE '${tz}')`,
            'ts',
          );

        if (sumPoints) {
          query = query.addSelect('SUM(request.points)', 'sum_points');
        } else {
          query = query.addSelect('COUNT(*)', 'count');
        }

        query = query.where(
          `${dateColumn} >= :startDate AND ${dateColumn} <= :endDate`,
          {
            startDate,
            endDate,
          },
        );

        if (statusFilter) {
          query = query.andWhere('request.status = :status', {
            status: statusFilter,
          });
        }

        if (request_type && request_type.length > 0) {
          query = query.andWhere('request.request_type IN (:...request_type)', {
            request_type,
          });
        }

        return query.groupBy('ts').orderBy('ts', 'ASC').getRawMany();
      };

      // Get new requests (based on uploaded_at)
      const newRequestsData = await buildTimeseriesQuery('request.uploaded_at');

      // Get processed requests (based on processed_at with approved/rejected status)
      const processedData = await this.manualPointsRequestRepository
        .createQueryBuilder('request')
        .select(
          `DATE_TRUNC('${bucket}', request.processed_at AT TIME ZONE '${tz}')`,
          'ts',
        )
        .addSelect('COUNT(*)', 'count')
        .where(
          'request.processed_at >= :startDate AND request.processed_at <= :endDate',
          {
            startDate,
            endDate,
          },
        )
        .andWhere('request.status IN (:...processedStatuses)', {
          processedStatuses: [RequestStatus.PROCESSED, RequestStatus.REJECTED],
        })
        .andWhere(
          request_type && request_type.length > 0
            ? 'request.request_type IN (:...request_type)'
            : '1=1',
          request_type && request_type.length > 0 ? { request_type } : {},
        )
        .groupBy('ts')
        .orderBy('ts', 'ASC')
        .getRawMany();

      // Get miles credited (approved requests with sum of points)
      const milesCreditedData = await this.manualPointsRequestRepository
        .createQueryBuilder('request')
        .select(
          `DATE_TRUNC('${bucket}', request.processed_at AT TIME ZONE '${tz}')`,
          'ts',
        )
        .addSelect('SUM(request.points)', 'sum_points')
        .where(
          'request.processed_at >= :startDate AND request.processed_at <= :endDate',
          {
            startDate,
            endDate,
          },
        )
        .andWhere('request.status = :approvedStatus', {
          approvedStatus: RequestStatus.PROCESSED,
        })
        .andWhere(
          request_type && request_type.length > 0
            ? 'request.request_type IN (:...request_type)'
            : '1=1',
          request_type && request_type.length > 0 ? { request_type } : {},
        )
        .groupBy('ts')
        .orderBy('ts', 'ASC')
        .getRawMany();

      // Format response
      const formatTimeseries = (data: any[], isPoints = false) => {
        return data.map((item) => ({
          ts: item.ts.toISOString().split('T')[0], // Format as YYYY-MM-DD
          ...(isPoints
            ? { sum_points: parseInt(item.sum_points || '0', 10) }
            : { count: parseInt(item.count || '0', 10) }),
        }));
      };

      return {
        new_requests: formatTimeseries(newRequestsData),
        processed: formatTimeseries(processedData),
        miles_credited: formatTimeseries(milesCreditedData, true),
      };
    } catch (error) {
      throw new Error(error?.message || 'Failed to get timeseries data');
    }
  }

  // Admin Processing Speed
  async getProcessingSpeed(query: ProcessingSpeedQueryDto) {
    try {
      const {
        from,
        to,
        tz = 'UTC',
        bins = [6, 12, 18, 24, 30, 36, 42],
        request_type,
      } = query;

      // Set default date range (last 30 days) if not provided
      const endDate = to ? new Date(to) : new Date();
      const startDate = from
        ? new Date(from)
        : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      // Get processing times for completed requests
      const processingTimesQuery = this.manualPointsRequestRepository
        .createQueryBuilder('request')
        .select(
          'EXTRACT(EPOCH FROM (request.processed_at - request.uploaded_at)) / 3600',
          'processing_hours',
        )
        .where(
          'request.uploaded_at >= :startDate AND request.uploaded_at <= :endDate',
          {
            startDate,
            endDate,
          },
        )
        .andWhere('request.status IN (:...completedStatuses)', {
          completedStatuses: [RequestStatus.PROCESSED, RequestStatus.REJECTED],
        })
        .andWhere('request.processed_at IS NOT NULL');

      // Add request_type filter if provided
      if (request_type && request_type.length > 0) {
        processingTimesQuery.andWhere(
          'request.request_type IN (:...request_type)',
          { request_type },
        );
      }

      const processingTimes = await processingTimesQuery.getRawMany();

      // Calculate cumulative percentages for each bin
      const totalRequests = processingTimes.length;
      const cumulativePercent = bins.map((bin) => {
        const requestsWithinBin = processingTimes.filter(
          (item) => parseFloat(item.processing_hours) <= bin,
        ).length;
        return totalRequests > 0
          ? (requestsWithinBin / totalRequests) * 100
          : 0;
      });

      // Calculate percentiles
      const sortedTimes = processingTimes
        .map((item) => parseFloat(item.processing_hours))
        .sort((a, b) => a - b);

      const getPercentile = (percentile: number) => {
        if (sortedTimes.length === 0) return 0;
        const index = Math.ceil((percentile / 100) * sortedTimes.length) - 1;
        return sortedTimes[Math.max(0, index)] || 0;
      };

      const percentiles = {
        p50: getPercentile(50),
        p90: getPercentile(90),
        p95: getPercentile(95),
      };

      return {
        bins,
        cumulative_percent: cumulativePercent,
        percentiles,
      };
    } catch (error) {
      throw new Error(error?.message || 'Failed to get processing speed data');
    }
  }

  // Get bucket format for PostgreSQL DATE_TRUNC
  private getBucketFormat(bucket: BucketType): string {
    switch (bucket) {
      case BucketType.DAY:
        return 'day';
      case BucketType.WEEK:
        return 'week';
      case BucketType.MONTH:
        return 'month';
      default:
        return 'day';
    }
  }

  // Get manual member request detail
  async getManualRequestDetail(data: {
    id: string;
    userId: string;
  }): Promise<any> {
    try {
      const manualRequest = await this.manualPointsRequestRepository
        .createQueryBuilder('request')
        .leftJoinAndSelect('request.user', 'user')
        .select([
          'request.id',
          'request.description',
          'request.file_url',
          'request.request_type',
          'request.seat_code',
          'request.ticket_number',
          'request.status',
          'request.flight_code',
          'request.flight_departure_airport',
          'request.flight_arrival_airport',
          'request.flight_departure_date',
          'request.flight_arrival_date',
          'request.distance',
          'request.seat_class',
          'request.flight_airline',
          'request.request_number',
          'request.uploaded_at',
          'request.processed_at',
          'request.points',
          'user.id',
          'user.user_name',
          'user.user_email',
          'user.first_name',
          'user.last_name',
          'user.user_number',
          'user.city',
          'user.country',
          'user.phone_numbers',
          'user.zip',
          'user.state',
          'user.tier_id',
          'user.points_id',
          'user.district',
          'user.ward',
        ])
        .where('request.id = :id', { id: data.id })
        .andWhere('user.id = :userId', { userId: data.userId })
        .getOne();

      if (!manualRequest) {
        return {}; // Return null instead of empty object for better handling
      }

      return manualRequest;
    } catch (error) {
      console.log('get Manual Request Detail', error);
      throw new Error(error?.message || 'Failed to get manual request detail');
    }
  }

  // Get manual member request detail for admin
  async getManualRequestDetailForAdmin(data: { id: string }): Promise<any> {
    try {
      const manualRequest = await this.manualPointsRequestRepository
        .createQueryBuilder('request')
        .leftJoinAndSelect('request.user', 'user')
        .select([
          'request.id',
          'request.description',
          'request.file_url',
          'request.request_type',
          'request.seat_code',
          'request.ticket_number',
          'request.status',
          'request.flight_code',
          'request.flight_departure_airport',
          'request.flight_arrival_airport',
          'request.flight_departure_date',
          'request.flight_arrival_date',
          'request.distance',
          'request.seat_class',
          'request.flight_airline',
          'request.request_number',
          'request.uploaded_at',
          'request.processed_at',
          'request.points',
          'user.id',
          'user.user_name',
          'user.user_email',
          'user.first_name',
          'user.last_name',
          'user.user_number',
          'user.city',
          'user.country',
          'user.phone_numbers',
          'user.zip',
          'user.state',
          'user.tier_id',
          'user.points_id',
          'user.district',
          'user.ward',
        ])
        .where('request.id = :id', { id: data.id })
        .getOne();

      if (!manualRequest) {
        return {}; // Return null instead of empty object for better handling
      }

      return manualRequest;
    } catch (error) {
      console.log('get Manual Request Detail For Admin', error);
      throw new Error(error?.message || 'Failed to get manual request detail');
    }
  }

  // Change status manual request for admin
  async changeStatusManualRequestForAdmin(data: {
    id: string;
    status: EnumStatusClaimMilesList;
    userId: string;
    reason?: string;
  }): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { id, status, userId, reason } = data;

      // Get the manual request first to get points info
      const manualRequest = await queryRunner.manager.findOne(
        ManualPointsRequestEntity,
        {
          where: { id },
          relations: ['user'],
        },
      );

      if (!manualRequest) {
        throw new Error('Manual request not found');
      }

      if (
        [
          EnumStatusClaimMilesList.rejected,
          EnumStatusClaimMilesList.processed,
        ].includes(manualRequest?.status as any)
      ) {
        throw new Error('Manual request status is not processing');
      }

      // Update manual request status
      const updateResult = await queryRunner.manager.update(
        ManualPointsRequestEntity,
        { id },
        {
          status,
          processed_at: new Date(),
          processed_by: { id: userId },
          ...(reason &&
            status === EnumStatusClaimMilesList.rejected && { reason }),
        },
      );

      if (!updateResult.affected) {
        throw new Error('Failed to update manual request status');
      }

      if (status === EnumStatusClaimMilesList.rejected) {
        // For rejected status, just update and commit
        await queryRunner.commitTransaction();
        return {};
      }

      if (status === EnumStatusClaimMilesList.processed) {
        // Create points transaction record using PointTransactionsEntity
        const pointsTransaction = queryRunner.manager.create(
          PointTransactionsEntity,
          {
            user: manualRequest.user,
            request_type: manualRequest.request_type,
            transaction_type: 'earn', // Use correct enum value
            description: `Points awarded for manual request: ${manualRequest.description}`,
            status: 'processed', // Use correct enum value
            transaction_date: new Date(),
            reason: `Manual request approved - Request ID: ${id}`,
            transaction_source: 'internal', // Use correct enum value
            points_used: manualRequest.points, // Use correct field name
            points_used_at: new Date(),
          },
        );

        await queryRunner.manager.save(pointsTransaction);

        // Update user points - add points to balance
        await queryRunner.manager
          .createQueryBuilder()
          .update(PointsEntity)
          .set({
            total_points: () => `total_points + ${manualRequest.points}`,
            balance_points: () => `balance_points + ${manualRequest.points}`,
            available_points: () =>
              `available_points + ${manualRequest.points}`,
          })
          .where('user_id = :userId', { userId: pointsTransaction?.user?.id })
          .execute();

        await queryRunner.commitTransaction();
        return {
          points_awarded: manualRequest.points,
        };
      }

      await queryRunner.commitTransaction();
      return { success: true, message: 'Status updated successfully' };
    } catch (error) {
      await queryRunner.rollbackTransaction();

      // Log to sync_log table on failure using SyncLogEntity
      try {
        await this.dataSource.manager.save(SyncLogEntity, {
          sync_type: 'change_status_manual_request',
          sync_status: 'failed',
          payload: JSON.stringify(data),
          response: error.message,
          user: { id: data.userId }, // Set user relation
        });
      } catch (logError) {
        console.error('Failed to log sync error:', logError);
      }

      console.log('change Status Manual Request For Admin', error);
      throw new Error(
        error?.message || 'Failed to change status manual request',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async adminDirectMileage(data: {
    userId: string;
    points: number;
    description: string;
    request_type: RequestType;
    user_number: string;
  }): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await this.usersRepository
        .createQueryBuilder('user')
        .select(['user.id', 'user.user_name'])
        .where('user.user_number = :user_number', {
          user_number: data.user_number,
        })
        .getOne();

      if (!user) {
        throw new Error('User not found');
      }

      const point = calculatePointsByDistance({
        request_type: data.request_type,
        ...(data.request_type === RequestType.FLIGHT
          ? {
              distance_km: data.points,
            }
          : { amount: data.points }),
      });

      const pointsTransaction = queryRunner.manager.create(
        PointTransactionsEntity,
        {
          user: user,
          processed_by: { id: data.userId },
          transaction_type: 'earn',
          description: data.description,
          request_type: data.request_type,
          status: 'processed',
          transaction_date: new Date(),
          reason: '',
          transaction_source: 'internal',
          points_used: point?.points_awarded ?? 0,
          points_used_at: new Date(),
        },
      );

      await queryRunner.manager.save(pointsTransaction);

      await queryRunner.manager
        .createQueryBuilder()
        .update(PointsEntity)
        .set({
          total_points: () => `total_points + ${pointsTransaction.points_used}`,
          balance_points: () =>
            `balance_points + ${pointsTransaction.points_used}`,
          available_points: () =>
            `available_points + ${pointsTransaction.points_used}`,
        })
        .where('user_id = :userId', { userId: user?.id })
        .execute();

      await queryRunner.commitTransaction();
      return {
        points_awarded: pointsTransaction.points_used,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(error?.message || 'Failed to admin direct mileage');
    } finally {
      await queryRunner.release();
    }
  }
}
