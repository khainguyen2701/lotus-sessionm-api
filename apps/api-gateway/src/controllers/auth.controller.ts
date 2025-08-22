import { Public } from '@app/common/decorators/public.decorator';
import {
  AuthAdminSignUpDTO,
  AuthMemberSignInDTO,
  AuthMemberSignUpDTO,
} from '@app/common/dto/ms-auth/auth-member.dto';
import { MessagePatternForMicro } from '@app/common/messagePattern/index.message';
import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { RefreshTokenClassDto } from 'apps/ms-auth/src/dto/token.dto';
import {
  AuthMemberSignInSchemaError,
  AuthMemberSignInSchemaSuccess,
  AuthMemberSignUpSchemaCreated,
  AuthMemberSignUpSchemaError,
} from '../schema/auth.schema';

@ApiTags('Authentication')
@Controller('ms-auth')
export class AuthController {
  constructor(@Inject('AUTH_SERVICE') private authClient: ClientProxy) {}

  // Member Portal Sign In
  @ApiOperation({ summary: 'Member portal sign in' })
  @ApiBody({ type: AuthMemberSignInDTO })
  @ApiResponse({
    status: 200,
    description: 'Member portal sign in successful',
    schema: AuthMemberSignInSchemaSuccess,
  })
  @ApiResponse({
    status: 500,
    description: 'Member portal invalid credentials',
    schema: AuthMemberSignInSchemaError,
  })
  @Public()
  @Throttle({ default: { limit: 5, ttl: 300000 } }) // 5 attempts per 5 minutes per IP
  @Post('/member-portal/sign-in')
  signInMemberPortal(@Body() body: AuthMemberSignInDTO) {
    try {
      return this.authClient.send(
        { cmd: MessagePatternForMicro.AUTH.MEMBER_SIGNIN },
        { ...body },
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // Member portal sign up
  @ApiOperation({ summary: 'Member portal sign up' })
  @ApiBody({ type: AuthMemberSignUpDTO })
  @ApiResponse({
    status: 201,
    description: 'Member portal created successfully',
    schema: AuthMemberSignUpSchemaCreated,
  })
  @ApiResponse({
    status: 500,
    description: 'Bad request',
    schema: AuthMemberSignUpSchemaError,
  })
  @Public()
  @Throttle({ default: { limit: 50, ttl: 3600000 } }) // 3 registrations per hour per IP
  @Post('/member-portal/sign-up')
  signUpMemberPortal(@Body() body: AuthMemberSignUpDTO) {
    const data = this.authClient.send(
      { cmd: MessagePatternForMicro.AUTH.MEMBER_SIGNUP },
      { ...body },
    );
    return data;
  }

  //ADMIN PORTAL
  //Sign up admin portal
  @ApiOperation({ summary: 'Admin portal sign up' })
  @ApiBody({ type: AuthAdminSignUpDTO })
  @ApiResponse({
    status: 201,
    description: 'Admin portal created successfully',
    schema: AuthMemberSignInSchemaSuccess,
  })
  @ApiResponse({
    status: 500,
    description: 'Bad request',
    schema: AuthMemberSignInSchemaError,
  })
  @Public()
  @Throttle({ default: { limit: 5, ttl: 3600000 } }) // 2 admin registrations per hour per IP
  @Post('/admin-portal/sign-up')
  signUpAdminPortal(@Body() body: AuthAdminSignUpDTO) {
    const data = this.authClient.send(
      { cmd: MessagePatternForMicro.AUTH.ADMIN_SIGNUP },
      { ...body },
    );
    return data;
  }

  //Sign in admin portal
  @ApiOperation({ summary: 'Admin portal sign in' })
  @ApiBody({ type: AuthMemberSignInDTO })
  @ApiResponse({
    status: 200,
    description: 'Admin portal sign in successful',
    schema: AuthMemberSignInSchemaSuccess,
  })
  @ApiResponse({
    status: 500,
    description: 'Bad request',
    schema: AuthMemberSignInSchemaError,
  })
  @Public()
  @Throttle({ default: { limit: 50, ttl: 300000 } }) // 5 attempts per 5 minutes per IP
  @Post('/admin-portal/sign-in')
  signInAdminPortal(@Body() body: AuthMemberSignInDTO) {
    const data = this.authClient.send(
      { cmd: MessagePatternForMicro.AUTH.ADMIN_SIGNIN },
      { ...body },
    );
    return data;
  }

  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({ type: RefreshTokenClassDto })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  @Public()
  @Throttle({ default: { limit: 10, ttl: 600000 } }) // 10 refresh attempts per 10 minutes per IP
  @Post('/refresh-token')
  refreshToken(@Body() body: RefreshTokenClassDto) {
    const data = this.authClient.send(
      { cmd: MessagePatternForMicro.AUTH.REFRESH_TOKEN },
      { ...body },
    );
    return data;
  }
}
