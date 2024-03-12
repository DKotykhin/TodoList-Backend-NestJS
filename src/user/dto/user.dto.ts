import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';
import { Schema, Types } from 'mongoose';

export class UserDto {
  @ApiProperty()
  readonly _id: Types.ObjectId;

  @ApiProperty()
  @IsString()
  @Length(2, 30, { message: 'Title must be between 2 and 30 characters' })
  readonly name: string;

  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiPropertyOptional()
  readonly avatarURL?: string;

  @ApiProperty()
  readonly createdAt: Schema.Types.Date;
}
