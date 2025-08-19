/* eslint-disable @typescript-eslint/no-unsafe-return */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

// Enums
export enum RequestStatus {
  PROCESSING = 'processing',
  REJECTED = 'rejected',
  PROCESSED = 'processed',
}

export enum RequestType {
  FLIGHT = 'flight',
  PURCHASE = 'purchase',
  OTHER = 'other',
}

export enum DateField {
  UPLOADED = 'uploaded',
  PROCESSED = 'processed',
}

export enum BucketType {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
}

// Base Query DTO
export class BaseAdminQueryDto {
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

// Overview Query DTO
export class OverviewQueryDto extends BaseAdminQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by status',
    enum: RequestStatus,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(RequestStatus, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  status?: RequestStatus[];

  @ApiPropertyOptional({
    description: 'Filter by request type',
    enum: RequestType,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(RequestType, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  request_type?: RequestType[];

  @ApiPropertyOptional({
    description: 'Date field to use for filtering',
    enum: DateField,
    default: DateField.UPLOADED,
  })
  @IsOptional()
  @IsEnum(DateField)
  date_field?: DateField = DateField.UPLOADED;
}

// Timeseries Query DTO
export class TimeseriesQueryDto extends BaseAdminQueryDto {
  @ApiPropertyOptional({
    description: 'Time bucket grouping',
    enum: BucketType,
    default: BucketType.DAY,
  })
  @IsOptional()
  @IsEnum(BucketType)
  bucket?: BucketType = BucketType.DAY;

  @ApiPropertyOptional({
    description: 'Filter by request type',
    enum: RequestType,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(RequestType, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  request_type?: RequestType[];
}

// Processing Speed Query DTO
export class ProcessingSpeedQueryDto extends BaseAdminQueryDto {
  @ApiPropertyOptional({
    description: 'Comma-separated list of hour bins',
    example: '6,12,18,24,30,36,42',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value
        .split(',')
        .map((v) => parseInt(v.trim(), 10))
        .filter((v) => !isNaN(v));
    }
    return value;
  })
  bins?: number[];

  @ApiPropertyOptional({
    description: 'Filter by request type',
    enum: RequestType,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(RequestType, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  request_type?: RequestType[];
}

// Response DTOs
export class DeltaDto {
  @ApiProperty({ description: 'Change vs yesterday' })
  pending_vs_yesterday: number;

  @ApiProperty({ description: 'Approved change vs last week' })
  approved_vs_week: number;

  @ApiProperty({ description: 'Rejected change vs last week' })
  rejected_vs_week: number;
}

export class OverviewResponseDto {
  @ApiProperty({ description: 'Number of processing requests' })
  processing: number;

  @ApiProperty({ description: 'Number of processed requests' })
  processed: number;

  @ApiProperty({ description: 'Number of rejected requests' })
  rejected: number;

  @ApiProperty({ description: 'Total miles credited' })
  total_miles: number;

  @ApiProperty({ description: 'Delta calculations', type: DeltaDto })
  delta: DeltaDto;
}

export class TimeseriesDataPointDto {
  @ApiProperty({ description: 'Timestamp' })
  ts: string;

  @ApiProperty({ description: 'Count for this time period' })
  count?: number;

  @ApiProperty({ description: 'Sum of points for this time period' })
  sum_points?: number;
}

export class TimeseriesResponseDto {
  @ApiProperty({
    description: 'New requests timeseries',
    type: [TimeseriesDataPointDto],
  })
  new_requests: TimeseriesDataPointDto[];

  @ApiProperty({
    description: 'Processed requests timeseries',
    type: [TimeseriesDataPointDto],
  })
  processed: TimeseriesDataPointDto[];

  @ApiProperty({
    description: 'Miles credited timeseries',
    type: [TimeseriesDataPointDto],
  })
  miles_credited: TimeseriesDataPointDto[];
}

export class PercentilesDto {
  @ApiProperty({ description: '50th percentile processing time in hours' })
  p50: number;

  @ApiProperty({ description: '90th percentile processing time in hours' })
  p90: number;

  @ApiProperty({ description: '95th percentile processing time in hours' })
  p95: number;
}

export class ProcessingSpeedResponseDto {
  @ApiProperty({ description: 'Hour bins', type: [Number] })
  bins: number[];

  @ApiProperty({ description: 'Cumulative percentages', type: [Number] })
  cumulative_percent: number[];

  @ApiProperty({ description: 'Percentiles', type: PercentilesDto })
  percentiles: PercentilesDto;
}

// Generic API Response
export class ApiResponseDto<T> {
  @ApiProperty({ description: 'Success status' })
  success: boolean;

  @ApiProperty({ description: 'Response data' })
  data: T;

  @ApiProperty({ description: 'Response timestamp' })
  timestamp: string;
}
