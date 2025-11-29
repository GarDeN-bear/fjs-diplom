import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { HotelsModule } from './hotels/hotels.module';
import { ReservationsModule } from './reservations/reservations.module';
import { AuthModule } from './auth/auth.module';
import { HotelRoomsModule } from './hotels/hotel-rooms/hotel-rooms.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public',
    }),
    MongooseModule.forRoot(
      process.env.MONGO_URL || 'mongodb://root:example@mongo:27017/',
    ),
    forwardRef(() => UsersModule),
    forwardRef(() => HotelRoomsModule),
    forwardRef(() => HotelsModule),
    forwardRef(() => ReservationsModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
