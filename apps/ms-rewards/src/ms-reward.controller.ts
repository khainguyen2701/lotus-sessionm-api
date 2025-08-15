import { MessagePatternForMicro } from '@app/common/messagePattern/index.message';
import { Body, Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { BodyCreateTierDTO } from './dto/tier.dto';
import { MsRewardService } from './ms-reward.service';

@Controller()
export class MsRewardController {
  constructor(private readonly msRewardService: MsRewardService) {}

  @MessagePattern({ cmd: MessagePatternForMicro.REWARDS.CREATE_TIER })
  async createTier(@Body() body: BodyCreateTierDTO): Promise<any> {
    return await this.msRewardService.createTier(body);
  }
}
