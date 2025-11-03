import {
  IsEmail,
  IsString,
  IsOptional,
  IsIn,
  IsNumber,
  Min,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  contactPhone?: string;

  @IsIn(['client', 'admin', 'manager'])
  @IsOptional()
  role?: string;
}

export class SearchUserParamsDto {
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
  email?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  contactPhone?: string;
}

export class UpdateUserParamsDto extends PartialType(CreateUserDto) {}
