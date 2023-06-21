import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as fs from 'fs';

import { PasswordHash } from 'src/utils/passwordHash.util';
import { Task, TaskDocument } from 'src/task/schema/task.schema';
import { User, UserDocument } from './schema/user.schema';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
  ) {}

  private findUser = async (_id: Types.ObjectId) => {
    const user = await this.userModel.findById(_id);
    if (!user) {
      throw new HttpException("Can't find user", HttpStatus.NOT_FOUND);
    }
    return user;
  };

  private userFields = (user: UserDto) => {
    const { _id, email, name, createdAt, avatarURL } = user;
    return { _id, email, name, createdAt, avatarURL };
  };

  async getUserByToken(_id: Types.ObjectId) {
    const user = await this.findUser(_id);
    const message = `User ${user.name} successfully logged by token`;

    return { ...this.userFields(user), message };
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
      { new: true },
    );
    if (!updatedUser) {
      throw new HttpException('Modified forbidden', HttpStatus.FORBIDDEN);
    }
    const message = `User ${updatedUser.name} successfully updated`;

    return { ...this.userFields(updatedUser), message };
  }

  async confirmPassword(data: { password: string }, _id: Types.ObjectId) {
    if (!data) {
      throw new HttpException('No data', HttpStatus.BAD_REQUEST);
    }
    const { password } = data;
    const user = await this.findUser(_id);
    await PasswordHash.compare(password, user.passwordHash, 'Wrong password!');
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
    await PasswordHash.same(password, user.passwordHash, 'The same password!');

    const passwordHash = await PasswordHash.create(password);

    const updatedUser = await this.userModel.findOneAndUpdate(
      { _id },
      { passwordHash },
      { new: true },
    );
    if (!updatedUser) {
      throw new HttpException("Can't update password", HttpStatus.FORBIDDEN);
    }
    const message = `User ${updatedUser.name} successfully updated`;

    return { ...this.userFields(updatedUser), message };
  }

  async deleteUser(_id: Types.ObjectId) {
    const user = await this.findUser(_id);
    if (user.avatarURL) {
      fs.unlink('static' + user.avatarURL, async (err) => {
        if (err) {
          throw new HttpException("Can't delete avatar", HttpStatus.FORBIDDEN);
        }
      });
    }
    const taskStatus = await this.taskModel.deleteMany({ author: _id });
    const userStatus = await this.userModel.deleteOne({ _id });
    const message = `User ${user.name} successfully deleted`;

    return { userStatus, taskStatus, message };
  }

  async statistic(_id: Types.ObjectId) {
    const totalTasks = this.taskModel.countDocuments({ author: _id });
    const completedTasks = this.taskModel.countDocuments({
      author: _id,
      completed: true,
    });
    const overdueTasks = this.taskModel.countDocuments({
      author: _id,
      deadline: { $lt: new Date() },
      completed: false,
    });
    const values = Promise.all([totalTasks, completedTasks, overdueTasks]).then(
      (values) => {
        const activeTasks = values[0] - values[1];
        const message = 'Task statistic successfully obtained';
        return {
          totalTasks: values[0],
          completedTasks: values[1],
          activeTasks,
          overdueTasks: values[2],
          message,
        };
      },
    );

    return values;
  }
}
