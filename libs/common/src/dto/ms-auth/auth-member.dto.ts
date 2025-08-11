import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

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
