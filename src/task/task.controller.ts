import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Headers,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';

import { AuthGuard } from 'src/auth/auth.guard';
import { TaskService } from './task.service';
import { QueryDto } from './dto/query.dto';
import { CreateTaskDto, TaskDto } from './dto/task.dto';
import {
  CreateTaskResponse,
  DeleteTaskResponse,
  GetTaskResponse,
} from './dto/response-task.dto';

@UseGuards(AuthGuard)
@Controller('task')
export class TaskController {
  constructor(
    private taskService: TaskService,
    private jwtServise: JwtService,
  ) {}

  private getUserId = async (authorization: string) => {
    const token = authorization.split(' ')[1];
    const user = this.jwtServise.verify(token);
    return user;
  };

  @Get()
  async getTask(
    @Headers('authorization') authorization: string,
    @Query() query: QueryDto,
  ): Promise<GetTaskResponse> {
    const user = await this.getUserId(authorization);
    return this.taskService.get(query, user._id);
  }

  @Post()
  async creare(
    @Headers('authorization') authorization: string,
    @Body() createTask: CreateTaskDto,
  ): Promise<CreateTaskResponse> {
    const user = await this.getUserId(authorization);
    return this.taskService.create(createTask, user._id);
  }

  @Patch()
  async update(
    @Headers('authorization') authorization: string,
    @Body() updateTask: TaskDto,
  ): Promise<CreateTaskResponse> {
    const user = await this.getUserId(authorization);
    return this.taskService.update(updateTask, user._id);
  }

  @Delete()
  async delete(
    @Headers('authorization') authorization: string,
    @Body() deleteTask: { _id: Types.ObjectId },
  ): Promise<DeleteTaskResponse> {
    const user = await this.getUserId(authorization);
    return this.taskService.delete(deleteTask, user._id);
  }
}
