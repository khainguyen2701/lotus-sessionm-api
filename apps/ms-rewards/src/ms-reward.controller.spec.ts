import { Test, TestingModule } from '@nestjs/testing';
import { MsTagsController } from './ms-reward.controller';
import { MsTagsService } from './ms-reward.service';

describe('MsTagsController', () => {
  let msTagsController: MsTagsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MsTagsController],
      providers: [MsTagsService],
    }).compile();

    msTagsController = app.get<MsTagsController>(MsTagsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(msTagsController.getHello()).toBe('Hello World!');
    });
  });
});
