import { IsString, IsNumber, Min, IsDate } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';

export interface ReservationSearchOptions {
  userId: string;
  dateStart: Date;
  dateEnd: Date;
}
export class CreateReservationDto {
  @IsString()
  userId: string;

  @IsString()
  hotelId: string;

  @IsString()
  roomId: string;

  @IsDate()
  dateStart: Date;

  @IsDate()
  dateEnd: Date;
}

export class ReservationSearchOptionsDto {
  @IsString()
  userId: string;

  @IsDate()
  dateStart: Date;

  @IsDate()
  dateEnd: Date;
}

export class UpdateReservationParamsDto extends PartialType(
  CreateReservationDto,
) {}
