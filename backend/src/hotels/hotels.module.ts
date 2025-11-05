import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { HotelsService } from './hotels.service';
import { HotelsController } from './hotels.controller';
import { Hotel, HotelSchema } from './schemas/hotel.schema';
import { HotelRoomsService } from './hotel-rooms/hotel-rooms.service';
import { HotelRoomsModule } from './hotel-rooms/hotel-rooms.module';
import {
  HotelRoom,
  HotelRoomSchema,
} from './hotel-rooms/schemas/hotel-room.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HotelRoom.name, schema: HotelRoomSchema },
      { name: Hotel.name, schema: HotelSchema }, // if you have a Hotel model
    ]),
    HotelRoomsModule,
  ],
  providers: [HotelsService, HotelRoomsService],
  controllers: [HotelsController],
})
export class HotelsModule {}
