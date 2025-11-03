import {
  Body,
  Controller,
  Put,
  Post,
  Delete,
  Param,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { HotelRoomsService } from './hotel-rooms.service';
import {
  CreateHotelRoomDto,
  UpdateHotelRoomParamsDto,
} from './dto/hotel-room.dto';
import { HotelRoomDocument } from './schemas/hotel-room.schema';

@UsePipes(new ValidationPipe())
@Controller('/api/admin/hotel-rooms')
export class HotelRoomsAdminController {
  constructor(private readonly hotelRoomsService: HotelRoomsService) {}

  @Post()
  create(@Body() data: CreateHotelRoomDto): Promise<HotelRoomDocument> {
    return this.hotelRoomsService.create(data);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() data: UpdateHotelRoomParamsDto,
  ): Promise<HotelRoomDocument> {
    return this.hotelRoomsService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.hotelRoomsService.delete(id);
  }
}
