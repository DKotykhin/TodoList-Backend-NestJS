import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';

import { LoginDto } from './dto/login-user.dto';
import { RegisterDto } from './dto/register-user.dto';
import { AuthResponse } from './dto/response-auth.dto';

@ApiTags('Authification')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 201, type: AuthResponse })
  @ApiBadRequestResponse({ description: 'User ${email} already exist' })
  @HttpCode(HttpStatus.CREATED)
  @Post('/register')
  register(@Body() registerInput: RegisterDto): Promise<AuthResponse> {
    return this.authService.register(registerInput);
  }

  @ApiOperation({ summary: 'Login user' })
  @ApiOkResponse({
    type: AuthResponse,
    description: 'User ${name} successfully logged',
  })
  @ApiBadRequestResponse({ description: 'Incorrect login or password' })
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  login(@Body() loginInput: LoginDto): Promise<AuthResponse> {
    return this.authService.login(loginInput);
  }
}
