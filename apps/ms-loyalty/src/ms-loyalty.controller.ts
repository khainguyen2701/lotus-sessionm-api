import { Controller, Get } from '@nestjs/common';
import { MsLoyaltyService } from './ms-loyalty.service';

@Controller()
export class MsLoyaltyController {
  constructor(private readonly msLoyaltyService: MsLoyaltyService) {}

  @Get()
  getHello(): string {
    return this.msLoyaltyService.getHello();
  }
}
