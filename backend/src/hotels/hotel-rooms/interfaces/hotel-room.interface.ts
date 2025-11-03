import { HotelRoom } from '../schemas/hotel-room.schema';
import {
  CreateHotelRoomDto,
  SearchRoomsParamsDto,
  UpdateHotelRoomParamsDto,
} from '../dto/hotel-room.dto';

export interface SearchRoomsParams {
  limit: number;
  offset: number;
  hotel: string;
  isEnabled?: boolean;
}

export interface IHotelRoomService {
  create(data: CreateHotelRoomDto): Promise<HotelRoom>;
  findById(id: string): Promise<HotelRoom>;
  search(params: SearchRoomsParamsDto): Promise<HotelRoom[]>;
  update(id: string, data: UpdateHotelRoomParamsDto): Promise<HotelRoom>;
}
