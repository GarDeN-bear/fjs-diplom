import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  CreateUserDto,
  SearchUserParamsDto,
  UpdateUserParamsDto,
} from './dto/user.dto';
import { UserDocument } from './schemas/user.schema';

@UsePipes(new ValidationPipe())
@Controller('/api')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('client/register')
  create(@Body() data: CreateUserDto): Promise<UserDocument> {
    return this.usersService.create(data);
  }

  @Get()
  findAll(@Query() data: SearchUserParamsDto): Promise<UserDocument[]> {
    return this.usersService.findAll(data);
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<UserDocument> {
    return this.usersService.findById(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() data: UpdateUserParamsDto,
  ): Promise<UserDocument> {
    return this.usersService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.usersService.delete(id);
  }
}
