/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';

// Interface cho response từ GitHub API
export interface GitHubUploadResponse {
  download_url: string;
  html_url: string;
  name: string;
  path: string;
}

// Interface cho GitHub API response
interface GitHubApiResponse {
  content: {
    download_url: string;
    html_url: string;
    name: string;
    path: string;
  };
}

@Injectable()
export class GitHubService {
  private readonly logger = new Logger(GitHubService.name);
  private readonly githubToken: string;
  private readonly githubOwner: string;
  private readonly githubRepo: string;
  private readonly baseUrl = 'https://api.github.com';

  constructor(private readonly configService: ConfigService) {
    this.githubToken = this.configService.get<string>('github.token') || '';
    this.githubOwner =
      this.configService.get<string>('github.owner') || 'khainguyen2701';
    this.githubRepo =
      this.configService.get<string>('github.repo') || 'ms-assets';

    if (!this.githubToken) {
      this.logger.warn(
        'GitHub token is missing. Please set GITHUB_TOKEN environment variable.',
      );
    }
  }

  /**
   * Upload file to GitHub repository
   * @param file - File buffer to upload
   * @param fileName - Name of the file
   * @param folder - Optional folder path (default: 'assets')
   * @returns Promise<GitHubUploadResponse>
   */
  async uploadFileToGitHub(
    file: Buffer,
    fileName: string,
    folder: string = 'assets',
  ): Promise<GitHubUploadResponse> {
    try {
      this.validateConfiguration();
      this.validateInput(file, fileName);

      // Tạo path cho file trong assets folder

      // Encode file thành base64
      const base64Content = file.toString('base64');
      // Remove this debug line:
      // console.log('base64Content', base64Content);

      // Tạo commit message
      const commitMessage = `Upload ${fileName} via API`;

      this.logger.log(
        `Processing file: ${folder} to ${this.githubOwner}/${this.githubRepo}`,
      );

      // Kiểm tra xem file đã tồn tại chưa
      const url = `${this.baseUrl}/repos/${this.githubOwner}/${this.githubRepo}/contents/${folder}`;
      let existingFileSha: string | null = null;
      let isUpdate = false;

      try {
        const existingFileResponse = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${this.githubToken}`,
            Accept: 'application/vnd.github.v3+json',
          },
        });

        if (existingFileResponse?.data && existingFileResponse?.data.sha) {
          existingFileSha = existingFileResponse?.data.sha;
          isUpdate = true;
          this.logger.log(`File exists, will update: ${folder}`);
        }
      } catch (checkError) {
        if (checkError?.response?.status === 404) {
          this.logger.log(`File does not exist, will create new: ${folder}`);
        } else {
          throw checkError;
        }
      }

      // Tạo payload cho API request
      const payload: any = {
        message: isUpdate ? `Update ${fileName} via API` : commitMessage,
        content: base64Content,
      };

      // Nếu file đã tồn tại, thêm SHA để update
      if (isUpdate && existingFileSha) {
        payload.sha = existingFileSha;
      }

      // Gọi GitHub API để upload/update file
      const response: AxiosResponse<GitHubApiResponse> = await axios.put(
        url,
        payload,
        {
          headers: {
            Authorization: `Bearer ${this.githubToken}`,
            'Content-Type': 'application/json',
            Accept: 'application/vnd.github.v3+json',
          },
        },
      );

      this.logger.log(
        `File ${isUpdate ? 'updated' : 'created'} successfully: ${folder}`,
      );

      return {
        download_url: response.data.content.download_url,
        html_url: response.data.content.html_url,
        name: response.data.content.name,
        path: response.data.content.path,
      };
    } catch (error) {
      this.logger.error(`Failed to upload file ${fileName}:`, error.message);

      if (error?.response) {
        const status = error?.response?.status;
        const message = error?.response?.data?.message || 'Unknown error';

        switch (status) {
          case 401:
            throw new Error(
              'GitHub authentication failed. Please check your token.',
            );
          case 403:
            throw new Error(
              'GitHub API rate limit exceeded or insufficient permissions.',
            );
          case 404:
            throw new Error(
              'GitHub repository not found. Please check owner and repo name.',
            );
          case 422:
            // Cải thiện xử lý lỗi 422
            if (message.includes('sha')) {
              throw new Error(
                `File update failed - SHA mismatch. The file may have been modified by another process: ${message}`,
              );
            } else if (message.includes('content')) {
              throw new Error(
                `Invalid file content or encoding error: ${message}`,
              );
            } else {
              throw new Error(
                `GitHub validation error (422): ${message}. This usually means the file already exists or there's a content issue.`,
              );
            }
          default:
            throw new Error(`GitHub API error (${status}): ${message}`);
        }
      }

      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  /**
   * Validate GitHub configuration
   */
  private validateConfiguration(): void {
    if (!this.githubToken) {
      throw new Error('GitHub token is not configured');
    }
    if (!this.githubOwner) {
      throw new Error('GitHub owner is not configured');
    }
    if (!this.githubRepo) {
      throw new Error('GitHub repository is not configured');
    }
  }

  /**
   * Validate input parameters
   */
  private validateInput(file: Buffer, fileName: string): void {
    if (!file || file.length === 0) {
      throw new Error('File buffer is required and cannot be empty');
    }

    if (!fileName || fileName.trim() === '') {
      throw new Error('File name is required');
    }

    // Kiểm tra tên file có ký tự không hợp lệ
    const invalidChars = /[<>:"|?*\\]/;
    if (invalidChars.test(fileName)) {
      throw new Error('File name contains invalid characters');
    }

    // Kiểm tra kích thước file (GitHub có giới hạn 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.length > maxSize) {
      throw new Error('File size exceeds GitHub limit (5MB)');
    }
  }
}
