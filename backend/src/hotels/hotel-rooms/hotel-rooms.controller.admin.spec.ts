import { Test, TestingModule } from '@nestjs/testing';
import { HotelRoomsAdminController } from './hotel-rooms.admin.controller';

describe('HotelRoomsAdminController', () => {
  let controller: HotelRoomsAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HotelRoomsAdminController],
    }).compile();

    controller = module.get<HotelRoomsAdminController>(
      HotelRoomsAdminController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
