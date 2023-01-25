import { ResponseUser } from 'src/user/dto/response-user.dto';

export class ResponseAuth extends ResponseUser {
  readonly token: string;
}
