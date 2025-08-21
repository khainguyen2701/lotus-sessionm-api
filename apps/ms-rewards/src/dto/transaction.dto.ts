import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class GetMemberTransactionsDTO {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Page number (starts from 1)',
    example: 1,
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }) => {
    // Handle undefined, null, or empty string by returning default value
    if (value === undefined || value === null || value === '') {
      return 1;
    }
    const num = Number(value);
    return isNaN(num) ? 1 : num;
  })
  @IsNumber({}, { message: 'Page must be a number' })
  @Min(1, { message: 'Page must be at least 1' })
  page: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }) => {
    // Handle undefined, null, or empty string by returning default value
    if (value === undefined || value === null || value === '') {
      return 10;
    }
    const num = Number(value);
    return isNaN(num) ? 10 : num;
  })
  @IsNumber({}, { message: 'Size must be a number' })
  @Min(1, { message: 'Size must be at least 1' })
  size: number = 10;
}
