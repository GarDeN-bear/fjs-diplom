import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/user.dto';
import { UserDocument } from './schemas/user.schema';

@UsePipes(new ValidationPipe())
@Controller('/api/client')
export class UsersClientController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  create(@Body() data: CreateUserDto): Promise<UserDocument> {
    return this.usersService.create(data);
  }
}
