/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { PagingConfig } from '@app/common/decorators/paging.decorators';
import { CreateManualRequestDTO } from '@app/common/dto/ms-loyalty/manual-request.dto';
import { calculatePointsByDistance } from '@app/common/utils/caculatePointsByDistane';
import {
  FlightInfoEntity,
  ManualPointsRequestEntity,
  UsersEntity,
} from '@app/database';
import { Injectable } from '@nestjs/common';
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
      const user = await this.usersRepository
        .createQueryBuilder('user')
        .where('user.id = :userId', { userId })
        .useIndex('idx_users_id') // Use index on id column
        .getOne();

      if (!user) {
        throw new Error('User not found');
      }

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
}
