import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async authUser(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Get()
  async isUserSigned() {
    return 200;
  }
}
