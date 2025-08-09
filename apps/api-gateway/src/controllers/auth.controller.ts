import { Public } from '@app/common/decorators/public.decorator';
import { AuthSignInDTO, AuthSignUpDTO } from '@app/common/dto/ms-auth/auth.dto';
import { MessagePatternForMicro } from '@app/common/messagePattern/index.message';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RefreshTokenClassDto } from 'apps/ms-auth/src/dto/token.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(@Inject('AUTH_SERVICE') private authClient: ClientProxy) {}

  @Public()
  @Post('/sign-in')
  signIn(@Body() body: AuthSignInDTO) {
    return this.authClient.send(
      { cms: MessagePatternForMicro.AUTH.SIGNIN },
      { ...body },
    );
  }

  @Public()
  @Post('/sign-up')
  signUp(@Body() body: AuthSignUpDTO) {
    const data = this.authClient.send(
      { cmd: MessagePatternForMicro.AUTH.SIGNUP },
      { ...body },
    );
    return data;
  }

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
