export interface AuthDto {
  isActive: boolean;
}

export interface AuthSignUpDTO {
  username: string;
  password: string;
  confirm_password;
}

export type AuthSignInDTO = Pick<AuthSignUpDTO, 'password' | 'username'>;
