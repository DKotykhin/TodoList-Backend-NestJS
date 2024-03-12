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
  Param,
} from '@nestjs/common';

import { AuthGuard } from '../auth/auth.guard';
import { TaskService } from './task.service';
import { QueryDto } from './dto/query.dto';
import { CreateTaskDto, TaskDto, UpdateTaskDto } from './dto/task.dto';
import {
  TaskResponse,
  DeleteTaskResponse,
  GetTasksResponse,
} from './dto/task-response.dto';
import { RequestDto } from '../user/dto/request.dto';
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
  @ApiOkResponse({ type: GetTasksResponse })
  @Get()
  async getTasks(
    @Req() req: RequestDto,
    @Query() query: QueryDto,
  ): Promise<GetTasksResponse> {
    return this.taskService.get(query, req.userId._id);
  }

  @ApiOperation({ summary: 'Get task by id' })
  @ApiOkResponse({ type: TaskDto })
  @Get('/:id')
  async getTaskById(
    @Req() req: RequestDto,
    @Param('id') _id: string,
  ): Promise<TaskDto> {
    return this.taskService.getTaskById(_id, req.userId._id);
  }

  @ApiOperation({ summary: 'Create task' })
  @ApiOkResponse({
    type: TaskResponse,
    description: 'Task successfully created',
  })
  @ApiForbiddenResponse({ description: "Can't create task" })
  @Post()
  async createTask(
    @Req() req: RequestDto,
    @Body() createTask: CreateTaskDto,
  ): Promise<TaskResponse> {
    return this.taskService.create(createTask, req.userId._id);
  }

  @ApiOperation({ summary: 'Update task' })
  @ApiOkResponse({
    type: TaskResponse,
    description: 'Task successfully updated',
  })
  @ApiForbiddenResponse({ description: "Can't update task" })
  @Patch()
  async updateTask(
    @Req() req: RequestDto,
    @Body() updateTask: UpdateTaskDto,
  ): Promise<TaskResponse> {
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
