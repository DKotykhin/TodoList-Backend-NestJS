import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { AuthService } from './auth.service';

import { LoginDto } from './dto/login-user.dto';
import { RegisterDto } from './dto/register-user.dto';
import { AuthResponse } from './dto/response-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() registerInput: RegisterDto): Promise<AuthResponse> {
    return this.authService.register(registerInput);
  }

  @Post('/login')
  login(@Body() loginInput: LoginDto): Promise<AuthResponse> {
    return this.authService.login(loginInput);
  }
}
