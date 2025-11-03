import { Test, TestingModule } from '@nestjs/testing';
import { HotelsAdminController } from './hotels.admin.controller';

describe('HotelsAdminController', () => {
  let controller: HotelsAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HotelsAdminController],
    }).compile();

    controller = module.get<HotelsAdminController>(HotelsAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
