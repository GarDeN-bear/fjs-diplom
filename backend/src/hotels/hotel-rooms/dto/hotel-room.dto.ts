import { PartialType } from '@nestjs/mapped-types';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { console } from 'inspector';

export class CreateHotelRoomDto {
  @IsString() hotel: string;

  @IsOptional() @IsString() description?: string;

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return parsed;
      } catch {
        return [value];
      }
    }
    if (Array.isArray(value)) {
      return value;
    }
    return value;
  })
  images?: string[];

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      if (value === 'true') return true;
      if (value === 'false') return false;
    } else {
      if (value === true) return true;
      if (value === false) return false;
    }
    return value;
  })
  isEnabled?: boolean;
}

export class SearchRoomsParamsDto {
  @IsNumber() @Min(0) @Type(() => Number) limit: number = 10;

  @IsNumber() @Min(0) @Type(() => Number) offset: number = 0;

  @IsString()
  @IsOptional()
  hotel: string;

  @IsDate()
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : null))
  dateStart: Date;

  @IsDate()
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : null))
  dateEnd: Date;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      if (value === 'true') return true;
      if (value === 'false') return false;
    } else {
      if (value === true) return true;
      if (value === false) return false;
    }
    return value;
  })
  isEnabled?: boolean;
}

export class UpdateHotelRoomParamsDto extends PartialType(CreateHotelRoomDto) {}
