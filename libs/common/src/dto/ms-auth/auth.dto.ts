import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class AuthDto {
  @ApiProperty({ description: 'User active status' })
  isActive: boolean;
}

export class AuthSignUpDTO {
  @ApiProperty({
    description: 'Username for the account',
    example: 'john_doe',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Password for the account',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Confirm password',
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  confirm_password: string;
}

export class AuthSignInDTO {
  @ApiProperty({
    description: 'Username for login',
    example: 'john_doe',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Password for login',
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
