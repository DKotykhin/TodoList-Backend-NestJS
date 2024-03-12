import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { User } from '../user/schema/user.schema';
import { PasswordHash } from '../utils/passwordHash.util';

const user = {
  _id: '1',
  email: 'kotykhin_dmytro@ukr.net',
  name: 'Dmytro Kotykhin',
  createdAt: Date.now(),
};

const mockAuthService = {
  findOne: jest.fn(() => user),
  create: jest.fn(() => user),
};
const mockJwtService = {
  sign: jest.fn(() => 'token'),
};
const mockPasswordHash = {
  create: jest.fn(() => 'passwordHash'),
  compare: jest.fn(() => true),
};

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: mockAuthService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: PasswordHash,
          useValue: mockPasswordHash,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should register user', async () => {
    const registerInput = {
      email: user.email,
      name: user.name,
      password: '12345678',
    };

    mockAuthService.findOne.mockReturnValue(null);
    mockAuthService.create.mockReturnValue(user);
    mockJwtService.sign.mockReturnValue('token');
    const result = await authService.register(registerInput);
    expect(result).toEqual({
      ...user,
      token: 'token',
      message: `User ${user.name} successfully created`,
    });
  });

  it('should not register user', async () => {
    const registerInput = {
      email: user.email,
      name: user.name,
      password: '12345678',
    };

    mockAuthService.findOne.mockReturnValue(user);
    try {
      await authService.register(registerInput);
    } catch (e) {
      expect(e.message).toBe(`User ${user.email} already exists`);
    }
  });

  it('should not login user', async () => {
    const loginInput = {
      email: user.email,
      password: '12345678',
    };
    mockAuthService.findOne.mockReturnValue(user);
    mockJwtService.sign.mockReturnValue('token');
    try {
      await PasswordHash.compare(
        loginInput.password,
        'passwordHash',
        'Invalid password',
      );
    } catch (e) {
      expect(e.message).toBe('Invalid password');
    }
  });
});
