import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { HotelRoom, HotelRoomDocument } from './schemas/hotel-room.schema';
import {
  Reservation,
  ReservationDocument,
} from 'src/reservations/schemas/reservation.schema';
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
    private reservationModel: Model<ReservationDocument>,
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
    const { limit, offset, hotel, dateStart, dateEnd, isEnabled } = params;

    const searchQuery: any = {};
    if (hotel) {
      searchQuery.hotel = hotel;
    }

    if (isEnabled !== undefined) {
      searchQuery.isEnabled = isEnabled;
    } else {
      searchQuery.isEnabled = false;
    }

    const allPotentialRooms = await this.hotelRoomModel
      .find(searchQuery)
      .populate('hotel')
      .exec();

    const availableRooms: HotelRoomDocument[] = [];
    if (dateStart && dateEnd) {
      for (const room of allPotentialRooms) {
        const isAvailable = await this.isRoomAvailable(
          room.id,
          dateStart,
          dateEnd,
        );
        if (isAvailable) {
          availableRooms.push(room);
        }
      }
    }

    const paginatedRooms: HotelRoomDocument[] = availableRooms.slice(
      offset,
      offset + limit,
    );

    return paginatedRooms;
  }

  private async isRoomAvailable(
    roomId: string,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<boolean> {
    const overlappingReservation = await this.reservationModel
      .findOne({
        roomId: roomId,
        dateEnd: { $gt: dateStart },
        dateStart: { $lt: dateEnd },
      })
      .exec();

    return !overlappingReservation;
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
