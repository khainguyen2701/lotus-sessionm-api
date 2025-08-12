import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsDateString,
  IsPhoneNumber,
} from 'class-validator';

export class AuthMemberDto {
  @ApiProperty({ description: 'Member active status' })
  isActive: boolean;
}

export class AuthMemberSignUpDTO {
  @ApiProperty({
    description: 'email for the member account',
    example: 'john_doe@example.com',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Password for the member account',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Confirm password for the member account',
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  confirm_password: string;

  @ApiProperty({
    description: 'First name for login',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({
    description: 'Last name for login',
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({
    description: 'Gender for login',
    example: 'male',
    enum: ['m', 'f'],
  })
  @IsString()
  @IsNotEmpty()
  gender: string;

  @ApiProperty({
    description: 'Date of birth for login',
    example: '1990-01-01',
  })
  @IsString()
  @IsNotEmpty()
  @IsDateString()
  dob: string;

  @ApiProperty({
    description: 'Address for login',
    example: '123 Main St',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'City for login',
    example: 'New York',
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    description: 'State for login',
    example: 'NY',
  })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({
    description: 'Zip code for login',
    example: '10001',
  })
  @IsString()
  @IsNotEmpty()
  zip: string;

  @ApiProperty({
    description: 'Country for login',
    example: 'USA',
  })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({
    description: 'Phone number for login',
    example: '0866666666',
  })
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('VN')
  phone_numbers: string;
}

export class AuthMemberSignInDTO {
  @ApiProperty({
    description: 'Email for login',
    example: 'john_doe@example.com',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Password for login',
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class AuthAdminSignUpDTO {
  @ApiProperty({
    description: 'Email for admin login',
    example: 'john_doe@example.com',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Password for admin login',
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Confirm password for admin login',
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  confirm_password: string;
}
