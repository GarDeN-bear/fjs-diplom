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
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  CreateUserDto,
  SearchUserParamsDto,
  UpdateUserParamsDto,
} from './dto/user.dto';
import { UserDocument } from './schemas/user.schema';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { console } from 'inspector';

@UsePipes(new ValidationPipe())
@Controller('api')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('admin/users/')
  create(@Body() data: CreateUserDto): Promise<UserDocument> {
    return this.usersService.create(data);
  }

  @Post('client/register')
  async register(@Body() data: CreateUserDto) {
    const user: UserDocument = await this.usersService.create(data);
    const { passwordHash, ...userData } = user;

    return userData;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin/users/')
  findAllForAdmin(@Query() data: SearchUserParamsDto): Promise<UserDocument[]> {
    return this.usersService.findAll(data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin/users/:id')
  findByIdForAdmin(@Param('id') id: string): Promise<UserDocument> {
    return this.usersService.findById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('manager')
  @Get('manager/users/')
  findAllForManager(
    @Query() data: SearchUserParamsDto,
  ): Promise<UserDocument[]> {
    return this.usersService.findAll(data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('manager')
  @Get('manager/users/:id')
  findByIdForManager(@Param('id') id: string): Promise<UserDocument> {
    return this.usersService.findById(id);
  }

  // @Put(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() data: UpdateUserParamsDto,
  // ): Promise<UserDocument> {
  //   return this.usersService.update(id, data);
  // }

  // @Delete(':id')
  // delete(@Param('id') id: string): Promise<void> {
  //   return this.usersService.delete(id);
  // }
}
