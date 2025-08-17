import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateManualRequestDTO {
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
    description: 'Seat code',
    default: 'A1',
  })
  @IsNotEmpty()
  @IsString()
  seat_code: string;

  @ApiProperty({
    description: 'Amount - this is optional field',
    default: 100,
  })
  @IsOptional()
  @IsNumber()
  amount: number;
}
