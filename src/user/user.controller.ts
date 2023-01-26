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
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { AuthGuard } from 'src/auth/auth.guard';
import { UserService } from './user.service';
import { NameDto, PasswordDto } from './dto/update-user.dto';
import { UserResponse } from './dto/response-user.dto';
import {
  ConfirmPasswordResponse,
  DeleteUserResponse,
} from './dto/response-status.dto';
import { RequestDto } from './dto/request.dto';

@ApiTags('Users')
@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get user by token' })
  @ApiOkResponse({
    type: UserResponse,
    description: 'User ${user.name} successfully logged by token',
  })
  @ApiNotFoundResponse({ description: "Can't find user" })
  @Get('/me')
  async getUserByToken(@Req() req: RequestDto): Promise<UserResponse> {
    return this.userService.getUserByToken(req.userId._id);
  }

  @ApiOperation({ summary: 'Update user name' })
  @ApiOkResponse({
    type: UserResponse,
    description: 'User ${name} successfully updated',
  })
  @ApiNotFoundResponse({ description: "Can't find user" })
  @ApiBadRequestResponse({ description: 'No data' })
  @Patch('/name')
  async updateName(
    @Req() req: RequestDto,
    @Body() updateName: NameDto,
  ): Promise<UserResponse> {
    return this.userService.updateName(updateName, req.userId._id);
  }

  @ApiOperation({ summary: 'Confirm user password' })
  @ApiOkResponse({
    type: ConfirmPasswordResponse,
    description: 'Password confirmed',
  })
  @ApiNotFoundResponse({ description: "Can't find user" })
  @ApiBadRequestResponse({ description: 'No data' })
  @Post('/password')
  async confirmPassword(
    @Req() req: RequestDto,
    @Body() confirmPassword: PasswordDto,
  ): Promise<ConfirmPasswordResponse> {
    return this.userService.confirmPassword(confirmPassword, req.userId._id);
  }

  @ApiOperation({ summary: 'Update user password' })
  @ApiOkResponse({
    type: UserResponse,
    description: 'User ${name} successfully updated',
  })
  @ApiNotFoundResponse({ description: "Can't find user" })
  @ApiForbiddenResponse({ description: "Can't update password" })
  @ApiBadRequestResponse({ description: 'No data' })
  @Patch('/password')
  async updatePassword(
    @Req() req: RequestDto,
    @Body() updatePassword: PasswordDto,
  ): Promise<UserResponse> {
    return this.userService.updatePassword(updatePassword, req.userId._id);
  }

  @ApiOperation({ summary: 'Delete user' })
  @ApiOkResponse({
    type: DeleteUserResponse,
    description: 'User ${user.name} successfully deleted',
  })
  @ApiNotFoundResponse({ description: "Can't find user" })
  @ApiForbiddenResponse({ description: "Can't delete user" })
  @Delete('/me')
  async deleteUser(@Req() req: RequestDto): Promise<DeleteUserResponse> {
    return this.userService.deleteUser(req.userId._id);
  }
}
