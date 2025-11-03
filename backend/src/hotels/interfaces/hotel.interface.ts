import {
  CreateHotelDto,
  SearchHotelParamsDto,
  UpdateHotelParamsDto,
} from '../dto/hotel.dto';
import { Hotel } from '../schemas/hotel.schema';

export interface SearchHotelParams {
  limit: number;
  offset: number;
  title: string;
}

export interface UpdateHotelParams {
  title: string;
  description: string;
}

export interface IHotelService {
  create(data: CreateHotelDto): Promise<Hotel>;
  findById(id: string): Promise<Hotel>;
  search(params: SearchHotelParamsDto): Promise<Hotel[]>;
  update(id: string, data: UpdateHotelParamsDto): Promise<Hotel>;
}
