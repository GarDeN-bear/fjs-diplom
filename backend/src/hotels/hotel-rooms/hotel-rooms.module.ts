import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HotelRoomsClientController } from './hotel-rooms.client.controller';
import { HotelRoom, HotelRoomSchema } from './schemas/hotel-room.schema';
import { HotelRoomsService } from './hotel-rooms.service';
import { HotelRoomsAdminController } from './hotel-rooms.admin.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HotelRoom.name, schema: HotelRoomSchema },
    ]),
    HotelRoomsModule,
  ],
  controllers: [HotelRoomsClientController, HotelRoomsAdminController],
  providers: [HotelRoomsService],
})
export class HotelRoomsModule {}
