import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class BodyCreateTierDTO {
  @ApiProperty({
    description: 'Tier name',
    example: 'gold',
    enum: ['silver', 'bronze', 'gold'],
  })
  @IsNotEmpty()
  @IsString()
  tier_name: string;

  @ApiProperty({
    description: 'Tier description',
    example: 'Gold tier with premium benefits',
  })
  @IsNotEmpty()
  @IsString()
  tier_description: string;

  @ApiProperty({
    description: 'Tier benefits',
    example: ['Priority boarding', 'Extra baggage allowance', 'Lounge access'],
    type: [String],
  })
  @IsNotEmpty()
  @IsString({ each: true })
  benefit: string[];

  @ApiProperty({
    description: 'Minimum points required for this tier',
    example: 5000,
  })
  @IsNumber()
  min_points: number;

  @ApiProperty({
    description: 'Maximum points for this tier',
    example: 10000,
  })
  @IsNumber()
  max_points: number;

  @ApiProperty({
    description: 'Tier priority (lower number means higher priority)',
    example: 2,
  })
  @IsNumber()
  priority: number;

  @ApiProperty({
    description: 'Points reward for this tier',
    example: 1000,
  })
  @IsNumber()
  points_reward: number;

  @ApiProperty({
    description: 'Reward ratio for this tier',
    example: 10.0,
  })
  @IsNumber()
  reward_ratio: number;

  @ApiProperty({
    description: 'Maintain points for this tier',
    example: 1000,
  })
  @IsNumber()
  maintain_points: number;
}
