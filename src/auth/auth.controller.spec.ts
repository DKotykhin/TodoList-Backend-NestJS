import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { RegisterDto, LoginDto } from './dto/auth.dto';

const user = {
  id: 1,
  email: 'kotykhin_d@ukr.net',
  name: 'Dmytro',
};

const mockAuthService = {
  register: jest.fn((dto) => {
    return {
      id: 1,
      email: dto.email,
      name: dto.name,
      token: 'token',
    };
  }),
  login: jest.fn((dto) => {
    return {
      id: 2,
      email: dto.email,
      name: user.name,
      token: 'another token',
    };
  }),
};

const mockAuthGuard = {
  canActivate: jest.fn(() => {
    return true;
  }),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should register user', async () => {
    const registerDto: RegisterDto = {
      email: user.email,
      name: user.name,
      password: 'password',
    };
    expect(await controller.register(registerDto)).toEqual({
      id: 1,
      email: user.email,
      name: user.name,
      token: 'token',
    });
  });

  it('should login user', async () => {
    const loginDto: LoginDto = {
      email: user.email,
      password: 'password',
    };
    expect(await controller.login(loginDto)).toEqual({
      id: 2,
      email: user.email,
      name: user.name,
      token: 'another token',
    });
  });
});
