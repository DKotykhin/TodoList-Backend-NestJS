import { IsString, Length } from 'class-validator';

export class NameDto {
  @IsString()
  @Length(2, 100)
  readonly name: string;
}

export class PasswordDto {
  @IsString()
  @Length(8, 100)
  readonly password: string;
}
