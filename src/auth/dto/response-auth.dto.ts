import { ApiProperty } from '@nestjs/swagger';
import { UserResponse } from 'src/user/dto/user.dto';

export class AuthResponse extends UserResponse {
  @ApiProperty()
  readonly token: string;
}
