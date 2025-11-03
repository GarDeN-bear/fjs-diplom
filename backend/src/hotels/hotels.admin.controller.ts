import {
  Body,
  Controller,
  Post,
  Get,
  Query,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { HotelDocument } from './schemas/hotel.schema';
import {
  CreateHotelDto,
  SearchHotelParamsDto,
  UpdateHotelParamsDto,
} from './dto/hotel.dto';

@Controller('/api/admin/hotels')
export class HotelsAdminController {
  constructor(private readonly hotelsService: HotelsService) {}

  @Post()
  create(@Body() data: CreateHotelDto): Promise<HotelDocument> {
    return this.hotelsService.create(data);
  }

  @Get()
  search(@Query() params: SearchHotelParamsDto): Promise<HotelDocument[]> {
    return this.hotelsService.search(params);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() data: UpdateHotelParamsDto,
  ): Promise<HotelDocument> {
    return this.hotelsService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.hotelsService.delete(id);
  }
}
