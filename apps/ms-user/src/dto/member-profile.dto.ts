import { IsUUID, IsNotEmpty } from 'class-validator';

export class MemberProfileDto {
  @IsNotEmpty()
  @IsUUID('4', { message: 'userId must be a valid UUID' })
  userId: string;
}
