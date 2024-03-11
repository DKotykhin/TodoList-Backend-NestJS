import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { RegisterDto } from '../auth/dto/auth.dto';
import { RequestDto } from './dto/request.dto';

const user = {
  id: 1,
  email: 'kotykhin_d@ukr.net',
  name: 'Dmytro',
};

const mockUserService = {
  getUserByToken: jest.fn(() => {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }),
  updateName: jest.fn((dto) => {
    return {
      ...dto,
      id: 2,
      email: user.email,
    };
  }),
};

const mockAuthGuard = {
  canActivate: jest.fn(() => {
    return true;
  }),
};
describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get user by token', async () => {
    const requestDto: Pick<RequestDto, 'userId'> = {
      userId: {
        _id: new Types.ObjectId(),
      },
    };
    expect(await controller.getUserByToken(requestDto as RequestDto)).toEqual({
      id: 1,
      email: user.email,
      name: user.name,
    });
  });

  it('should update user name', async () => {
    const requestDto: Pick<RequestDto, 'userId'> = {
      userId: {
        _id: new Types.ObjectId(),
      },
    };
    const newName: Pick<RegisterDto, 'name'> = { name: 'Dmytro' };
    expect(
      await controller.updateName(requestDto as RequestDto, newName),
    ).toEqual({
      id: 2,
      email: user.email,
      name: user.name,
    });
  });
});
