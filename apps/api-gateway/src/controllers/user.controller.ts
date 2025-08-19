/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { RoleBaseAccessControl } from '@app/common/constant/index.constant';
import {
  PagingConfig,
  PagingDecorator,
} from '@app/common/decorators/paging.decorators';
import { Roles } from '@app/common/decorators/role.decorator';
import { UserIdDecorator } from '@app/common/decorators/userId.decorators';
import { MessagePatternForMicro } from '@app/common/messagePattern/index.message';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiHeader,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { EnumSortClaimMilesList } from '../dto/claim';
import {
  EditProfileDto,
  EditProfileResponseDto,
} from '../dto/edit-profile.dto';
import { FileUploadDto, FileUploadResponseDto } from '../dto/file-upload.dto';
import {
  AdminGetListUserSchema,
  UserGetProfileSchemaError,
  UserGetProfileSchemaSuccess,
} from '../schema/user.schema';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@Controller('ms-users')
export class UsersController {
  constructor(@Inject('USER_SERVICE') private userClient: ClientProxy) {}

  // Get member profile
  @ApiOperation({ summary: 'Get member portal profile' })
  @ApiResponse({
    status: 200,
    description: 'Member portal profile success',
    schema: UserGetProfileSchemaSuccess as any,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
    schema: UserGetProfileSchemaError,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
    schema: UserGetProfileSchemaError,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: UserGetProfileSchemaError,
  })
  @ApiHeader({
    name: 'x-user-id',
    description: 'User ID (UUID format)',
    required: true,
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
    required: true,
  })
  @Get('/member/profile')
  @Roles(RoleBaseAccessControl.User)
  memberProfile(@UserIdDecorator() userId: string) {
    return this.userClient.send(
      {
        cmd: MessagePatternForMicro.USER.MEMBER_PROFILE,
      },
      { userId },
    );
  }

  // Get admin profile
  @ApiOperation({ summary: 'Get admin portal profile' })
  @ApiResponse({
    status: 200,
    description: 'Admin portal profile success',
    schema: UserGetProfileSchemaSuccess as any,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
    schema: UserGetProfileSchemaError,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
    schema: UserGetProfileSchemaError,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: UserGetProfileSchemaError,
  })
  @ApiHeader({
    name: 'x-user-id',
    description: 'User ID (UUID format)',
    required: true,
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
    required: true,
  })
  @Get('/admin/profile')
  @Roles(RoleBaseAccessControl.Admin)
  adminProfile(@UserIdDecorator() userId: string) {
    return this.userClient.send(
      {
        cmd: MessagePatternForMicro.USER.ADMIN_PROFILE,
      },
      { userId },
    );
  }

  // Edit member profile
  @ApiOperation({ summary: 'Edit member portal profile' })
  @ApiResponse({
    status: 200,
    description: 'Member profile updated successfully',
    type: EditProfileResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiHeader({
    name: 'x-user-id',
    description: 'User ID (UUID format)',
    required: true,
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
    required: true,
  })
  @Put('/member/profile')
  @Roles(RoleBaseAccessControl.User)
  editMemberProfile(
    @UserIdDecorator() userId: string,
    @Body() body: EditProfileDto,
  ) {
    return this.userClient.send(
      {
        cmd: MessagePatternForMicro.USER.EDIT_PROFILE,
      },
      { userId, ...body },
    );
  }

  // Edit admin profile
  @ApiOperation({ summary: 'Edit admin portal profile' })
  @ApiResponse({
    status: 200,
    description: 'Admin profile updated successfully',
    type: EditProfileResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiHeader({
    name: 'x-user-id',
    description: 'User ID (UUID format)',
    required: true,
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
    required: true,
  })
  @Put('/admin/profile')
  @Roles(RoleBaseAccessControl.Admin)
  editAdminProfile(
    @UserIdDecorator() userId: string,
    @Body() body: EditProfileDto,
  ) {
    return this.userClient.send(
      {
        cmd: MessagePatternForMicro.USER.EDIT_PROFILE,
      },
      { userId, ...body },
    );
  }

  // Upload file
  @ApiOperation({ summary: 'Upload file (PDF, DOC, DOCX, Images)' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 200,
    description: 'File uploaded successfully',
    type: FileUploadResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid file type or missing file',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  @ApiHeader({
    name: 'x-user-id',
    description: 'User ID (UUID format)',
    required: true,
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
    required: true,
  })
  @Post('/upload-file')
  @Roles(RoleBaseAccessControl.User)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
      fileFilter: (req, file, callback) => {
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
        const fileExtension = file.originalname
          .toLowerCase()
          .substring(file.originalname.lastIndexOf('.'));

        if (!allowedTypes.includes(fileExtension)) {
          return callback(
            new Error(
              'Only PDF, DOC, DOCX, and image files (JPG, JPEG, PNG, GIF, BMP, WEBP) are allowed',
            ),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  uploadFile(
    @UserIdDecorator() userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: FileUploadDto,
  ): any {
    // Validate file exists
    if (!file) {
      throw new BadRequestException('File is required');
    }

    // File type và size validation đã được xử lý bởi multer
    const response = this.userClient.send(
      {
        cmd: MessagePatternForMicro.USER.UPLOAD_FILE,
      },
      {
        file: file?.buffer,
        fileName: file?.originalname,
        folder: body.folder || 'assets',
      },
    );
    return response;
  }

  @ApiOperation({ summary: 'Get all user with role admin' })
  @ApiQuery({
    name: 'sort',
    enum: EnumSortClaimMilesList,
    required: false,
    description: 'Sort by uploaded_at',
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'size',
    type: Number,
    required: false,
    description: 'Page size',
  })
  @ApiResponse({
    status: 200,
    description: 'Get list user successfully',
    schema: AdminGetListUserSchema,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data',
  })
  @Get('/admin/users')
  @Roles(RoleBaseAccessControl.Admin)
  adminGetListMember(
    @Query('sort') sort?: EnumSortClaimMilesList,
    @PagingDecorator() pagination?: PagingConfig,
  ) {
    const payload = {
      page: pagination?.page ?? 1,
      size: pagination?.size ?? 10,
      ...(sort && { sort }),
    };
    return this.userClient.send(
      { cmd: MessagePatternForMicro.USER.ADMIN_GET_LIST_MEMBER },
      payload,
    );
  }
}
