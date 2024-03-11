import { Body, Patch, Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';

import {
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { MailService } from './mail.service';

import { UserResponseDto } from '../user/dto/user-response.dto';
import { LoginDto } from '../auth/dto/auth.dto';
import { NewPasswordDto } from './dto/mail.dto';
import { ResponseDto } from './dto/mail-response.dto';

@ApiTags('Mail')
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @ApiOperation({ summary: 'Reset user password' })
  @ApiOkResponse({
    type: ResponseDto,
    description: 'Email successfully sent to user',
  })
  @ApiForbiddenResponse({ description: 'Modified forbidden' })
  @Post('/reset')
  async resetUserPassword(
    @Body() email: Pick<LoginDto, 'email'>,
  ): Promise<ResponseDto> {
    return this.mailService.resetUserPassword(email);
  }

  @ApiOperation({ summary: 'Set new password' })
  @ApiOkResponse({
    type: UserResponseDto,
    description: 'Successfully set new password',
  })
  @ApiForbiddenResponse({ description: "Can't set new password" })
  @Patch('/reset')
  async setNewPassword(@Body() body: NewPasswordDto): Promise<UserResponseDto> {
    return this.mailService.setNewPassword(body);
  }
}
