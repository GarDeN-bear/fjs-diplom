import {
  Body,
  Controller,
  Post,
  Get,
  Query,
  Put,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { HotelsService } from './hotels.service';
import { HotelDocument } from './schemas/hotel.schema';
import {
  CreateHotelDto,
  SearchHotelParamsDto,
  UpdateHotelParamsDto,
} from './dto/hotel.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('api')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @Get('common/hotels/')
  search(@Query() params: SearchHotelParamsDto): Promise<HotelDocument[]> {
    return this.hotelsService.search(params);
  }

  @UseGuards(RolesGuard, JwtAuthGuard)
  @Roles('admin')
  @Post('admin/hotels/')
  create(@Body() data: CreateHotelDto): Promise<HotelDocument> {
    return this.hotelsService.create(data);
  }

  @UseGuards(RolesGuard, JwtAuthGuard)
  @Roles('admin')
  @Put('admin/hotels/:id')
  update(
    @Param('id') id: string,
    @Body() data: UpdateHotelParamsDto,
  ): Promise<HotelDocument> {
    return this.hotelsService.update(id, data);
  }

  @UseGuards(RolesGuard, JwtAuthGuard)
  @Roles('admin')
  @Delete('admin/hotels/:id')
  delete(@Param('id') id: string): Promise<void> {
    return this.hotelsService.delete(id);
  }
}
