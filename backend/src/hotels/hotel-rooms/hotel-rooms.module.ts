import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HotelRoomsController } from './hotel-rooms.controller';
import { HotelRoom, HotelRoomSchema } from './schemas/hotel-room.schema';
import { HotelRoomsService } from './hotel-rooms.service';
import { MulterModule } from '@nestjs/platform-express';
import { ReservationsModule } from 'src/reservations/reservations.module';
import {
  Reservation,
  ReservationSchema,
} from 'src/reservations/schemas/reservation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HotelRoom.name, schema: HotelRoomSchema },
      { name: Reservation.name, schema: ReservationSchema },
    ]),
    MulterModule.register({ dest: './public' }),
    forwardRef(() => ReservationsModule),
  ],
  controllers: [HotelRoomsController],
  providers: [HotelRoomsService],
  exports: [HotelRoomsService],
})
export class HotelRoomsModule {}
