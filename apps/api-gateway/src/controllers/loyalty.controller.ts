import { Public } from '@app/common/decorators/public.decorator';
import { AuthSignInDTO } from '@app/common/dto/ms-auth/auth.dto';
import { MessagePatternForMicro } from '@app/common/messagePattern/index.message';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('api/v1/loyalty')
export class LoyaltyController {
  constructor(@Inject('LOYALTY_SERVICE') private loyaltyClient: ClientProxy) {}

  @Public()
  @Post('/sign-in')
  signIn(@Body() body: AuthSignInDTO) {
    return this.loyaltyClient.send(
      { cms: MessagePatternForMicro.LOYALTY.CREATE },
      { ...body },
    );
  }
}
