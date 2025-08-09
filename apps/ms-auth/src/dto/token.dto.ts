import { IsString } from 'class-validator';

export class RefreshTokenClassDto {
  @IsString()
  refresh_token: string;
}
