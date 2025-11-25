import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, isValidObjectId } from 'mongoose';

import { HotelRoom, HotelRoomDocument } from './schemas/hotel-room.schema';
import {
  CreateHotelRoomDto,
  SearchRoomsParamsDto,
  UpdateHotelRoomParamsDto,
} from './dto/hotel-room.dto';
import { IHotelRoomService } from './interfaces/hotel-room.interface';

@Injectable()
export class HotelRoomsService implements IHotelRoomService {
  constructor(
    @InjectModel(HotelRoom.name)
    private hotelRoomModel: Model<HotelRoomDocument>,
  ) {}

  async create(data: CreateHotelRoomDto): Promise<HotelRoomDocument> {
    const room = new this.hotelRoomModel(data);
    return room.save();
  }

  async findById(id: string): Promise<HotelRoomDocument> {
    const hotelRoom = await this.hotelRoomModel
      .findById(id)
      .populate('hotel')
      .exec();
    if (!hotelRoom) {
      throw new NotFoundException('Room was not found');
    }
    return hotelRoom;
  }

  async search(params: SearchRoomsParamsDto): Promise<HotelRoomDocument[]> {
    const { limit, offset, hotel, isEnabled } = params;
    const query: any = {};

    if (hotel) {
      query.hotel = hotel;
    }

    if (isEnabled !== undefined) {
      query.isEnabled = isEnabled;
    }

    return this.hotelRoomModel
      .find(query)
      .populate('hotel')
      .limit(limit)
      .skip(offset)
      .exec();
  }

  async update(
    id: string,
    data: UpdateHotelRoomParamsDto,
  ): Promise<HotelRoomDocument> {
    const hotelRoom = await this.hotelRoomModel
      .findByIdAndUpdate(id, data, { new: true })
      .populate('hotel')
      .exec();
    if (!hotelRoom) {
      throw new NotFoundException('Room was not found');
    }

    return hotelRoom;
  }

  async delete(id: string): Promise<void> {
    const result = await this.hotelRoomModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Room was not found');
    }
  }
}
