import { IsString, IsNumber, Min, IsDate, IsOptional } from 'class-validator';
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

  @IsNumber() @Min(0) @Type(() => Number) limit: number = 10;

  @IsNumber() @Min(0) @Type(() => Number) offset: number = 0;

  @IsDate()
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : null))
  dateStart: Date;

  @IsDate()
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : null))
  dateEnd: Date;
}

export class UpdateReservationParamsDto extends PartialType(
  CreateReservationDto,
) {}
