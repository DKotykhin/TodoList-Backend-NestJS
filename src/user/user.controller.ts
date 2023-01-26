import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  UseGuards,
  Post,
  Req,
} from '@nestjs/common';

import { AuthGuard } from 'src/auth/auth.guard';
import { UserService } from './user.service';
import { NameDto, PasswordDto } from './dto/update-user.dto';
import { UserResponse } from './dto/response-user.dto';
import {
  ConfirmPasswordResponse,
  DeleteUserResponse,
} from './dto/response-status.dto';
import { RequestDto } from './dto/request.dto';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  async getUserByToken(@Req() req: RequestDto): Promise<UserResponse> {
    return this.userService.getUserByToken(req.userId._id);
  }

  @Patch('/name')
  async updateName(
    @Req() req: RequestDto,
    @Body() updateName: NameDto,
  ): Promise<UserResponse> {
    return this.userService.updateName(updateName, req.userId._id);
  }

  @Post('/password')
  async confirmPassword(
    @Req() req: RequestDto,
    @Body() confirmPassword: PasswordDto,
  ): Promise<ConfirmPasswordResponse> {
    return this.userService.confirmPassword(confirmPassword, req.userId._id);
  }

  @Patch('/password')
  async updatePassword(
    @Req() req: RequestDto,
    @Body() updatePassword: PasswordDto,
  ): Promise<UserResponse> {
    return this.userService.updatePassword(updatePassword, req.userId._id);
  }

  @Delete('/me')
  async deleteUser(@Req() req: RequestDto): Promise<DeleteUserResponse> {
    return this.userService.deleteUser(req.userId._id);
  }
}
