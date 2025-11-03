import { Test, TestingModule } from '@nestjs/testing';
import { HotelRoomsClientController } from './hotel-rooms.client.controller';

describe('HotelRoomsClientController', () => {
  let controller: HotelRoomsClientController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HotelRoomsClientController],
    }).compile();

    controller = module.get<HotelRoomsClientController>(
      HotelRoomsClientController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
