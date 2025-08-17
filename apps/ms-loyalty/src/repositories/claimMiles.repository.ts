/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { CreateManualRequestDTO } from '@app/common/dto/ms-loyalty/manual-request.dto';
import { calculatePointsByDistance } from '@app/common/utils/caculatePointsByDistane';
import { FlightInfoEntity, ManualPointsRequestEntity } from '@app/database';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ClaimMilesRepository {
  constructor(
    @InjectRepository(ManualPointsRequestEntity)
    private manualPointsRequestRepository: Repository<ManualPointsRequestEntity>,
    private dataSource: DataSource,
    @InjectRepository(FlightInfoEntity)
    private flightInfoRepository: Repository<FlightInfoEntity>,
  ) {}
  async createManualRequest(data: CreateManualRequestDTO): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const {
      description,
      file_url,
      request_type,
      seat_code,
      ticket_number,
      amount = 0,
    } = data;

    try {
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

      // Tạo manual request với flight info
      const manualRequest = queryRunner.manager.create(
        ManualPointsRequestEntity,
        {
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
}
