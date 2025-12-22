import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Res,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';
import { JwtService } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';
import { UserDocument } from 'src/users/schemas/user.schema';
import { JwtAuthGuard } from './guards/jwt.auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const user: UserDocument = (
      await this.authService.login(loginDto)
    ).toObject();
    const token = await this.jwtService.sign({ id: user._id });

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 1000,
    });

    const { passwordHash, ...userWithoutPassword } = user;

    return res.status(200).json(userWithoutPassword);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req: any) {
    const user = req.user.toObject();
    if (user) {
      const { passwordHash, ...userData } = user;
      return userData;
    }
    return { message: 'Не авторизован' };
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('token');
    return res.status(200).json({ message: 'Logged out successfully' });
  }
}
