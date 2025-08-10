import { Public } from '@app/common/decorators/public.decorator';
import { AuthSignInDTO, AuthSignUpDTO } from '@app/common/dto/ms-auth/auth.dto';
import { MessagePatternForMicro } from '@app/common/messagePattern/index.message';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RefreshTokenClassDto } from 'apps/ms-auth/src/dto/token.dto';

@ApiTags('Authentication')
@Controller('ms-auth')
export class AuthController {
  constructor(@Inject('AUTH_SERVICE') private authClient: ClientProxy) {}

  @ApiOperation({ summary: 'User sign in' })
  @ApiBody({ type: AuthSignInDTO })
  @ApiResponse({ status: 200, description: 'Sign in successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @Public()
  @Post('/sign-in')
  signIn(@Body() body: AuthSignInDTO) {
    return this.authClient.send(
      { cmd: MessagePatternForMicro.AUTH.SIGNIN },
      { ...body },
    );
  }

  @ApiOperation({ summary: 'User sign up' })
  @ApiBody({ type: AuthSignUpDTO })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Public()
  @Post('/sign-up')
  signUp(@Body() body: AuthSignUpDTO) {
    const data = this.authClient.send(
      { cmd: MessagePatternForMicro.AUTH.SIGNUP },
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
