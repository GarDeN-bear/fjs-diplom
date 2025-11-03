import {
  Body,
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { HotelRoomsService } from './hotel-rooms.service';
import { SearchRoomsParamsDto } from './dto/hotel-room.dto';
import { HotelRoomDocument } from './schemas/hotel-room.schema';

@UsePipes(new ValidationPipe())
@Controller('/api/common/hotel-rooms')
export class HotelRoomsClientController {
  constructor(private readonly hotelRoomsService: HotelRoomsService) {}

  @Get(':id')
  findById(@Body() id: string): Promise<HotelRoomDocument> {
    return this.hotelRoomsService.findById(id);
  }

  @Get()
  search(@Query() params: SearchRoomsParamsDto): Promise<HotelRoomDocument[]> {
    return this.hotelRoomsService.search(params);
  }
}
