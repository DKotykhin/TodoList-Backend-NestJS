import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Req,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from 'src/auth/auth.guard';
import { TaskService } from './task.service';
import { QueryDto } from './dto/query.dto';
import { CreateTaskDto, TaskDto } from './dto/task.dto';
import {
  CreateTaskResponse,
  DeleteTaskResponse,
  GetTaskResponse,
} from './dto/response-task.dto';
import { RequestDto } from 'src/user/dto/request.dto';

@UseGuards(AuthGuard)
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  async getTask(
    @Req() req: RequestDto,
    @Query() query: QueryDto,
  ): Promise<GetTaskResponse> {
    return this.taskService.get(query, req.userId._id);
  }

  @Post()
  async creare(
    @Req() req: RequestDto,
    @Body() createTask: CreateTaskDto,
  ): Promise<CreateTaskResponse> {
    return this.taskService.create(createTask, req.userId._id);
  }

  @Patch()
  async update(
    @Req() req: RequestDto,
    @Body() updateTask: TaskDto,
  ): Promise<CreateTaskResponse> {
    return this.taskService.update(updateTask, req.userId._id);
  }

  @Delete()
  async delete(
    @Req() req: RequestDto,
    @Body('_id') _id: string,
  ): Promise<DeleteTaskResponse> {
    return this.taskService.delete(_id, req.userId._id);
  }
}
