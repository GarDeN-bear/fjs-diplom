import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Reservation, ReservationSchema } from './schemas/reservation.schema';
import { Hotel, HotelSchema } from 'src/hotels/schemas/hotel.schema';
import {
  HotelRoom,
  HotelRoomSchema,
} from 'src/hotels/hotel-rooms/schemas/hotel-room.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { UsersModule } from 'src/users/users.module';
import { HotelsModule } from 'src/hotels/hotels.module';
import { HotelRoomsModule } from 'src/hotels/hotel-rooms/hotel-rooms.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reservation.name, schema: ReservationSchema },
      { name: User.name, schema: UserSchema },
      { name: HotelRoom.name, schema: HotelRoomSchema },
      { name: Hotel.name, schema: HotelSchema }, // if you have a Hotel model
    ]),
    UsersModule,
    HotelsModule,
    HotelRoomsModule,
  ],
  providers: [ReservationsService],
  controllers: [ReservationsController],
})
export class ReservationsModule {}
