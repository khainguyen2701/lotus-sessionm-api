import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class CreateManualRequestDTO {
  @ApiProperty({
    description: 'User ID who creates the request',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiProperty({
    description: 'Request type',
    enum: ['flight', 'purchase', 'other'],
    default: 'flight',
  })
  @IsNotEmpty()
  @IsString()
  request_type: 'flight' | 'purchase' | 'other';

  @ApiProperty({
    description: 'Request description',
    default: 'Manual request',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Ticket number',
    default: '123456',
  })
  @IsNotEmpty()
  @IsString()
  ticket_number: string;

  @ApiProperty({
    description: 'File URL',
    default: 'https://example.com/file.pdf',
  })
  @IsNotEmpty()
  @IsString()
  file_url: string;

  @ApiProperty({
    description:
      'Seat code - required for flight requests, optional for others',
    default: 'A1',
    required: false,
  })
  @ValidateIf((o) => o.request_type === 'flight')
  @IsNotEmpty({ message: 'Seat code is required for flight requests' })
  @IsOptional()
  @IsString()
  seat_code?: string;

  @ApiProperty({
    description: 'Amount - this is optional field',
    default: 100,
  })
  @IsOptional()
  @IsNumber()
  amount: number;
}
