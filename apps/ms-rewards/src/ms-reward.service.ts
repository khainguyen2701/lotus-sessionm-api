import { Injectable } from '@nestjs/common';

@Injectable()
export class MsRewardService {
  getHello(): string {
    return 'Hello World!';
  }
}
