import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model, Types } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';

import { User, UserDocument } from '../user/schema/user.schema';
import { UserDto } from '../user/dto/user.dto';

@Injectable()
export class AvatarService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  private userFields = (user: UserDto) => {
    if (!user) {
      throw new HttpException('Modified forbidden', HttpStatus.FORBIDDEN);
    }
    const { _id, email, name, createdAt, avatarURL } = user;
    return { _id, email, name, createdAt, avatarURL };
  };

  async createAvatar(_id: Types.ObjectId, avatar: Express.Multer.File) {
    try {
      const fileName = _id + '-' + avatar.fieldname + '.webp';
      const filePath = 'static/upload';
      const avatarURL = `/upload/${fileName}`;
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      const file = await sharp(avatar.buffer).webp().resize(200).toBuffer();
      fs.writeFileSync(path.join(filePath, fileName), file);
      const updatedUser = await this.userModel.findOneAndUpdate(
        { _id },
        { avatarURL },
        { new: true },
      );
      const message = 'Avatar successfully created';

      return { ...this.userFields(updatedUser), message };
    } catch (err) {
      throw new HttpException("Can't create avatar", HttpStatus.FORBIDDEN);
    }
  }

  async deleteAvatar(_id: Types.ObjectId) {
    const user = await this.userModel.findById(_id);
    fs.unlink('static' + user.avatarURL, async (err) => {
      if (err) {
        throw new HttpException("Can't delete avatar", HttpStatus.FORBIDDEN);
      }
    });
    const updatedUser = await this.userModel.findOneAndUpdate(
      { _id },
      { $unset: { avatarURL: '' } },
      { new: true },
    );
    const message = 'Avatar successfully deleted';

    return { ...this.userFields(updatedUser), message };
  }
}
