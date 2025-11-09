import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { HotelRoomsService } from './hotel-rooms.service';
import {
  CreateHotelRoomDto,
  SearchRoomsParamsDto,
  UpdateHotelRoomParamsDto,
} from './dto/hotel-room.dto';
import { HotelRoomDocument } from './schemas/hotel-room.schema';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@UsePipes(new ValidationPipe())
@Controller('api')
export class HotelRoomsController {
  constructor(private readonly hotelRoomsService: HotelRoomsService) {}

  @Get('common/hotel-rooms/')
  search(@Query() params: SearchRoomsParamsDto): Promise<HotelRoomDocument[]> {
    return this.hotelRoomsService.search(params);
  }

  @Get('common/hotel-rooms/:id')
  findById(@Body() id: string): Promise<HotelRoomDocument> {
    return this.hotelRoomsService.findById(id);
  }

  @UseGuards(RolesGuard, JwtAuthGuard)
  @Roles('admin')
  @Post('admin/hotel-rooms/')
  create(@Body() data: CreateHotelRoomDto): Promise<HotelRoomDocument> {
    return this.hotelRoomsService.create(data);
  }

  @UseGuards(RolesGuard, JwtAuthGuard)
  @Roles('admin')
  @Put('admin/hotel-rooms/:id')
  update(
    @Param('id') id: string,
    @Body() data: UpdateHotelRoomParamsDto,
  ): Promise<HotelRoomDocument> {
    return this.hotelRoomsService.update(id, data);
  }

  @UseGuards(RolesGuard, JwtAuthGuard)
  @Roles('admin')
  @Delete('admin/hotel-rooms/:id')
  delete(@Param('id') id: string): Promise<void> {
    return this.hotelRoomsService.delete(id);
  }
}
