/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { GitHubService } from '@app/common';
import { UploadFileDto, UploadFileResponse } from './dto/upload-file.dto';
import { UserRepository } from './repositories/user.repository';
import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    private userRepo: UserRepository,
    private readonly githubService: GitHubService,
    private readonly configService: ConfigService,
  ) {}
  async memberProfile(userId: string) {
    if (!userId) {
      throw new BadRequestException('Invalid or missing userId');
    }
    // Logic xử lý profile
    return await this.userRepo.findUserByIdAndType(userId, 'user');
  }

  async adminProfile(userId: string) {
    if (!userId) {
      throw new BadRequestException('Invalid or missing userId');
    }
    // check user type
    const user = await this.userRepo.findUserByIdAndType(userId, 'admin');
    if (!user) {
      throw new BadRequestException('Admin not found');
    }
    // Logic xử lý profile
    return user;
  }

  async uploadFile(data: UploadFileDto): Promise<UploadFileResponse> {
    try {
      // Convert base64 string back to Buffer
      const fileBuffer = Buffer.from(data.file, 'base64');

      // Validate file size (max 25MB for GitHub)
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (fileBuffer.length > maxSize) {
        throw new Error('File size exceeds 5MB limit');
      }

      // Create folder path with user structure
      const folderPath = `${data.folder || 'assets'}/${data.fileName}`;

      // Upload file to GitHub
      const result = await this.githubService.uploadFileToGitHub(
        fileBuffer, // Use converted Buffer
        data.fileName,
        folderPath,
      );

      return {
        success: true,
        message: 'File uploaded successfully',
        data: {
          name: result.name,
          path: `${this.configService.get('assets.url')}/${result.name}`,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: error?.message || 'Failed to upload file',
      };
    }
  }
}
