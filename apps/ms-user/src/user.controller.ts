/* eslint-disable @typescript-eslint/no-unsafe-return */
import { MessagePatternForMicro } from '@app/common/messagePattern/index.message';
import { BadRequestException, Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MemberProfileDto } from './dto/member-profile.dto';
import { UploadFileDto, UploadFileResponse } from './dto/upload-file.dto';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  // get member profile
  @MessagePattern({ cmd: MessagePatternForMicro.USER.MEMBER_PROFILE })
  async memberProfile(data: MemberProfileDto) {
    try {
      return await this.userService.memberProfile(data.userId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // get admin profile
  @MessagePattern({ cmd: MessagePatternForMicro.USER.ADMIN_PROFILE })
  async adminProfile(data: MemberProfileDto) {
    try {
      return await this.userService.adminProfile(data.userId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // upload file to GitHub
  @MessagePattern({ cmd: MessagePatternForMicro.USER.UPLOAD_FILE })
  async uploadFile(
    data: UploadFileDto,
  ): Promise<Pick<UploadFileResponse, 'data'>> {
    try {
      const fileExtension = data.fileName
        .toLowerCase()
        .substring(data.fileName.lastIndexOf('.'));

      const allowedTypes = [
        '.pdf',
        '.doc',
        '.docx',
        '.jpg',
        '.jpeg',
        '.png',
        '.gif',
        '.bmp',
        '.webp',
      ];

      if (!allowedTypes?.includes(fileExtension)) {
        throw new BadRequestException(
          'Only PDF, DOC, DOCX, and image files (JPG, JPEG, PNG, GIF, BMP, WEBP) are allowed',
        );
      }

      const response = await this.userService.uploadFile(data);
      return response;
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }
}
