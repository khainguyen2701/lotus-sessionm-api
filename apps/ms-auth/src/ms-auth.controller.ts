import { AuthMemberSignUpDTO } from '@app/common/dto/ms-auth/auth-member.dto';
import { MessagePatternForMicro } from '@app/common/messagePattern/index.message';
import { AccountsEntity, UsersEntity } from '@app/database';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MsAuthService } from './ms-auth.service';
@Controller()
export class MsAuthController {
  constructor(private readonly msAuthService: MsAuthService) {}

  // @MessagePattern({ cms: 'auth.sign-in' })
  // async signIn(
  //   body: AuthSignInDTO,
  // ): Promise<{ access_token: string; refresh_token: string } | undefined> {
  //   const data = await this.msAuthService.signIn(body);
  //   return data;
  // }

  @MessagePattern({ cmd: MessagePatternForMicro.AUTH.MEMBER_SIGNUP })
  async signUp(body: AuthMemberSignUpDTO): Promise<{
    user_id: string;
    account_id: string;
    access_token: string;
    user: Partial<UsersEntity>;
  }> {
    const data = await this.msAuthService.signUpMemberPortal(body);
    return data;
  }

  // @MessagePattern({ cmd: MessagePatternForMicro.AUTH.REFRESH_TOKEN })
  // async refreshToken(
  //   body: RefreshTokenClassDto,
  // ): Promise<{ access_token: string; refresh_token: string }> {
  //   const { refresh_token } = body;
  //   if (!refresh_token) {
  //     throw new BadRequestException();
  //   }
  //   const data = await this.msAuthService.refreshToken(body);
  //   return data;
  // }
}
