import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsClientController } from './reservations.client.controller';

describe('ReservationsClientController', () => {
  let controller: ReservationsClientController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationsClientController],
    }).compile();

    controller = module.get<ReservationsClientController>(
      ReservationsClientController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
