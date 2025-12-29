import { Transform, Type } from 'class-transformer';
import { IsString, IsDate, IsBoolean, MinLength } from 'class-validator';

export class CreateSupportRequestDto {
  @IsString()
  user: string;

  @IsString()
  @MinLength(1)
  text: string;
}

export class SendMessageDto {
  @IsString()
  author: string;

  @IsString()
  supportRequest: string;

  @IsString()
  text: string;
}

export class MarkMessagesAsReadDto {
  @IsString()
  user: string;

  @IsString()
  supportRequest: string;

  @IsDate()
  @Transform(({ value }) => (value ? new Date(value) : null))
  createdBefore: Date;
}

export class GetChatListParamsDto {
  @IsString()
  user: string;

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
  isActive: boolean;
}
