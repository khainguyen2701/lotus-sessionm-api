import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import {
  OverviewResponseDto,
  TimeseriesResponseDto,
  ProcessingSpeedResponseDto,
  BucketType,
} from '../ms-loyalty/admin.dto';
import { UsersOverviewResponseDto } from '../ms-user/admin.dto';

// Dashboard Query DTO
export class DashboardOverviewQueryDto {
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

  @ApiPropertyOptional({
    description: 'Time bucket grouping',
    enum: BucketType,
    default: BucketType.DAY,
  })
  @IsOptional()
  @IsEnum(BucketType)
  bucket?: BucketType = BucketType.DAY;
}

// Dashboard Response DTO
export class DashboardOverviewResponseDto {
  @ApiProperty({
    description: 'Requests overview data',
    type: OverviewResponseDto,
  })
  requests: OverviewResponseDto;

  @ApiProperty({
    description: 'Requests timeseries data',
    type: TimeseriesResponseDto,
  })
  requests_timeseries: TimeseriesResponseDto;

  @ApiProperty({
    description: 'Processing speed data',
    type: ProcessingSpeedResponseDto,
  })
  processing_speed: ProcessingSpeedResponseDto;

  @ApiProperty({
    description: 'Members overview data',
    type: UsersOverviewResponseDto,
  })
  members: UsersOverviewResponseDto;

  @ApiProperty({ description: 'Total miles credited this month' })
  miles_this_month: number;
}

// Generic Dashboard API Response
export class DashboardApiResponseDto<T> {
  @ApiProperty({ description: 'Success status' })
  success: boolean;

  @ApiProperty({ description: 'Response data' })
  data: T;

  @ApiProperty({ description: 'Response timestamp' })
  timestamp: string;
}
