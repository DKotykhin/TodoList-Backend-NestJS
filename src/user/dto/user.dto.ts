import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Schema, Types } from 'mongoose';

export class UserDto {
  @ApiProperty()
  readonly _id: Types.ObjectId;

  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly email: string;

  @ApiPropertyOptional()
  readonly avatarURL?: string;

  @ApiProperty()
  readonly createdAt: Schema.Types.Date;
}
