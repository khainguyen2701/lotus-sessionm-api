import { BadRequestException, Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthSignInDTO, AuthSignUpDTO } from './dto/auth.dto';
import { MsAuthService } from './ms-auth.service';
import { RefreshTokenClassDto } from './dto/token.dto';
import { MessagePatternForMicro } from '@app/common/messagePattern/index.message';
@Controller()
export class MsAuthController {
  constructor(private readonly msAuthService: MsAuthService) {}

  @MessagePattern({ cms: 'auth.sign-in' })
  async signIn(
    body: AuthSignInDTO,
  ): Promise<{ access_token: string; refresh_token: string } | undefined> {
    const data = await this.msAuthService.signIn(body);
    return data;
  }

  @MessagePattern({ cmd: 'auth.sign-up' })
  async signUp(body: AuthSignUpDTO): Promise<{ id: string }> {
    const data = await this.msAuthService.signUp(body);
    return data;
  }

  @MessagePattern({ cmd: MessagePatternForMicro.AUTH.REFRESH_TOKEN })
  async refreshToken(
    body: RefreshTokenClassDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const { refresh_token } = body;
    if (!refresh_token) {
      throw new BadRequestException();
    }
    const data = await this.msAuthService.refreshToken(body);
    return data;
  }
}
