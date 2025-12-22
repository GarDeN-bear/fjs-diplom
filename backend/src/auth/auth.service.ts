import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';

import { UsersService } from '../users/users.service';
import { UserDocument } from '../users/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

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

  async login(data: LoginDto): Promise<UserDocument> {
    const user: UserDocument = await this.validateUser(data);

    return user;
  }
}
