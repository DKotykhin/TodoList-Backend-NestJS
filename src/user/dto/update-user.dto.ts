import { IsString, Length } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class NameDto {
  @ApiProperty()
  @IsString()
  @Length(2, 100)
  readonly name: string;
}

export class PasswordDto {
  @ApiProperty()
  @IsString()
  @Length(8, 100)
  readonly password: string;
}
