import { IsString, IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

export class CreateHotelDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class SearchHotelParamsDto {
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  limit: number = 10;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  offset: number = 0;

  @IsString()
  @IsOptional()
  title?: string;
}

export class UpdateHotelParamsDto extends PartialType(CreateHotelDto) {}
