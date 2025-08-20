import { ApiProperty } from '@nestjs/swagger';

export class AdminOverViewDto {
  @ApiProperty({
    description: 'Overview success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Upload message',
    example: 'Overview data retrieved successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Overview data',
    required: false,
    example: {
      total_members: 3,
      new_members: 3,
      active_members: 3,
      by_tier: {
        member: 2,
        bronze: 1,
        silver: 0,
        gold: 0,
      },
    },
  })
  data: Record<string, any>;
}
export class AdminClaimMilesManualOverviewDto {
  @ApiProperty({
    description: 'Upload success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Upload message',
    example: 'Overview data retrieved successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Overview data',
    required: false,
    example: {
      processed: 0,
      rejected: 0,
      processing: 12,
      total_miles: 0,
      delta: {
        processing_vs_yesterday: -12,
        approved_vs_week: 0,
        rejected_vs_week: 0,
      },
    },
  })
  data: Record<string, any>;
}
export class AdminClaimMilesManualTimeseriesDto {
  @ApiProperty({
    description: 'Timeseries success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Timeseries message',
    example: 'Timeseries data retrieved successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Overview data',
    required: false,
    example: {
      new_requests: [
        {
          ts: '2025-08-17',
          count: 11,
        },
        {
          ts: '2025-08-18',
          count: 1,
        },
      ],
      processed: [],
      miles_credited: [],
    },
  })
  data: Record<string, any>;
}

export class AdminClaimMilesManualProcessingSpeedDto {
  @ApiProperty({
    description: 'Processing speed success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Processing speed message',
    example: 'Processing speed data retrieved successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Processing speed data',
    required: false,
    example: {
      bins: [6, 12, 18, 24, 30, 36, 42],
      cumulative_percent: [0, 0, 0, 0, 0, 0, 0],
      percentiles: {
        p50: 0,
        p90: 0,
        p95: 0,
      },
    },
  })
  data: Record<string, any>;
}
export class AdminTimeseriesDto {
  @ApiProperty({
    description: 'Timeseries success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Timeseries message',
    example: 'Timeseries data retrieved successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Timeseries data',
    required: false,
    example: {
      new_requests: [
        {
          ts: '2025-08-17',
          count: 11,
        },
        {
          ts: '2025-08-18',
          count: 1,
        },
      ],
      processed: [],
      miles_credited: [],
    },
  })
  data: Record<string, any>;
}
export class AdminDashboardOverviewDto {
  @ApiProperty({
    description: 'Dashboard success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Dashboard message',
    example: 'Dashboard data retrieved successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Dashboard data',
    required: false,
    example: {
      requests: {
        processed: 0,
        rejected: 0,
        processing: 12,
        total_miles: 0,
        delta: {
          processing_vs_yesterday: -12,
          approved_vs_week: 0,
          rejected_vs_week: 0,
        },
      },
      requests_timeseries: {
        new_requests: [
          {
            ts: '2025-08-17',
            count: 11,
          },
          {
            ts: '2025-08-18',
            count: 1,
          },
        ],
        processed: [],
        miles_credited: [],
      },
      processing_speed: {
        bins: [6, 12, 18, 24, 30, 36, 42],
        cumulative_percent: [0, 0, 0, 0, 0, 0, 0],
        percentiles: {
          p50: 0,
          p90: 0,
          p95: 0,
        },
      },
      members: {
        total_members: 3,
        new_members: 3,
        active_members: 3,
        by_tier: {
          member: 2,
          bronze: 1,
          silver: 0,
          gold: 0,
        },
      },
      miles_this_month: 0,
    },
  })
  data: Record<string, any>;
}

export class AdminChangeStatusResponse {
  @ApiProperty({
    description: 'Change status success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Change status message',
    example: 'Change status data retrieved successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Change status data',
    required: false,
    example: {
      points_awarded: 995,
    },
  })
  data: Record<string, any>;
}

export class AdminChangeStatusResponseError {
  @ApiProperty({
    description: 'Change status error status',
    example: false,
  })
  success: boolean;

  @ApiProperty({
    description: 'Change status status code',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Change status data',
    required: false,
    example: {
      message: 'Validation failed (uuid is expected)',
      error: 'Bad Request',
      statusCode: 400,
    },
  })
  message: Record<string, any>;
}

export class AdminChangeStatusResponseErrorStatus {
  @ApiProperty({
    description: 'Change status error status',
    example: false,
  })
  success: boolean;

  @ApiProperty({
    description: 'Change status status code',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Change status data',
    required: false,
    example: {
      message: [
        'status must be one of the following values: processed, rejected',
      ],
      error: 'Bad Request',
      statusCode: 400,
    },
  })
  message: Record<string, any>;
}

export class AdminChangeStatusRequestDto {
  @ApiProperty({
    description: 'Change status request data',
    required: true,
    enum: ['processed', 'rejected'],
  })
  status: 'processed' | 'rejected';

  @ApiProperty({
    description: 'Change status request data',
    required: false,
    example: 'Reason for change status',
  })
  reason: string;
}
