import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, Length } from 'class-validator';

export class PasswordDto {
  @ApiProperty({ minItems: 8, example: '12345678' })
  @IsString()
  @Length(8, 100, { message: 'Password must be at least 8 characters' })
  readonly password: string;
}

export class LoginDto extends PasswordDto {
  @ApiProperty({ example: 'test@gmail.com' })
  @IsEmail()
  readonly email: string;
}

export class RegisterDto extends LoginDto {
  @ApiProperty({ minItems: 2, example: 'John' })
  @IsString()
  @Length(2, 100)
  readonly name: string;
}
