import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { HotelsService } from './hotels.service';
import { HotelsController } from './hotels.controller';
import { Hotel, HotelSchema } from './schemas/hotel.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Hotel.name, schema: HotelSchema }]),
  ],
  providers: [HotelsService],
  controllers: [HotelsController],
})
export class HotelsModule {}
