import { UserResponse } from 'src/user/dto/response-user.dto';

export class AuthResponse extends UserResponse {
  readonly token: string;
}
