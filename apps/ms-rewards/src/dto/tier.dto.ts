import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class BodyCreateTierDTO {
  @ApiProperty({
    description: 'Tier name',
    example: 'gold',
    enum: ['silver', 'titan', 'gold', 'platinum', 'million-miles'],
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
}
