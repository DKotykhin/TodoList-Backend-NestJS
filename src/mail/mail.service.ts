import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from 'src/user/schema/user.schema';
import { NewPasswordDto } from './dto/mail.dto';

import * as crypto from 'crypto';
import { PasswordHash } from 'src/utils/passwordHash.util';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async resetUserPassword({ email }) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new HttpException("Can't find user", HttpStatus.NOT_FOUND);
    }
    const buffer = crypto.randomBytes(16);
    if (!buffer)
      throw new HttpException(
        'Something get wrong',
        HttpStatus.EXPECTATION_FAILED,
      );
    const token = buffer.toString('hex');
    const url = `https://mytodolist.fun/auth/reset/${token}`;

    const updatedUser = await this.userModel.findOneAndUpdate(
      { email },
      {
        'resetPassword.token': token,
        'resetPassword.expire': Date.now() + 3600 * 1000,
        'resetPassword.changed': Date.now(),
      },
      { new: true },
    );
    if (!updatedUser) {
      throw new HttpException('Modified forbidden', HttpStatus.FORBIDDEN);
    }

    return this.mailerService
      .sendMail({
        to: email,
        subject: 'Restore password',
        text: 'Please, follow the link to set new password',
        template: './password',
        context: {
          name: user.name,
          url,
        },
      })
      .then((status) => {
        return {
          status: status.response,
          message: `Email successfully sent to ${status.accepted}`,
        };
      })
      .catch((err) => {
        throw new HttpException(
          err.message || "Can't send mail",
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      });
  }

  async setNewPassword(body: NewPasswordDto) {
    const { token, password } = body;
    const passwordHash = await PasswordHash.create(password);
    const updatedUser = await this.userModel.findOneAndUpdate(
      {
        'resetPassword.token': token,
        'resetPassword.expire': { $gt: Date.now() },
      },
      {
        $set: {
          passwordHash,
          'resetPassword.token': null,
          'resetPassword.expire': null,
          'resetPassword.changed': Date.now(),
        },
      },
      { new: true },
    );
    if (!updatedUser) {
      throw new HttpException('Modified forbidden', HttpStatus.FORBIDDEN);
    } else return updatedUser;
  }
}
