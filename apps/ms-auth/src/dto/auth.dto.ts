import { IsString, Length } from '@nestjs/class-validator';
export class AuthSignUpDTO {
  @IsString()
  @Length(3, 255)
  username: string;

  @IsString()
  @Length(3, 25)
  password: string;

  @IsString()
  @Length(3, 25)
  confirm_password: string;
}

export type AuthSignInDTO = Pick<AuthSignUpDTO, 'password' | 'username'>;
