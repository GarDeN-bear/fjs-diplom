import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

import {
  CreateHotelDto,
  SearchHotelParamsDto,
  UpdateHotelParamsDto,
} from './dto/hotel.dto';
import { HotelsService } from './hotels.service';
import { HotelDocument } from './schemas/hotel.schema';

@Controller('api')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @Get('common/hotels/')
  search(@Query() params: SearchHotelParamsDto): Promise<HotelDocument[]> {
    return this.hotelsService.search(params);
  }

  @Get('common/hotels/:id')
  find(@Param('id') id: string): Promise<HotelDocument> {
    return this.hotelsService.findById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('admin/hotels/')
  create(@Body() data: CreateHotelDto): Promise<HotelDocument> {
    return this.hotelsService.create(data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put('admin/hotels/:id')
  update(
    @Param('id') id: string,
    @Body() data: UpdateHotelParamsDto,
  ): Promise<HotelDocument> {
    return this.hotelsService.update(id, data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('admin/hotels/:id')
  delete(@Param('id') id: string): Promise<void> {
    console.log(id);

    return this.hotelsService.delete(id);
  }
}
