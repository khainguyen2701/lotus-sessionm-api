import { IsNotEmpty } from 'class-validator';

export class UploadFileDto {
  @IsNotEmpty()
  file: string; // Change from Buffer to string (base64)

  @IsNotEmpty()
  fileName: string;

  @IsNotEmpty()
  folder: string;
}

export interface UploadFileResponse {
  success: boolean;
  message: string;
  data?: {
    name: string;
    path: string;
  };
}
