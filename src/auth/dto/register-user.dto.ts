import { IsString, IsEmail, Length } from 'class-validator';

export class RegisterUser {
  @IsString()
  @Length(2, 100)
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  @Length(8, 100)
  readonly password: string;
}
