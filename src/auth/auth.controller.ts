import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { AuthService } from './auth.service';

import { LoginUser } from './dto/login-user.dto';
import { RegisterUser } from './dto/register-user.dto';
import { ResponseUser } from './dto/response-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() registerInput: RegisterUser): Promise<ResponseUser> {
    return this.authService.register(registerInput);
  }

  @Post('/login')
  login(@Body() loginInput: LoginUser): Promise<ResponseUser> {
    return this.authService.login(loginInput);
  }
}
