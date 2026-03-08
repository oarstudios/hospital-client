import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';

import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {

    const user = await this.authService.register(dto);

    return user;

  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {

    const tokens = await this.authService.login(dto);

    const secure = this.configService.get<string>('COOKIE_SECURE') === 'true';
    const sameSite = this.configService.get<string>('COOKIE_SAMESITE') as any;

    res.cookie('access_token', tokens.access_token, {
      httpOnly: true,
      secure,
      sameSite,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure,
      sameSite,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      message: "Login successful"
    };

  }

  @Post('refresh')
  async refresh(@Body() dto: RefreshDto) {

    const token = await this.authService.refreshToken(dto.refresh_token);

    return token;

  }

}