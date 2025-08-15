import {
  IsOptional,
  IsString,
  IsEnum,
  IsDateString,
  MaxLength,
  IsUUID,
  IsNotEmpty,
} from 'class-validator';

export class EditProfileDto {
  @IsNotEmpty()
  @IsUUID('4', { message: 'userId must be a valid UUID' })
  userId: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'First name must not exceed 100 characters' })
  first_name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Last name must not exceed 100 characters' })
  last_name?: string;

  @IsOptional()
  @IsEnum(['m', 'f'], { message: 'Gender must be either m or f' })
  gender?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Date of birth must be a valid date' })
  dob?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Address must not exceed 100 characters' })
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'City must not exceed 100 characters' })
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'State must not exceed 100 characters' })
  state?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Zip code must not exceed 100 characters' })
  zip?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Country must not exceed 100 characters' })
  country?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20, { message: 'Phone number must not exceed 20 characters' })
  phone_numbers?: string;
}

export class EditProfileRequestDto {
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'First name must not exceed 100 characters' })
  first_name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Last name must not exceed 100 characters' })
  last_name?: string;

  @IsOptional()
  @IsEnum(['m', 'f'], { message: 'Gender must be either m or f' })
  gender?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Date of birth must be a valid date' })
  dob?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Address must not exceed 100 characters' })
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'City must not exceed 100 characters' })
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'State must not exceed 100 characters' })
  state?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Zip code must not exceed 100 characters' })
  zip?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Country must not exceed 100 characters' })
  country?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20, { message: 'Phone number must not exceed 20 characters' })
  phone_numbers?: string;
}
