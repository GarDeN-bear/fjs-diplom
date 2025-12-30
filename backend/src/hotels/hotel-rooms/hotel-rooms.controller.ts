import {
  Body,
  Controller,
  Delete,
  Get,
  Optional,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

import {
  CreateHotelRoomDto,
  SearchRoomsParamsDto,
  UpdateHotelRoomParamsDto,
} from './dto/hotel-room.dto';
import { HotelRoomsService } from './hotel-rooms.service';
import { HotelRoomDocument } from './schemas/hotel-room.schema';

@UsePipes(new ValidationPipe())
@Controller('api')
export class HotelRoomsController {
  constructor(private readonly hotelRoomsService: HotelRoomsService) {}

  @Get('common/hotel-rooms/')
  search(@Query() params: SearchRoomsParamsDto): Promise<HotelRoomDocument[]> {
    return this.hotelRoomsService.search(params);
  }

  @Get('common/hotel-rooms/:id')
  findById(@Param('id') id: string): Promise<HotelRoomDocument> {
    return this.hotelRoomsService.findById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 10 }]))
  @Post('admin/hotel-rooms/')
  create(
    @Optional() @UploadedFiles() files: { images?: Express.Multer.File[] },
    @Body() data: CreateHotelRoomDto,
  ): Promise<HotelRoomDocument> {
    let imagesPath: string[] = [];
    if (files && files.images) {
      imagesPath = files.images.map((image) => {
        return image.filename;
      });
    }

    data = { ...data, images: imagesPath };
    return this.hotelRoomsService.create(data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 10 }]))
  @Put('admin/hotel-rooms/:id')
  update(
    @Param('id') id: string,
    @Optional() @UploadedFiles() files: { images?: Express.Multer.File[] },
    @Body() data: UpdateHotelRoomParamsDto,
  ): Promise<HotelRoomDocument> {
    let imagesPath: string[] = data.images || [];
    if (files && files.images) {
      imagesPath = files.images.map((image) => {
        return image.filename;
      });
    }
    data = { ...data, images: imagesPath };
    return this.hotelRoomsService.update(id, data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('admin/hotel-rooms/:id')
  delete(@Param('id') id: string): Promise<void> {
    return this.hotelRoomsService.delete(id);
  }
}
