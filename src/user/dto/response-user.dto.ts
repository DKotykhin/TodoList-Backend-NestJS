import { Schema, Types } from 'mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserResponse {
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

  @ApiProperty()
  readonly message: string;
}
