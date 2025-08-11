import { Public } from '@app/common/decorators/public.decorator';
import {
  AuthMemberSignInDTO,
  AuthMemberSignUpDTO,
} from '@app/common/dto/ms-auth/auth-member.dto';
import { MessagePatternForMicro } from '@app/common/messagePattern/index.message';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  @Post('/member-portal/sign-in')
  signIn(@Body() body: AuthMemberSignInDTO) {
    return this.authClient.send(
      { cmd: MessagePatternForMicro.AUTH.MEMBER_SIGNIN },
      { ...body },
    );
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
  @Post('/member-portal/sign-up')
  signUp(@Body() body: AuthMemberSignUpDTO) {
    const data = this.authClient.send(
      { cmd: MessagePatternForMicro.AUTH.MEMBER_SIGNUP },
      { ...body },
    );
    return data;
  }

  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({ type: RefreshTokenClassDto })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  @Public()
  @Post('/refresh-token')
  refreshToken(@Body() body: RefreshTokenClassDto) {
    const data = this.authClient.send(
      { cmd: MessagePatternForMicro.AUTH.REFRESH_TOKEN },
      { ...body },
    );
    return data;
  }
}
