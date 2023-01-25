import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';

import { LoginDto } from './dto/login-user.dto';
import { RegisterDto } from './dto/register-user.dto';
import { User, UserDocument } from '../user/schema/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  private createPasswordHash = async (password: string) => {
    const salt = await bcrypt.genSalt(5);
    const passwordHash = await bcrypt.hash(password, salt);
    return passwordHash;
  };

  async register(registerInput: RegisterDto) {
    const { email, name, password } = registerInput;
    const candidat = await this.userModel.findOne({ email });
    if (candidat) {
      throw new HttpException(
        `User ${email} already exist`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const passwordHash = await this.createPasswordHash(password);
    const user = await this.userModel.create({
      email,
      passwordHash,
      name,
    });
    const { _id, createdAt } = user;
    const token = this.jwtService.sign({ _id: user._id });
    const message = `User ${name} successfully created`;

    return { _id, email, name, createdAt, token, message };
  }

  async login(loginInput: LoginDto) {
    const { email, password } = loginInput;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new HttpException(
        'Incorrect login or password',
        HttpStatus.BAD_REQUEST,
      );
    }
    const isValidPass = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPass) {
      throw new HttpException(
        'Incorrect login or password',
        HttpStatus.BAD_REQUEST,
      );
    }
    const token = this.jwtService.sign({ _id: user._id });
    const { _id, createdAt, name, avatarURL } = user;
    const message = `User ${name} successfully logged`;

    return { _id, email, name, createdAt, avatarURL, token, message };
  }
}
