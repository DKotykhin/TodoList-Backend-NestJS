import {
  Body,
  Controller,
  Delete,
  Get,
  Req,
  Patch,
  UseGuards,
  Post,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';

import { Name, Password } from './dto/update-user.dto';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { ResponseUser } from './dto/response-user.dto';
import {
  ResponseStatusConfirmPassword,
  ResponseStatusDeleteUser,
} from './dto/response-status.dto';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private jwtServise: JwtService,
  ) {}

  private getUserId = async (request: Request) => {
    const token = request.headers.authorization.split(' ')[1];
    const user = this.jwtServise.verify(token);
    return user;
  };

  @Get('/me')
  async getUserByToken(@Req() request: Request): Promise<ResponseUser> {
    const user = await this.getUserId(request);
    return this.userService.getUserByToken(user._id);
  }

  @Patch('/name')
  async updateName(
    @Req() request: Request,
    @Body() updateName: Name,
  ): Promise<ResponseUser> {
    const user = await this.getUserId(request);
    return this.userService.updateName(updateName, user._id);
  }

  @Post('/password')
  async confirmPassword(
    @Req() request: Request,
    @Body() confirmPassword: Password,
  ): Promise<ResponseStatusConfirmPassword> {
    const user = await this.getUserId(request);
    return this.userService.confirmPassword(confirmPassword, user._id);
  }

  @Patch('/password')
  async updatePassword(
    @Req() request: Request,
    @Body() updatePassword: Password,
  ): Promise<ResponseUser> {
    const user = await this.getUserId(request);
    return this.userService.updatePassword(updatePassword, user._id);
  }

  @Delete('/me')
  async deleteUser(@Req() request: Request): Promise<ResponseStatusDeleteUser> {
    const user = await this.getUserId(request);
    return this.userService.deleteUser(user._id);
  }
}
