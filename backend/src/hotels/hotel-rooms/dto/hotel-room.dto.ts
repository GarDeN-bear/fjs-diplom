import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  IsBoolean,
  IsArray,
  IsDate
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

export class CreateHotelRoomDto {
  @IsString()
  hotel: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return value;
  })
  isEnabled?: boolean;
}

export class SearchRoomsParamsDto {
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  limit: number = 10;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  offset: number = 0;

  @IsString()
  hotel: string;

  @IsDate()
  @IsOptional()
  dateStart: Date;

  @IsDate()
  @IsOptional()
  dateEnd: Date;

  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean;
}

export class UpdateHotelRoomParamsDto extends PartialType(CreateHotelRoomDto) {}
