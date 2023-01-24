import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  UseGuards,
  Headers,
  Post,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthGuard } from 'src/auth/auth.guard';
import { UserService } from './user.service';
import { Name, Password } from './dto/update-user.dto';
import { ResponseUser } from './dto/response-user.dto';
import {
  ResponseStatusConfirmPassword,
  ResponseStatusDeleteUser,
} from './dto/response-status.dto';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtServise: JwtService,
  ) {}

  private getUserId = async (authorization: string) => {
    const token = authorization.split(' ')[1];
    const user = this.jwtServise.verify(token);
    return user;
  };

  @Get('/me')
  async getUserByToken(
    @Headers('authorization') authorization: string,
  ): Promise<ResponseUser> {
    const user = await this.getUserId(authorization);
    return this.userService.getUserByToken(user._id);
  }

  @Patch('/name')
  async updateName(
    @Headers('authorization') authorization: string,
    @Body() updateName: Name,
  ): Promise<ResponseUser> {
    const user = await this.getUserId(authorization);
    return this.userService.updateName(updateName, user._id);
  }

  @Post('/password')
  async confirmPassword(
    @Headers('authorization') authorization: string,
    @Body() confirmPassword: Password,
  ): Promise<ResponseStatusConfirmPassword> {
    const user = await this.getUserId(authorization);
    return this.userService.confirmPassword(confirmPassword, user._id);
  }

  @Patch('/password')
  async updatePassword(
    @Headers('authorization') authorization: string,
    @Body() updatePassword: Password,
  ): Promise<ResponseUser> {
    const user = await this.getUserId(authorization);
    return this.userService.updatePassword(updatePassword, user._id);
  }

  @Delete('/me')
  async deleteUser(
    @Headers('authorization') authorization: string,
  ): Promise<ResponseStatusDeleteUser> {
    const user = await this.getUserId(authorization);
    return this.userService.deleteUser(user._id);
  }
}
