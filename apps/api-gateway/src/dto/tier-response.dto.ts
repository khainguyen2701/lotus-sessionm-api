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

export class TierGetAllResponseDto {
  @ApiProperty({
    description: 'Operation success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Retrieved all tiers successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Array of tier data',
    type: [TierData],
    example: [
      {
        id: '397e708f-c069-4cf6-b961-254738ecd609',
        tier_name: 'gold',
        tier_description:
          'Hội viên hạng thẻ Triệu dặm có thể tặng 01 thẻ hạng Bạch kim cho người thân trong Tài khoản gia đình...',
        min_points: 1000,
        max_points: 99999999,
        priority: 1,
        benefit: [
          'Miễn phí hoặc giảm giá khi mua trước chỗ ngồi',
          'Làm thủ tục tại quầy ưu tiên - Mời thêm 5 khách',
        ],
        next_tier: null,
        previous_tier: 'gold',
        maintain_points: 1000,
        points_reward: 1,
        reward_ratio: '5.00',
      },
    ],
  })
  data: TierData[];
}
