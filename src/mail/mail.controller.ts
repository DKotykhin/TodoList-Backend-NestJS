import { Body, Patch, Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';

import { MailService } from './mail.service';
import { NewPasswordDto } from './dto/mail.dto';
import { UserDto } from 'src/user/dto/user.dto';
import { ResponseDto } from './dto/mail-response.dto';
import { LoginDto } from 'src/auth/dto/user-auth.dto';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('/reset')
  async resetUserPassword(
    @Body() email: Pick<LoginDto, 'email'>,
  ): Promise<ResponseDto> {
    return this.mailService.resetUserPassword(email);
  }

  @Patch('/reset')
  async setNewPassword(@Body() body: NewPasswordDto): Promise<UserDto> {
    return this.mailService.setNewPassword(body);
  }
}
