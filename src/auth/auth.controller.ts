import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { AuthService } from './auth.service';

import { LoginUser } from './dto/login-user.dto';
import { RegisterUser } from './dto/register-user.dto';
import { ResponseAuth } from './dto/response-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() registerInput: RegisterUser): Promise<ResponseAuth> {
    return this.authService.register(registerInput);
  }

  @Post('/login')
  login(@Body() loginInput: LoginUser): Promise<ResponseAuth> {
    return this.authService.login(loginInput);
  }
}
