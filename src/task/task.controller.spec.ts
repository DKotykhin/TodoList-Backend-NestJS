import { Test, TestingModule } from '@nestjs/testing';
import { Types, Schema } from 'mongoose';

import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { AuthGuard } from '../auth/auth.guard';
import { RequestDto } from '../user/dto/request.dto';
import { CreateTaskDto } from './dto/task.dto';

const newTask = {
  title: 'New title',
  subtitle: 'New subtitle',
  description: 'New description',
  completed: false,
  deadline: new Date() as unknown as Schema.Types.Date,
};

const mockTaskService = {
  create: jest.fn((dto) => {
    return {
      id: 1,
      ...dto,
    };
  }),
  delete: jest.fn(() => {
    return {
      message: 'Task successfully deleted',
    };
  }),
};

const mockAuthGuard = {
  canActivate: jest.fn(() => {
    return true;
  }),
};

describe('TaskController', () => {
  let controller: TaskController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [TaskService],
    })
      .overrideProvider(TaskService)
      .useValue(mockTaskService)
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<TaskController>(TaskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create task', async () => {
    const createTaskDto: CreateTaskDto = newTask;
    const requestDto: Pick<RequestDto, 'userId'> = {
      userId: {
        _id: new Types.ObjectId(),
      },
    };
    expect(
      await controller.createTask(requestDto as RequestDto, createTaskDto),
    ).toEqual({
      id: 1,
      ...newTask,
    });
  });

  it('should delete task', async () => {
    const requestDto: Pick<RequestDto, 'userId'> = {
      userId: {
        _id: new Types.ObjectId(),
      },
    };
    const taskId = '1';
    expect(
      await controller.deleteTask(requestDto as RequestDto, taskId),
    ).toEqual({
      message: 'Task successfully deleted',
    });
  });
});
