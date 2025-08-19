/* eslint-disable @typescript-eslint/no-unsafe-return */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsEnum,
  IsDateString,
  IsArray,
} from 'class-validator';

// Enums
export enum UserTier {
  MEMBER = 'member',
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum UserBucketType {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
}

// Base Query DTO
export class BaseUserAdminQueryDto {
  @ApiPropertyOptional({
    description: 'Start date in ISO 8601 format',
    example: '2025-08-01T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiPropertyOptional({
    description: 'End date in ISO 8601 format',
    example: '2025-08-31T23:59:59Z',
  })
  @IsOptional()
  @IsDateString()
  to?: string;

  @ApiPropertyOptional({
    description: 'Timezone',
    example: 'Asia/Ho_Chi_Minh',
    default: 'UTC',
  })
  @IsOptional()
  @IsString()
  tz?: string = 'UTC';
}

// Users Overview Query DTO
export class UsersOverviewQueryDto extends BaseUserAdminQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by user tier',
    enum: UserTier,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(UserTier, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  tier?: UserTier[];

  @ApiPropertyOptional({
    description: 'Filter by user status',
    enum: UserStatus,
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}

// Users Timeseries Query DTO
export class UsersTimeseriesQueryDto extends BaseUserAdminQueryDto {
  @ApiPropertyOptional({
    description: 'Time bucket grouping',
    enum: UserBucketType,
    default: UserBucketType.DAY,
  })
  @IsOptional()
  @IsEnum(UserBucketType)
  bucket?: UserBucketType = UserBucketType.DAY;
}

// Response DTOs
export class TierBreakdownDto {
  @ApiProperty({ description: 'Number of member tier users' })
  member: number;

  @ApiProperty({ description: 'Number of bronze tier users' })
  bronze: number;

  @ApiProperty({ description: 'Number of silver tier users' })
  silver: number;

  @ApiProperty({ description: 'Number of gold tier users' })
  gold: number;
}

export class UsersOverviewResponseDto {
  @ApiProperty({ description: 'Total number of members' })
  total_members: number;

  @ApiProperty({ description: 'Number of new members in the period' })
  new_members: number;

  @ApiProperty({ description: 'Number of active members' })
  active_members: number;

  @ApiProperty({ description: 'Breakdown by tier', type: TierBreakdownDto })
  by_tier: TierBreakdownDto;
}

export class UsersTimeseriesDataPointDto {
  @ApiProperty({ description: 'Timestamp' })
  ts: string;

  @ApiProperty({ description: 'Count of new members for this time period' })
  count: number;
}

export class UsersTimeseriesResponseDto {
  @ApiProperty({
    description: 'New members timeseries',
    type: [UsersTimeseriesDataPointDto],
  })
  new_members: UsersTimeseriesDataPointDto[];
}

// Generic API Response
export class UserApiResponseDto<T> {
  @ApiProperty({ description: 'Success status' })
  success: boolean;

  @ApiProperty({ description: 'Response data' })
  data: T;

  @ApiProperty({ description: 'Response timestamp' })
  timestamp: string;
}
