import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Reservation, ReservationDocument } from './schemas/reservation.schema';
import {
  CreateReservationDto,
  ReservationSearchOptionsDto,
} from './dto/reservation.dto';
import { IReservation } from './interfaces/reservation.interface';

@Injectable()
export class ReservationsService implements IReservation {
  constructor(
    @InjectModel(Reservation.name)
    private reservationModel: Model<ReservationDocument>,
  ) {}

  async addReservation(
    data: CreateReservationDto,
  ): Promise<ReservationDocument> {
    // TODO Добавить проверки
    const reservation = new this.reservationModel(data);
    return reservation.save();
  }

  async removeReservation(id: string): Promise<void> {
    const result = await this.reservationModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Reservation was not found');
    }
  }

  async getReservations(
    filter: ReservationSearchOptionsDto,
  ): Promise<ReservationDocument[]> {
    const { userId, limit, offset } = filter;

    const query: any = {};
    if (userId) {
      query.userId = new Types.ObjectId(userId);
    }
    return this.reservationModel.find(query).limit(limit).skip(offset).exec();
  }
}
