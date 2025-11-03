import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsManagerController } from './reservations.manager.controller';

describe('ReservationsManagerController', () => {
  let controller: ReservationsManagerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationsManagerController],
    }).compile();

    controller = module.get<ReservationsManagerController>(
      ReservationsManagerController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
