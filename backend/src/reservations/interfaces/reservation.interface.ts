import { Reservation } from '../schemas/reservation.schema';
import {
  CreateReservationDto,
  ReservationSearchOptionsDto,
} from '../dto/reservation.dto';

export interface CreateReservation {
  userId: string;
  hotelId: string;
  roomId: string;
  dateStart: Date;
  dateEnd: Date;
}

export interface ReservationSearchOptions {
  userId: string;
  dateStart: Date;
  dateEnd: Date;
}

export interface IReservation {
  addReservation(data: CreateReservationDto): Promise<Reservation>;
  removeReservation(id: string): Promise<void>;
  getReservations(
    filter: ReservationSearchOptionsDto,
  ): Promise<Array<Reservation>>;
}
