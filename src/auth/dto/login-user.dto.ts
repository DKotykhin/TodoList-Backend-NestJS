import { IsString, IsEmail, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'test@gmail.com' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ minItems: 8, example: '12345678' })
  @IsString()
  @Length(8, 100)
  readonly password: string;
}
