import { IsString, IsEmail, Length } from 'class-validator';

export class LoginUser {
  @IsEmail()
  readonly email: string;

  @IsString()
  @Length(8, 100)
  readonly password: string;
}
