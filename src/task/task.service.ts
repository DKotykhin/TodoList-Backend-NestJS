import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Task, TaskDocument } from './schema/task.schema';
import { QueryDto } from './dto/query.dto';
import { CreateTaskDto, TaskDto } from './dto/task.dto';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async get(param: QueryDto, userId: Types.ObjectId) {
    const { limit, page, tabKey, sortField, sortOrder, search } = param;

    const parseLimit = parseInt(limit);
    const tasksOnPage = parseLimit > 0 ? parseLimit : 6;

    const parsePage = parseInt(page);
    const pageNumber = parsePage > 0 ? parsePage : 1;

    const parseSortField =
      sortField === 'createdAt'
        ? sortField
        : sortField === 'deadline'
        ? sortField
        : sortField === 'title'
        ? sortField
        : 'createdAt';
    const parseSortOrder =
      parseInt(sortOrder) === -1 ? -1 : parseInt(sortOrder) === 1 ? 1 : -1;

    const map = new Map();
    map.set(parseSortField, parseSortOrder);
    const sortKey = Object.fromEntries(map);

    let taskFilter = {};
    switch (tabKey) {
      case '1':
        taskFilter = { author: userId, completed: false };
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
      .find(taskFilter, {
        title: true,
        subtitle: true,
        description: true,
        completed: true,
        createdAt: true,
        deadline: true,
      })
      .sort(sortKey)
      .limit(tasksOnPage)
      .skip((pageNumber - 1) * tasksOnPage);

    const tasksOnPageQty = tasks.length;

    return { totalTasksQty, totalPagesQty, tasksOnPageQty, tasks };
  }

  async create(data: CreateTaskDto, userId: Types.ObjectId) {
    const { title, subtitle, description, completed, deadline } = data;
    const doc = new this.taskModel({
      title,
      subtitle,
      description,
      completed,
      deadline,
      author: userId,
    });
    const task = await doc.save();
    if (!task) {
      throw new HttpException("Can't create task", HttpStatus.FORBIDDEN);
    }
    const { _id, createdAt } = task;
    const message = 'Task successfully created';

    return {
      _id,
      title,
      subtitle,
      description,
      completed,
      deadline,
      createdAt,
      message,
    };
  }

  async update(data: TaskDto, userId: Types.ObjectId) {
    const { title, subtitle, description, _id, completed, deadline } = data;

    const updatedTask = await this.taskModel.findOneAndUpdate(
      { _id, author: userId },
      {
        $set: {
          title,
          subtitle,
          description,
          completed,
          deadline,
        },
      },
      { returnDocument: 'after' },
    );
    if (!updatedTask) {
      throw new HttpException('Modified forbidden', HttpStatus.FORBIDDEN);
    }
    const { createdAt } = updatedTask;
    const message = 'Task successfully updated';

    return {
      _id,
      title,
      subtitle,
      description,
      completed,
      deadline,
      createdAt,
      message,
    };
  }

  async delete(taskId: { _id: Types.ObjectId }, userId: Types.ObjectId) {
    const { _id } = taskId;

    const taskStatus = await this.taskModel.deleteOne({ _id, author: userId });
    if (!taskStatus.deletedCount) {
      throw new HttpException('Deleted forbidden', HttpStatus.FORBIDDEN);
    }
    const message = 'Task successfully deleted';

    return { taskStatus, message };
  }
}
