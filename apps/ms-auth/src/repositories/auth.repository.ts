import { HttpClientService } from '@app/common';
import {
  AuthAdminSignUpDTO,
  AuthMemberSignUpDTO,
} from '@app/common/dto/ms-auth/auth-member.dto';
import {
  DatabaseTransactionException,
  UserNotFoundException,
} from '@app/common/httpCode/http.custom';
import { generateVNAUserNumber } from '@app/common/utils/genUserNumber';
import {
  AccountsEntity,
  PointsEntity,
  TiersEntity,
  UsersEntity,
} from '@app/database';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class AuthRepository {
  private readonly logger = new Logger(AuthRepository.name);
  private readonly saltRounds: number;

  constructor(
    @InjectRepository(UsersEntity)
    private userEntities: Repository<UsersEntity>,
    @InjectRepository(AccountsEntity)
    private accountEntities: Repository<AccountsEntity>,
    @InjectRepository(TiersEntity)
    private tiersEntities: Repository<TiersEntity>,
    @InjectRepository(PointsEntity)
    private pointsEntities: Repository<PointsEntity>,
    private dataSource: DataSource,
    private configService: ConfigService,
    private httpClientService: HttpClientService,
  ) {
    this.saltRounds = this.configService.get<number>('auth.saltRounds', 12);
  }

  /**
   * Extract username from email (remove domain part)
   * @param email - Email address
   * @returns Username part of email
   */
  private extractUsernameFromEmail(email: string): string {
    if (!email || !email.includes('@')) {
      throw new Error('Invalid email format');
    }
    return email.split('@')[0].toLowerCase().trim();
  }

  /**
   * Validate email format
   * @param email - Email to validate
   * @returns boolean
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Register a new user with associated account
   * @param body - User registration data
   * @returns User ID and Account ID with account info
   * @throws UserAlreadyExistsException if email already exists
   * @throws DatabaseTransactionException if transaction fails
   */
  async signUpMemberPortal(body: AuthMemberSignUpDTO): Promise<{
    user_id: string;
    account_id: string;
    user: Partial<UsersEntity>;
  }> {
    const {
      password,
      email,
      first_name,
      last_name,
      address,
      city,
      country,
      dob,
      gender,
      phone_numbers,
      state,
      zip,
    } = body;

    // Validate input
    if (
      !email ||
      !password ||
      !first_name ||
      !last_name ||
      !address ||
      !city ||
      !country ||
      !dob ||
      !gender ||
      !phone_numbers ||
      !state ||
      !zip
    ) {
      throw new Error(
        'Missing required fields: email, password, first_name, last_name, address, city, country, dob, gender, phone_numbers, state, zip',
      );
    }

    // Validate email format
    if (!this.isValidEmail(email)) {
      throw new Error('Invalid email format');
    }

    // Check if email already exists in accounts
    const existingAccount = await this.checkEmailExists(email);
    if (existingAccount) {
      this.logger.warn(`Attempt to register with existing email: ${email}`);
      throw new Error('Email already exists');
    }

    // Extract username from email
    const username = first_name + last_name;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      this.logger.log(`Starting user registration for email: ${email}`);

      // Hash password with configurable salt rounds
      const hashedPassword = await hash(password, this.saltRounds);

      // Create account first
      const account = await queryRunner.manager.save(AccountsEntity, {
        account_email: email.toLowerCase().trim(),
        password: hashedPassword,
        account_name: username,
        status: 'active',
        account_phone: phone_numbers, // Set to null to avoid unique constraint violation
      });

      // // Find bronze tier to assign to new user
      // const bronzeTier = await queryRunner.manager.findOne(TiersEntity, {
      //   where: { tier_name: 'bronze' },
      // });

      // Create points record first (without user reference)
      const pointsEntity = queryRunner.manager.create(PointsEntity, {
        total_points: 0,
        used_points: 0,
        balance_points: 0,
        available_points: 0,
      });

      const points = await queryRunner.manager.save(pointsEntity);

      this.logger.log(`Points record created first - Points ID: ${points.id}`);

      const userNumber = generateVNAUserNumber();

      // Create user with references to account, tier, and points
      const user = await queryRunner.manager.save(UsersEntity, {
        user_email: email.toLowerCase().trim(),
        user_name: username,
        user_number: userNumber,
        user_type: 'user', // Set as 'user' since enum only has 'user' and 'admin'
        account: account,
        tier: {}, // Assign bronze tier to new user
        points: points, // Assign points to new user
        first_name: first_name,
        last_name: last_name,
        address: address,
        city: city,
        country: country,
        dob: dob,
        gender: gender,
        phone_numbers: phone_numbers,
        state: state,
        zip: zip,
      });

      // Update points with user reference to complete the relationship
      points.user = user;
      await queryRunner.manager.save(points);

      this.logger.log(
        `User created with tier and points - User ID: ${user.id}, Points ID: ${points.id}`,
      );

      await queryRunner.commitTransaction();

      this.logger.log(
        `User registered successfully - User ID: ${user.id}, Account ID: ${account.id}`,
      );

      // Return sanitized response (no password)
      const data = {
        user_id: user.id,
        account_id: account.id,
        user: {
          id: user.id,
          user_name: user.user_name,
          user_email: user.user_email,
          user_type: user.user_type,
          created_at: user.created_at,
        },
      };
      return data;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        `User registration failed for email: ${email}`,
        error.stack,
      );
      throw new DatabaseTransactionException(
        error?.message ?? 'Failed to create user account',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async signUpAdminPortal(body: AuthAdminSignUpDTO): Promise<{
    user_id: string;
    account_id: string;
    user: Partial<UsersEntity>;
  }> {
    const { password, email } = body;

    // Validate input
    if (!email || !password) {
      throw new Error('Missing required fields: email, password');
    }
    // Validate email format
    if (!this.isValidEmail(email)) {
      throw new Error('Invalid email format');
    }
    // Check if email already exists in accounts
    const existingAccount = await this.checkEmailExists(email);
    if (existingAccount) {
      this.logger.warn(`Attempt to register with existing email: ${email}`);
      throw new Error('Email already exists');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Extract username from email
      const username = this.extractUsernameFromEmail(email);

      // Hash password with configurable salt rounds
      const hashedPassword = await hash(password, this.saltRounds);

      // Create account first
      const account = await queryRunner.manager.save(AccountsEntity, {
        account_email: email.toLowerCase().trim(),
        password: hashedPassword,
        account_name: username,
        status: 'active',
        account_phone: null, // Set to null to avoid unique constraint violation
      });

      // Create user with reference to account and bronze tier
      const user = await queryRunner.manager.save(UsersEntity, {
        user_email: email.toLowerCase().trim(),
        user_name: username,
        user_type: 'admin', // Set as 'admin' since enum only has 'user' and 'admin'
        account: account,
        tier: {}, // Assign bronze tier to new admin user
      });

      this.logger.log(
        `Admin user created: ${user.id} - Account ID: ${account.id}`,
      );

      await queryRunner.commitTransaction();

      return {
        user_id: user.id,
        account_id: account.id,
        user: {
          id: user.id,
          user_name: user.user_name,
          user_email: user.user_email,
          user_type: user.user_type,
          created_at: user.created_at,
        },
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        `User registration failed for email: ${email}`,
        error.stack,
      );
      throw new DatabaseTransactionException(
        error?.message ?? 'Failed to create user account',
      );
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Find user by email with optimized query
   * @param email - User email
   * @returns User entity or null
   */
  async findUserByEmail(email: string): Promise<UsersEntity | null> {
    if (!email) {
      throw new Error('Email is required');
    }

    try {
      const user = await this.dataSource.getRepository(UsersEntity).findOne({
        where: { user_email: email.toLowerCase().trim() },
        relations: ['account'],
      });

      this.logger.debug(
        `User lookup for email: ${email} - ${user ? 'Found' : 'Not found'}`,
      );
      return user;
    } catch (error) {
      this.logger.error(`Error finding user by email: ${email}`, error.stack);
      throw new DatabaseTransactionException('Failed to find user');
    }
  }

  /**
   * Find user by ID with optimized query
   * @param id - User ID
   * @returns User entity or null
   */
  async findUserById(id: string): Promise<UsersEntity | null> {
    if (!id) {
      throw new Error('User ID is required');
    }

    try {
      const user = await this.userEntities.findOne({
        where: { id },
        relations: ['account'],
      });

      if (!user) {
        this.logger.debug(`User not found with ID: ${id}`);
        return null;
      }

      this.logger.debug(`User found with ID: ${id}`);
      return user;
    } catch (error) {
      this.logger.error(`Error finding user by ID: ${id}`, error.stack);
      throw new DatabaseTransactionException('Failed to find user');
    }
  }

  async findAccountByEmailAndUserType(
    email: string,
    userType: 'user' | 'admin',
  ): Promise<AccountsEntity | null> {
    try {
      const account = await this.accountEntities.findOne({
        where: { account_email: email },
        relations: ['user'],
      });

      console.log('account', account);

      if (!account) {
        throw new Error(`Account not found with email: ${email}`);
      }

      this.logger.debug(
        `Account lookup for email: ${email} - ${account ? 'Found' : 'Not found'}`,
      );
      if (account.user?.user_type !== userType) {
        this.logger.debug(
          `Account type mismatch for email: ${email} - Expected: ${userType}, Found: ${account.user?.user_type}`,
        );
        throw new Error(
          `Account type mismatch for email: ${email} - Expected: ${userType}, Found: ${account.user?.user_type}`,
        );
      }
      return account;
    } catch (error) {
      this.logger.error(
        `Error finding account by email: ${email}`,
        error.stack,
      );
      throw new Error(error?.message ?? 'Failed to find account');
    }
  }

  /**
   * Check if email already exists in accounts table
   * @param email - Email to check
   * @returns boolean
   */
  async checkEmailExists(email: string): Promise<boolean> {
    if (!email) {
      return false;
    }

    try {
      const count = await this.accountEntities.count({
        where: { account_email: email.toLowerCase().trim() },
      });

      return count > 0;
    } catch (error) {
      this.logger.error(
        `Error checking email existence: ${email}`,
        error.stack,
      );
      throw new DatabaseTransactionException('Failed to check email');
    }
  }

  /**
   * Update user password
   * @param userId - User ID
   * @param newPassword - New password (plain text)
   * @returns boolean indicating success
   */
  async updatePassword(userId: string, newPassword: string): Promise<boolean> {
    if (!userId || !newPassword) {
      throw new Error('User ID and new password are required');
    }

    try {
      // Check if user exists and get associated account
      const user = await this.findUserById(userId);
      if (!user) {
        this.logger.error(`User not found for password update: ${userId}`);
        throw new UserNotFoundException();
      }

      if (!user.account) {
        this.logger.error(
          `Account relationship not loaded for user: ${userId}`,
        );
        throw new Error('Account relationship not found for user');
      }

      if (!user.account.id) {
        this.logger.error(`Account ID is null/undefined for user: ${userId}`);
        throw new Error('Account ID is missing');
      }

      this.logger.debug(
        `Updating password for user: ${userId}, account: ${user.account.id}`,
      );

      // Hash new password
      const hashedPassword = await hash(newPassword, this.saltRounds);

      // Update password in accounts table with explicit validation
      const updateData = { password: hashedPassword };
      this.logger.debug(`Update data prepared:`, {
        accountId: user.account.id,
        hasPassword: !!updateData.password,
      });

      const result = await this.dataSource
        .getRepository(AccountsEntity)
        .update(user.account.id, updateData);

      const success = !!(result.affected && result.affected > 0);

      if (success) {
        this.logger.log(`Password updated successfully for user ID: ${userId}`);
      } else {
        this.logger.warn(
          `Password update failed - no rows affected for user ID: ${userId}`,
        );
      }

      return success;
    } catch (error: any) {
      if (error instanceof UserNotFoundException) {
        throw error;
      }
      this.logger.error(
        `Error updating password for user ID: ${userId}`,
        error?.stack,
      );
      throw new DatabaseTransactionException('Failed to update password');
    }
  }

  /**
   * Verify user credentials for login
   * @param email - User email
   * @param password - Plain text password
   * @returns User entity without password or null
   */
  // async verifyCredentials(
  //   email: string,
  //   password: string,
  // ): Promise<Omit<UsersEntity, 'password'> | null> {
  //   if (!email || !password) {
  //     throw new Error('Email and password are required');
  //   }

  //   try {
  //     // Find user with account for password comparison
  //     const user = await this.findUserByEmail(email);
  //     if (!user || !user.account) {
  //       this.logger.debug(`Login attempt with non-existent email: ${email}`);
  //       return null;
  //     }

  //     // Compare password with account password
  //     const isPasswordValid = await compare(password, user.account.password);
  //     if (!isPasswordValid) {
  //       this.logger.warn(`Invalid password attempt for email: ${email}`);
  //       return null;
  //     }

  //     this.logger.log(`Successful login for email: ${email}`);

  //     // Return user without account password for security
  //     return {
  //       id: user.id,
  //       user_name: user.user_name,
  //       user_email: user.user_email,
  //       user_type: user.user_type,
  //       created_at: user.created_at,
  //       updated_at: user.updated_at,
  //       tier: user.tier,
  //       point_transactions: user.point_transactions,
  //       redemtions: user.redemtions,
  //       sessionm_account: user.sessionm_account,
  //       sync_logs: user.sync_logs,
  //       manual_points_requests: user.manual_points_requests,
  //       account: user.account
  //         ? {
  //             id: user.account.id,
  //             account_name: user.account.account_name,
  //             account_email: user.account.account_email,
  //             status: user.account.status,
  //             created_at: user.account.created_at,
  //             updated_at: user.account.updated_at,
  //           }
  //         : undefined,
  //     } as Omit<UsersEntity, 'password'>;
  //   } catch (error) {
  //     this.logger.error(
  //       `Error verifying credentials for email: ${email}`,
  //       error.stack,
  //     );
  //     throw new DatabaseTransactionException('Failed to verify credentials');
  //   }
  // }

  /**
   * Get user with account information
   * @param userId - User ID
   * @returns User with account or null
   */
  async getUserWithAccount(userId: string): Promise<UsersEntity | null> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      const user = await this.userEntities.findOne({
        where: { id: userId },
        relations: ['account'],
      });

      if (!user) {
        this.logger.debug(`User with account not found for ID: ${userId}`);
        return null;
      }

      this.logger.debug(`User with account found for ID: ${userId}`);
      return user;
    } catch (error) {
      this.logger.error(
        `Error getting user with account for ID: ${userId}`,
        error.stack,
      );
      throw new DatabaseTransactionException('Failed to get user with account');
    }
  }
}
