import { Injectable } from '@nestjs/common';

@Injectable()
export class MsLoyaltyService {
  getHello(): string {
    return 'Hello World!';
  }
}
