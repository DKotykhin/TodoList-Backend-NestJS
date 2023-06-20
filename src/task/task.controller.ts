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
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import {
  CreateTaskResponse,
  DeleteTaskResponse,
  GetTaskResponse,
} from './dto/response-task.dto';
import { RequestDto } from 'src/user/dto/request.dto';
import {
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Tasks')
@UseGuards(AuthGuard)
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @ApiOperation({ summary: 'Get all task' })
  @ApiOkResponse({ type: GetTaskResponse })
  @Get()
  async getTask(
    @Req() req: RequestDto,
    @Query() query: QueryDto,
  ): Promise<GetTaskResponse> {
    return this.taskService.get(query, req.userId._id);
  }

  @ApiOperation({ summary: 'Create task' })
  @ApiOkResponse({
    type: CreateTaskResponse,
    description: 'Task successfully created',
  })
  @ApiForbiddenResponse({ description: "Can't create task" })
  @Post()
  async createTask(
    @Req() req: RequestDto,
    @Body() createTask: CreateTaskDto,
  ): Promise<CreateTaskResponse> {
    return this.taskService.create(createTask, req.userId._id);
  }

  @ApiOperation({ summary: 'Update task' })
  @ApiOkResponse({
    type: CreateTaskResponse,
    description: 'Task successfully updted',
  })
  @ApiForbiddenResponse({ description: "Can't update task" })
  @Patch()
  async updateTask(
    @Req() req: RequestDto,
    @Body() updateTask: UpdateTaskDto,
  ): Promise<CreateTaskResponse> {
    return this.taskService.update(updateTask, req.userId._id);
  }

  @ApiOperation({ summary: 'Delete task' })
  @ApiOkResponse({
    type: DeleteTaskResponse,
    description: 'Task successfully deleted',
  })
  @ApiForbiddenResponse({ description: "Can't delete task" })
  @Delete()
  async deleteTask(
    @Req() req: RequestDto,
    @Body('_id') _id: string,
  ): Promise<DeleteTaskResponse> {
    return this.taskService.delete(_id, req.userId._id);
  }
}
