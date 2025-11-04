import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { UserDocument } from '../users/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/auth.dto';
import { CreateUserDto } from 'src/users/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(data: LoginDto): Promise<UserDocument> {
    const user = await this.usersService.findByEmail(data.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email');
    }

    const isPasswordMatched = await bcrypt.compare(
      data.password,
      user.passwordHash,
    );

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid password');
    }

    return user;
  }

  async login(data: LoginDto): Promise<string> {
    const user: UserDocument = await this.validateUser(data);
    return this.jwtService.sign({ id: user.id });
  }

  async logout() {
    return { message: 'Logged out successfully' };
  }
}
