import { Test, TestingModule } from '@nestjs/testing';
import { HotelsClientController } from './hotels.client.controller';

describe('HotelsClientController', () => {
  let controller: HotelsClientController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HotelsClientController],
    }).compile();

    controller = module.get<HotelsClientController>(HotelsClientController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
