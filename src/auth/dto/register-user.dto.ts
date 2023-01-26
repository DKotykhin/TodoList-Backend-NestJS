import { IsString, IsEmail, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ minItems: 2, example: 'John' })
  @IsString()
  @Length(2, 100)
  readonly name: string;

  @ApiProperty({ example: 'test@gmail.com' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ minItems: 8, example: '12345678' })
  @IsString()
  @Length(8, 100)
  readonly password: string;
}
