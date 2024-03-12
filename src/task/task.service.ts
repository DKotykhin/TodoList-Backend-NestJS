import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Task, TaskDocument } from './schema/task.schema';
import { QueryDto } from './dto/query.dto';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
  ) {}

  async get(param: QueryDto, userId: Types.ObjectId) {
    const { limit, page, tabKey, sortField, sortOrder, search } = param;

    const parseLimit = parseInt(limit);
    const tasksOnPage = parseLimit > 0 ? parseLimit : 6;

    const parsePage = parseInt(page);
    const pageNumber = parsePage > 0 ? parsePage : 1;

    const parseSortOrder =
      parseInt(sortOrder) === -1 ? -1 : parseInt(sortOrder) === 1 ? 1 : 1;

    let sortKey = {};
    switch (sortField) {
      case 'createdAt':
        sortKey = { [sortField]: -parseSortOrder };
        break;
      case 'deadline':
        sortKey = { [sortField]: parseSortOrder };
        break;
      case 'title':
        sortKey = { [sortField]: parseSortOrder };
        break;
      default:
        sortKey = { createdAt: 1 };
    }

    let taskFilter = {};
    switch (tabKey) {
      case '0':
        taskFilter = { author: userId, completed: false };
        break;
      case '1':
        taskFilter = {
          author: userId,
          deadline: { $lt: new Date() },
          completed: false,
        };
        break;
      case '2':
        taskFilter = { author: userId, completed: true };
        break;
      default:
        taskFilter = { author: userId };
    }

    if (search)
      taskFilter = { ...taskFilter, title: { $regex: search, $options: 'i' } };

    const totalTasksQty = (await this.taskModel.find(taskFilter)).length;
    const totalPagesQty = Math.ceil(totalTasksQty / tasksOnPage);

    const tasks = await this.taskModel
      .find(taskFilter, { author: false })
      .sort(sortKey)
      .limit(tasksOnPage)
      .skip((pageNumber - 1) * tasksOnPage);

    const tasksOnPageQty = tasks.length;

    return { totalTasksQty, totalPagesQty, tasksOnPageQty, tasks };
  }

  async getTaskById(_id: string, userId: Types.ObjectId) {
    try {
      const task = await this.taskModel.findOne(
        { _id, author: userId },
        { author: false },
      );
      return task;
    } catch (error) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }
  }

  async create(data: CreateTaskDto, userId: Types.ObjectId) {
    const doc = new this.taskModel({
      ...data,
      author: userId,
    });
    const task = await doc.save();
    if (!task) {
      throw new HttpException("Can't create task", HttpStatus.FORBIDDEN);
    }
    const message = 'Task successfully created';

    return { task, message };
  }

  async update(data: UpdateTaskDto, userId: Types.ObjectId) {
    const { title, subtitle, description, _id, completed, deadline } = data;

    let completedAt = null;
    if (completed) completedAt = new Date();
    const task = await this.taskModel.findOneAndUpdate(
      { _id, author: userId },
      {
        $set: {
          title,
          subtitle,
          description,
          completed,
          deadline,
          completedAt,
        },
      },
      { new: true, fields: { author: false } },
    );
    if (!task) {
      throw new HttpException("Can't update task", HttpStatus.FORBIDDEN);
    }
    const message = 'Task successfully updated';

    return { task, message };
  }

  async delete(_id: string, userId: Types.ObjectId) {
    const taskStatus = await this.taskModel.deleteOne({ _id, author: userId });
    if (!taskStatus.deletedCount) {
      throw new HttpException("Can't delete task", HttpStatus.FORBIDDEN);
    }
    const message = 'Task successfully deleted';

    return { taskStatus, message };
  }
}
