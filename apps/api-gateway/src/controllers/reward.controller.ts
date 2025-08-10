import { Public } from '@app/common/decorators/public.decorator';
import { AuthSignInDTO } from '@app/common/dto/ms-auth/auth.dto';
import { MessagePatternForMicro } from '@app/common/messagePattern/index.message';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('ms-reward')
export class RewardController {
  constructor(@Inject('REWARDS_SERVICE') private rewardsClient: ClientProxy) {}

  @Public()
  @Post('/create')
  create(@Body() body: AuthSignInDTO) {
    return this.rewardsClient.send(
      { cms: MessagePatternForMicro.REWARDS.CREATE },
      { ...body },
    );
  }
}
