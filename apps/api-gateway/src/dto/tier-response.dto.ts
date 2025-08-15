import { ApiProperty } from '@nestjs/swagger';

class TierData {
  @ApiProperty({
    description: 'Tier ID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  id: string;

  @ApiProperty({
    description: 'Tier name',
    example: 'gold',
  })
  tier_name: string;

  @ApiProperty({
    description: 'Tier description',
    example: 'Gold tier with premium benefits',
  })
  tier_description: string;

  @ApiProperty({
    description: 'Tier benefits',
    example: ['Priority boarding', 'Extra baggage allowance', 'Lounge access'],
    type: [String],
  })
  benefit: string[];

  @ApiProperty({
    description: 'Minimum points required for this tier',
    example: 5000,
  })
  min_points: number;

  @ApiProperty({
    description: 'Maximum points for this tier',
    example: 10000,
  })
  max_points: number;

  @ApiProperty({
    description: 'Tier priority (lower number means higher priority)',
    example: 2,
  })
  priority: number;
}

export class TierCreateResponseDto {
  @ApiProperty({
    description: 'Operation success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Tier created successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Tier data',
    type: TierData,
  })
  data: TierData;
}
