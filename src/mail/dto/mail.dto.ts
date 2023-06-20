import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { PasswordDto } from 'src/auth/dto/user-auth.dto';

export class NewPasswordDto extends PasswordDto {
  @ApiProperty({ example: 'fe826d3c809e9414e7da6797f1a2981a' })
  @IsString()
  readonly token: string;
}
