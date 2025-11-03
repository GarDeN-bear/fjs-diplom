import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Hotel, HotelDocument } from './schemas/hotel.schema';
import {
  CreateHotelDto,
  SearchHotelParamsDto,
  UpdateHotelParamsDto,
} from './dto/hotel.dto';
import { IHotelService } from './interfaces/hotel.interface';

@Injectable()
export class HotelsService implements IHotelService {
  constructor(
    @InjectModel(Hotel.name) private hotelModel: Model<HotelDocument>,
  ) {}

  async create(data: CreateHotelDto): Promise<HotelDocument> {
    const hotel = new this.hotelModel(data);
    return hotel.save();
  }

  async findById(id: string): Promise<HotelDocument> {
    const hotel = await this.hotelModel.findById(id).exec();
    if (!hotel) {
      throw new NotFoundException('Hotel was not found');
    }
    return hotel;
  }

  async search(params: SearchHotelParamsDto): Promise<HotelDocument[]> {
    const { limit, offset, title } = params;

    const query: any = {};
    if (title) {
      query.title = { $regex: title, $options: 'i' };
    }

    return this.hotelModel.find(query).limit(limit).skip(offset).exec();
  }

  async update(id: string, data: UpdateHotelParamsDto): Promise<HotelDocument> {
    const hotel = await this.hotelModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();

    if (!hotel) {
      throw new NotFoundException('Hotel was not found');
    }

    return hotel;
  }

  async delete(id: string): Promise<void> {
    const result = await this.hotelModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Hotel wasn not found');
    }
  }
}
