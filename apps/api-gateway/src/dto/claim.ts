import { IsEnum, IsOptional } from 'class-validator';

export enum EnumStatusClaimMilesList {
  processing = 'processing',
  processed = 'processed',
  rejected = 'rejected',
}
export enum EnumSortClaimMilesList {
  asc = 'asc',
  desc = 'desc',
}

export class ManualRequestStatus {
  @IsEnum(EnumStatusClaimMilesList)
  @IsOptional()
  status?: EnumStatusClaimMilesList;
}

export class SortManualRequest {
  @IsEnum(EnumSortClaimMilesList)
  @IsOptional()
  sort?: EnumSortClaimMilesList;
}
