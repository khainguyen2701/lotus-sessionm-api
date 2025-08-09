import { Test, TestingModule } from '@nestjs/testing';
import { MsLoyaltyController } from './ms-loyalty.controller';
import { MsLoyaltyService } from './ms-loyalty.service';

describe('MsLoyaltyController', () => {
  let msLoyaltyController: MsLoyaltyController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MsLoyaltyController],
      providers: [MsLoyaltyService],
    }).compile();

    msLoyaltyController = app.get<MsLoyaltyController>(MsLoyaltyController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(msLoyaltyController.getHello()).toBe('Hello World!');
    });
  });
});
