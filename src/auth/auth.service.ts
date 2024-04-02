import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response } from 'express';

import { LoginDto, RegisterDto } from './dto/auth.dto';
import { User, UserDocument } from '../user/schema/user.schema';
import { PasswordHash } from '../utils/passwordHash.util';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerInput: RegisterDto) {
    const { email, name, password } = registerInput;
    const candidate = await this.userModel.findOne({ email });
    if (candidate) {
      throw new HttpException(
        `User ${email} already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const passwordHash = await PasswordHash.create(password);
    const user = await this.userModel.create({
      email,
      passwordHash,
      name,
    });
    const { _id, createdAt } = user;
    const token = this.jwtService.sign({ _id });
    const message = `User ${name} successfully created`;

    return { _id, email, name, createdAt, token, message };
  }

  async login(loginInput: LoginDto, response: Response) {
    const { email, password } = loginInput;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new HttpException(
        'Incorrect login or password',
        HttpStatus.UNAUTHORIZED,
      );
    }
    await PasswordHash.compare(
      password,
      user.passwordHash,
      'Incorrect login or password',
    );
    const { _id, createdAt, name, avatarURL } = user;
    const token = this.jwtService.sign({ _id });
    response.cookie('token', token, { httpOnly: true });
    const message = `User ${name} successfully logged`;

    return { _id, email, name, createdAt, avatarURL, token, message };
  }
}
