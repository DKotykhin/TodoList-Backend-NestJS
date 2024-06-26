import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';

import { AuthService } from './auth.service';

import { LoginDto, RegisterDto } from './dto/auth.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 201, type: AuthResponseDto })
  @ApiBadRequestResponse({ description: 'User ${email} already exist' })
  @HttpCode(HttpStatus.CREATED)
  @Post('/register')
  register(@Body() registerInput: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerInput);
  }

  @ApiOperation({ summary: 'Login user' })
  @ApiOkResponse({
    type: AuthResponseDto,
    description: 'User ${name} successfully logged',
  })
  @ApiBadRequestResponse({ description: 'Incorrect login or password' })
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  login(
    @Body() loginInput: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponseDto> {
    return this.authService.login(loginInput, response);
  }
}
