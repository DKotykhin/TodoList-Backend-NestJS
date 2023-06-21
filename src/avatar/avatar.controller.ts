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
import {
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { AvatarService } from './avatar.service';
import { AuthGuard } from 'src/auth/auth.guard';

import { RequestDto } from 'src/user/dto/request.dto';
import { UserResponseDto } from 'src/user/dto/user-response.dto';

@ApiTags('Avatar')
@UseGuards(AuthGuard)
@Controller('avatar')
export class AvatarController {
  constructor(private readonly avatarService: AvatarService) {}

  @ApiOperation({ summary: 'Create avatar' })
  @ApiOkResponse({
    type: UserResponseDto,
    description: 'Avatar successfully created',
  })
  @ApiForbiddenResponse({ description: "Can't create avatar" })
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
  ): Promise<UserResponseDto> {
    return this.avatarService.createAvatar(req.userId._id, avatar);
  }

  @ApiOperation({ summary: 'Delete avatar' })
  @ApiOkResponse({
    type: UserResponseDto,
    description: 'Avatar successfully deleted',
  })
  @ApiForbiddenResponse({ description: "Can't delete avatar" })
  @Delete()
  async deleteAvatar(@Req() req: RequestDto): Promise<UserResponseDto> {
    return this.avatarService.deleteAvatar(req.userId._id);
  }
}
