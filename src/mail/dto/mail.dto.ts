import { IsString, IsEmail, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EmailDto {
  @ApiProperty({ example: 'test@gmail.com' })
  @IsEmail()
  readonly email: string;
}

export class NewPasswordDto {
  @ApiProperty({ minItems: 8, example: '12345678' })
  @IsString()
  @Length(8, 100)
  readonly password: string;

  @ApiProperty({ example: 'fe826d3c809e9414e7da6797f1a2981a' })
  @IsString()
  readonly token: string;
}
