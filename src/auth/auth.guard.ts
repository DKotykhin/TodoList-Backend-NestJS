import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { HttpException } from '@nestjs/common/exceptions/http.exception';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtServise: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const token = req.headers.authorization.split(' ')[1];
      const user = this.jwtServise.verify(token);
      req.userId = user;
      return Boolean(user._id);
    } catch (err) {
      throw new HttpException('Authorization denyed', HttpStatus.UNAUTHORIZED);
    }
  }
}
