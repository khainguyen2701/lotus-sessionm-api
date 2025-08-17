import { CreateManualRequestDTO } from '@app/common/dto/ms-loyalty/manual-request.dto';
import { MessagePatternForMicro } from '@app/common/messagePattern/index.message';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MsLoyaltyService } from './ms-loyalty.service';

@Controller()
export class MsLoyaltyController {
  constructor(private readonly msLoyaltyService: MsLoyaltyService) {}

  @MessagePattern({ cmd: MessagePatternForMicro.LOYALTY.CREATE_MANUAL_REQUEST })
  async createManualRequest(data: CreateManualRequestDTO): Promise<any> {
    return await this.msLoyaltyService.createManualRequest(data);
  }
}
