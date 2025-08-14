import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FileUploadDto {
  @ApiProperty({
    description: 'Folder to upload file to',
    example: 'assets',
    required: false,
  })
  @IsOptional()
  @IsString()
  folder?: string = 'assets';
}

export class FileUploadResponseDto {
  @ApiProperty({
    description: 'Upload success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Upload message',
    example: 'File uploaded successfully',
  })
  message: string;

  @ApiProperty({
    description: 'File information',
    required: false,
    example: {
      name: 'file.jpg',
      path: 'assets/file.jpg',
    },
  })
  data?: {
    name: string;
    path: string;
  };
}
