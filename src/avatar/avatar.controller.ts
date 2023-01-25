import {
  Controller,
  Post,
  Delete,
  UseInterceptors,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { UploadedFile } from '@nestjs/common/decorators';
import {
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common/pipes';
import { JwtService } from '@nestjs/jwt';
import { FileInterceptor } from '@nestjs/platform-express';

import { AuthGuard } from 'src/auth/auth.guard';
import { UserResponse } from 'src/user/dto/response-user.dto';
import { AvatarService } from './avatar.service';

@UseGuards(AuthGuard)
@Controller('avatar')
export class AvatarController {
  constructor(
    private readonly jwtServise: JwtService,
    private readonly avatarService: AvatarService,
  ) {}

  private getUserId = async (authorization: string) => {
    const token = authorization.split(' ')[1];
    const user = this.jwtServise.verify(token);
    return user;
  };

  @Post()
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadFile(
    @Headers('authorization') authorization: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: 'image/jpeg' || 'image/png' || 'image/webp',
          }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 }),
        ],
      }),
    )
    avatar: Express.Multer.File,
  ): Promise<UserResponse> {
    const user = await this.getUserId(authorization);
    return this.avatarService.createAvatar(user._id, avatar);
  }

  @Delete()
  async deleteAvatar(
    @Headers('authorization') authorization: string,
  ): Promise<UserResponse> {
    const user = await this.getUserId(authorization);
    return this.avatarService.delete(user._id);
  }
}
