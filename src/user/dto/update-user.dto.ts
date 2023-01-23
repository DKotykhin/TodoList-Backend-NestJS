import { IsString, Length } from 'class-validator';

export class Name {
  @IsString()
  @Length(2, 100)
  readonly name: string;
}

export class Password {
  @IsString()
  @Length(8, 100)
  readonly password: string;
}
