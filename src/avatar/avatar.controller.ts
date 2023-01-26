import {
  Controller,
  Post,
  Delete,
  UseInterceptors,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UploadedFile } from '@nestjs/common/decorators';
import {
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common/pipes';
import { FileInterceptor } from '@nestjs/platform-express';

import { AuthGuard } from 'src/auth/auth.guard';
import { RequestDto } from 'src/user/dto/request.dto';
import { UserResponse } from 'src/user/dto/response-user.dto';
import { AvatarService } from './avatar.service';

@UseGuards(AuthGuard)
@Controller('avatar')
export class AvatarController {
  constructor(private readonly avatarService: AvatarService) {}

  @Post()
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadFile(
    @Req() req: RequestDto,
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
    return this.avatarService.createAvatar(req.userId._id, avatar);
  }

  @Delete()
  async deleteAvatar(@Req() req: RequestDto): Promise<UserResponse> {
    return this.avatarService.delete(req.userId._id);
  }
}
