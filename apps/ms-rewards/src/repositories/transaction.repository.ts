import { PointTransactionsEntity } from '@app/database';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectRepository(PointTransactionsEntity)
    private transactionRepository: Repository<PointTransactionsEntity>,
  ) {}

  async getMemberTransactions(body: {
    userId: string;
    page?: number;
    size?: number;
  }): Promise<any> {
    try {
      // Validate userId is provided
      const { userId, size = 10, page = 1 } = body;

      // Additional safety checks
      if (page < 1 || size < 1 || size > 100) {
        throw new HttpException(
          'Invalid pagination parameters. Page must be >= 1, size must be between 1-100.',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Build query with proper field selection and ordering
      const queryBuilder = this.transactionRepository
        .createQueryBuilder('transactions')
        .leftJoin('transactions.user', 'user')
        .where('transactions.user_id = :userId', { userId })
        .select([
          'transactions.id',
          'transactions.transaction_type',
          'transactions.transaction_date',
          'transactions.description',
          'transactions.created_at',
          'transactions.updated_at',
          'transactions.transaction_source',
          'transactions.points_used',
          'transactions.points_used_at',
          'transactions.reason',
          'transactions.status',
          'user.id',
          'user.first_name',
          'user.last_name',
          'user.user_name',
          'user.user_number',
        ])
        .orderBy('transactions.created_at', 'DESC')
        .skip((page - 1) * size)
        .take(size);

      console.log('Query SQL:', queryBuilder.getSql());

      // Execute the query to get both data and count
      const [data, total] = await queryBuilder.getManyAndCount();

      const totalPages = Math.ceil(total / size);

      const result = {
        data: data ?? [],
        pagination: {
          total: total ?? 0,
          page: page ?? 1,
          size: size ?? 10,
          totalPages: totalPages ?? 0,
        },
      };

      return result;
    } catch (error) {
      // Re-throw HttpException as-is, wrap other errors
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `Failed to retrieve member transactions: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAdminTransactions(body: { size?: number; page?: number }) {
    try {
      // Validate userId is provided
      const { size = 10, page = 1 } = body;

      // Additional safety checks
      if (page < 1 || size < 1 || size > 100) {
        throw new HttpException(
          'Invalid pagination parameters. Page must be >= 1, size must be between 1-100.',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Build query with proper field selection and ordering
      const queryBuilder = this.transactionRepository
        .createQueryBuilder('transactions')
        .leftJoin('transactions.user', 'user')
        .select([
          'transactions.id',
          'transactions.transaction_type',
          'transactions.transaction_date',
          'transactions.description',
          'transactions.created_at',
          'transactions.updated_at',
          'transactions.transaction_source',
          'transactions.points_used',
          'transactions.points_used_at',
          'transactions.reason',
          'transactions.status',
          'user.id',
          'user.first_name',
          'user.last_name',
          'user.user_name',
          'user.user_number',
        ])
        .orderBy('transactions.created_at', 'DESC')
        .skip((page - 1) * size)
        .take(size);

      console.log('Query SQL:', queryBuilder.getSql());

      // Execute the query to get both data and count
      const [data, total] = await queryBuilder.getManyAndCount();

      const totalPages = Math.ceil(total / size);

      const result = {
        data: data ?? [],
        pagination: {
          total: total ?? 0,
          page: page ?? 1,
          size: size ?? 10,
          totalPages: totalPages ?? 0,
        },
      };

      return result;
    } catch (error) {
      // Re-throw HttpException as-is, wrap other errors
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `Failed to retrieve member transactions: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
