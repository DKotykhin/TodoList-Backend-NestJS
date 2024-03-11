import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { UserService } from './user.service';

const user = {
  email: 'kotykhin_d@ukr.net',
  name: 'Dmytro',
  avatarURL: 'https://www.google.com',
  createdAt: Date.now(),
};

const mockUserModel = {
  findById: jest.fn((id) => ({
    _id: id,
    email: user.email,
    name: user.name,
    avatarURL: user.avatarURL,
    createdAt: user.createdAt,
  })),
  findOneAndUpdate: jest.fn((id, data) => ({
    _id: id._id,
    email: user.email,
    name: data.name,
    avatarURL: user.avatarURL,
    createdAt: user.createdAt,
  })),
};
const mockTaskModel = {
  create: jest.fn(),
  update: jest.fn(),
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useValue: mockUserModel,
        },
        {
          provide: getModelToken('Task'),
          useValue: mockTaskModel,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get user by token', async () => {
    const userId = new Types.ObjectId();
    const user = await service.getUserByToken(userId);
    expect(user).toEqual({
      ...user,
      _id: userId,
      message: 'User Dmytro successfully logged by token',
    });
  });

  it('should update user name', async () => {
    const userId = new Types.ObjectId();
    const name = 'Dmytro Kotykhin';
    const updatedUser = await service.updateName({ name }, userId);
    expect(updatedUser).toEqual({
      ...user,
      _id: userId,
      name,
      message: 'User Dmytro Kotykhin successfully updated',
    });
  });
});
