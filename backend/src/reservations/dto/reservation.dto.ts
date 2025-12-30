import { IsString, IsNumber, Min, IsDate } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Transform, Type } from 'class-transformer';

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
  @Transform(({ value }) => (value ? new Date(value) : null))
  dateStart: Date;

  @IsDate()
  @Transform(({ value }) => (value ? new Date(value) : null))
  dateEnd: Date;
}

export class ReservationSearchOptionsDto {
  @IsString()
  userId: string;

  @IsDate()
  @Transform(({ value }) => (value ? new Date(value) : null))
  dateStart: Date;

  @IsDate()
  @Transform(({ value }) => (value ? new Date(value) : null))
  dateEnd: Date;
}

export class UpdateReservationParamsDto extends PartialType(
  CreateReservationDto,
) {}
