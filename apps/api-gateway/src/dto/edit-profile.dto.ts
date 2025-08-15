import {
  IsOptional,
  IsString,
  IsEnum,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditProfileDto {
  @ApiProperty({
    description: 'First name',
    example: 'John',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'First name must not exceed 100 characters' })
  first_name?: string;

  @ApiProperty({
    description: 'Last name',
    example: 'Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Last name must not exceed 100 characters' })
  last_name?: string;

  @ApiProperty({
    description: 'Gender (m: male, f: female)',
    example: 'm',
    enum: ['m', 'f'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['m', 'f'], { message: 'Gender must be either m or f' })
  gender?: string;

  @ApiProperty({
    description: 'Date of birth (YYYY-MM-DD)',
    example: '1990-01-01',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Date of birth must be a valid date' })
  dob?: string;

  @ApiProperty({
    description: 'Address',
    example: '123 Main St',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Address must not exceed 100 characters' })
  address?: string;

  @ApiProperty({
    description: 'City',
    example: 'New York',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'City must not exceed 100 characters' })
  city?: string;

  @ApiProperty({
    description: 'State',
    example: 'NY',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'State must not exceed 100 characters' })
  state?: string;

  @ApiProperty({
    description: 'Zip code',
    example: '10001',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Zip code must not exceed 100 characters' })
  zip?: string;

  @ApiProperty({
    description: 'Country',
    example: 'USA',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Country must not exceed 100 characters' })
  country?: string;

  @ApiProperty({
    description: 'Phone number',
    example: '+1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20, { message: 'Phone number must not exceed 20 characters' })
  phone_numbers?: string;
}

export class EditProfileResponseDto {
  @ApiProperty({
    description: 'Operation success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Profile updated successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Updated user data',
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      user_type: 'user',
      first_name: 'John',
      last_name: 'Doe',
      gender: 'm',
      dob: '1990-01-01',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'USA',
      phone_numbers: '+1234567890',
      user_email: 'john.doe@example.com',
      user_number: 'USR12345',
      created_at: '2023-01-01T00:00:00.000Z',
      updated_at: '2023-01-02T00:00:00.000Z',
      tier: {
        id: 'a8285f70-01fc-4254-9aba-0f7c56582cd9',
        tier_name: 'silver',
        tier_description:
          'Hội viên hạng Bạc được hưởng giá ưu đãi khi mua trước chỗ ngồi và ưu tiên xác nhận chỗ khi Vietnam Airlines thay đổi chuyến bay. Tìm hiểu thêm quyền lợi dành cho hội viên hạng Bạc.',
        min_points: 0,
        max_points: 2000,
        priority: 5,
        benefit: [
          'Ưu tiên xác nhận chỗ trong trường hợp Vietnam Airlines thay đổi chuyến bay',
        ],
      },
      points: {
        id: 'bba989cc-9ae3-4800-9314-6569e1064c39',
        total_points: 0,
        used_points: 0,
        balance_points: 0,
        available_points: 0,
        updated_at: '2025-08-15T01:15:57.933Z',
        created_at: '2025-08-15T01:15:57.933Z',
      },
    },
  })
  data?: Record<string, any>;
}
