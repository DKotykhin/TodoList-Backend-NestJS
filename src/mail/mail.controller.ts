import { Body, Patch, Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';

import { MailService } from './mail.service';
import { EmailDto, NewPasswordDto } from './dto/mail.dto';
import { UserDto } from 'src/user/dto/user.dto';
import { ResponseDto } from './dto/response.dto';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('/reset')
  async resetUserPassword(@Body() email: EmailDto): Promise<ResponseDto> {
    return this.mailService.resetUserPassword(email);
  }

  @Patch('/reset')
  async setNewPassword(@Body() body: NewPasswordDto): Promise<UserDto> {
    return this.mailService.setNewPassword(body);
  }
}
