import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';

import * as crypto from 'crypto';
import { Model } from 'mongoose';

import { User, UserDocument } from '../user/schema/user.schema';
import { PasswordHash } from '../utils/passwordHash.util';

import { NewPasswordDto } from './dto/mail.dto';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private config: ConfigService,
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
    const url = `${this.config.get('FRONT_URL')}/auth/reset/${token}`;

    const updatedUser = await this.userModel.findOneAndUpdate(
      { email },
      {
        'resetPassword.token': token,
        'resetPassword.expire': Date.now() + 3600 * 1000,
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
      throw new HttpException("Can't set new password", HttpStatus.FORBIDDEN);
    } else
      return {
        ...updatedUser['_doc'],
        message: 'Successfully set new password',
      };
  }
}
