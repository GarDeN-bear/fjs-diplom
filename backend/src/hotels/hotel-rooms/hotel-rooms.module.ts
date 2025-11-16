import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HotelRoomsController } from './hotel-rooms.controller';
import { HotelRoom, HotelRoomSchema } from './schemas/hotel-room.schema';
import { HotelRoomsService } from './hotel-rooms.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HotelRoom.name, schema: HotelRoomSchema },
    ]),
    MulterModule.register({ dest: './public' }),
  ],
  controllers: [HotelRoomsController],
  providers: [HotelRoomsService],
})
export class HotelRoomsModule {}
