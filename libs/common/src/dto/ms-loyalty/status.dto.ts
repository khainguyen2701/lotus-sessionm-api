import { IsEnum, IsNotEmpty } from 'class-validator';

enum Status {
  processed = 'processed',
  rejected = 'rejected',
}
export class ChangeStatusManualRequestDto {
  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;
}
