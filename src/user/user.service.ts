import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';

import { User, UserDocument } from './schema/user.schema';
import { Task, TaskDocument } from 'src/task/schema/task.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
  ) {}

  private createPasswordHash = async (password: string) => {
    const salt = await bcrypt.genSalt(5);
    const passwordHash = await bcrypt.hash(password, salt);
    return passwordHash;
  };

  private findUser = async (_id: Types.ObjectId) => {
    const user = await this.userModel.findById(_id);
    if (!user) {
      throw new HttpException("Can't find user", HttpStatus.NOT_FOUND);
    }
    return user;
  };

  async getUserByToken(_id: Types.ObjectId) {
    const user = await this.findUser(_id);
    const message = `User ${user.name} successfully logged by token`;
    const { email, name, createdAt, avatarURL } = user;

    return { _id, email, name, createdAt, avatarURL, message };
  }

  async updateName(data: { name: string }, _id: Types.ObjectId) {
    if (!data) {
      throw new HttpException('No data', HttpStatus.BAD_REQUEST);
    }
    const { name } = data;
    const user = await this.findUser(_id);
    if (name === user.name) {
      throw new HttpException('The same name!', HttpStatus.BAD_REQUEST);
    }
    const updatedUser = await this.userModel.findOneAndUpdate(
      { _id },
      { name },
      { returnDocument: 'after' },
    );
    if (!updatedUser) {
      throw new HttpException('Modified forbidden', HttpStatus.FORBIDDEN);
    }
    const { email, createdAt, avatarURL } = updatedUser;
    const message = `User ${name} successfully updated`;

    return { _id, name, email, createdAt, avatarURL, message };
  }

  async confirmPassword(data: { password: string }, _id: Types.ObjectId) {
    if (!data) {
      throw new HttpException('No data', HttpStatus.BAD_REQUEST);
    }
    const { password } = data;
    const user = await this.findUser(_id);
    const isValidPass = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPass) {
      return {
        confirmStatus: false,
        message: 'Wrong password!',
      };
    } else
      return {
        confirmStatus: true,
        message: 'Password confirmed',
      };
  }

  async updatePassword(data: { password: string }, _id: Types.ObjectId) {
    if (!data) {
      throw new HttpException('No data', HttpStatus.BAD_REQUEST);
    }
    const { password } = data;
    const user = await this.findUser(_id);
    const isValidPass = await bcrypt.compare(password, user.passwordHash);
    if (isValidPass) {
      throw new HttpException('The same password!', HttpStatus.BAD_REQUEST);
    }
    const passwordHash = await this.createPasswordHash(password);

    const updatedUser = await this.userModel.findOneAndUpdate(
      { _id },
      { passwordHash },
      { returnDocument: 'after' },
    );
    if (!updatedUser) {
      throw new HttpException('Modified forbidden', HttpStatus.FORBIDDEN);
    }

    const { email, name, createdAt, avatarURL } = updatedUser;
    const message = `User ${name} successfully updated`;

    return { _id, name, email, createdAt, avatarURL, message };
  }

  async deleteUser(_id: Types.ObjectId) {
    const user = await this.findUser(_id);
    const taskStatus = await this.taskModel.deleteMany({ author: _id });
    const userStatus = await this.userModel.deleteOne({ _id });
    const message = `User ${user.name} successfully deleted`;

    return { userStatus, taskStatus, message };
  }
}
