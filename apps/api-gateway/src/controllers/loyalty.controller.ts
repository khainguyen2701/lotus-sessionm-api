import { Public } from '@app/common/decorators/public.decorator';
import { CreateManualRequestDTO } from '@app/common/dto/ms-loyalty/manual-request.dto';
import { MessagePatternForMicro } from '@app/common/messagePattern/index.message';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ClaimMilesManualSchema } from '../schema/claimMiles';

@Controller('ms-loyalty')
export class LoyaltyController {
  constructor(@Inject('LOYALTY_SERVICE') private loyaltyClient: ClientProxy) {}

  @ApiTags('Users')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create manual request' })
  @ApiBody({ type: CreateManualRequestDTO })
  @ApiResponse({
    status: 201,
    description: 'Manual request created successfully',
    schema: ClaimMilesManualSchema,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data',
  })
  @Public()
  @Post('/claim-miles-manual/create')
  createManualRequest(@Body() body: CreateManualRequestDTO) {
    return this.loyaltyClient.send(
      { cmd: MessagePatternForMicro.LOYALTY.CREATE_MANUAL_REQUEST },
      { ...body },
    );
  }
}
