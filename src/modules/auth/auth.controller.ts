import { Controller, Body, Post, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from '../users/DTOs/user.dto';
import { LoginDto } from './DTOs/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const token = await this.authService.login(loginDto);
    if (!token) {
      throw new BadRequestException('Username or password incorrect');
    }
    return token;
  }

  @Post('signup')
  async signUp(@Body() user: UserDto) {
    const result = await this.authService.create(user);
    if (!result) {
      throw new BadRequestException('Email or phone already exist');
    }
    return result;
  }
}
