import { Controller, Get } from '@nestjs/common';
import { MsRewardService } from './ms-reward.service';

@Controller()
export class MsRewardController {
  constructor(private readonly msRewardService: MsRewardService) {}

  @Get()
  getHello(): string {
    return this.msRewardService.getHello();
  }
}
