/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { GitHubService } from '@app/common';
import {
  UsersOverviewQueryDto,
  UsersTimeseriesQueryDto,
} from '@app/common/dto/ms-user/admin.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnumSortClaimMilesList } from 'apps/api-gateway/src/dto/claim';
import { EditProfileDto } from './dto/edit-profile.dto';
import { UploadFileDto, UploadFileResponse } from './dto/upload-file.dto';
import { TierRepository } from './repositories/tier.repository';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UserService {
  constructor(
    private userRepo: UserRepository,
    private tierRepo: TierRepository,
    private readonly githubService: GitHubService,
    private readonly configService: ConfigService,
  ) {}
  async memberProfile(userId: string) {
    if (!userId) {
      throw new BadRequestException('Invalid or missing userId');
    }
    // Logic xử lý profile
    const user = await this.userRepo.findUserByIdAndType(userId, 'user');
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Kiểm tra và cập nhật tier dựa trên balance_points
    if (user.points && user.points.balance_points !== undefined) {
      const balancePoints = user.points.balance_points;

      // Tìm tier phù hợp với số điểm hiện tại
      const appropriateTier =
        await this.tierRepo.findTierByPointsRange(balancePoints);

      // Nếu tìm thấy tier phù hợp và khác với tier hiện tại
      if (
        appropriateTier &&
        (!user.tier || user.tier.id !== appropriateTier.id)
      ) {
        // Cập nhật tier mới cho user
        const updatedUser = await this.userRepo.updateUserTier(
          userId,
          appropriateTier.id,
        );
        return updatedUser;
      }
    }

    return user;
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

  async editProfile(data: EditProfileDto) {
    if (!data.userId) {
      throw new BadRequestException('Invalid or missing userId');
    }

    // Find user by ID
    const user = await this.userRepo.findUserById(data.userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Update user profile fields
    const updateData: Partial<typeof user> = {};

    if (data.first_name !== undefined) updateData.first_name = data.first_name;
    if (data.last_name !== undefined) updateData.last_name = data.last_name;
    if (data.gender !== undefined) updateData.gender = data.gender;
    if (data.dob !== undefined) updateData.dob = new Date(data.dob);
    if (data.address !== undefined) updateData.address = data.address;
    if (data.city !== undefined) updateData.city = data.city;
    if (data.state !== undefined) updateData.state = data.state;
    if (data.zip !== undefined) updateData.zip = data.zip;
    if (data.country !== undefined) updateData.country = data.country;
    if (data.phone_numbers !== undefined)
      updateData.phone_numbers = data.phone_numbers;

    if (data.district !== undefined) updateData.district = data.district;
    if (data.ward !== undefined) updateData.ward = data.ward;

    // Update user profile
    const updatedUser = await this.userRepo.updateUserProfile(
      data.userId,
      updateData,
    );

    return updatedUser;
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

  async adminGetListMember(query: {
    page: number;
    size: number;
    sort?: EnumSortClaimMilesList;
    search?: string;
  }): Promise<any> {
    return await this.userRepo.adminGetListMember(query);
  }

  // Admin endpoints
  async getUsersOverview(query: UsersOverviewQueryDto) {
    return await this.userRepo.getUsersOverview(query);
  }

  async getUsersTimeseries(query: UsersTimeseriesQueryDto) {
    return await this.userRepo.getUsersTimeseries(query);
  }

  async adminGetDetailUser(data: { id: string; adminId: string }) {
    return await this.userRepo.adminGetDetailUser(data);
  }

  async adminUpdateUser(data: { id: string; adminId: string; status: string }) {
    return await this.userRepo.adminUpdateUser(data);
  }
}
