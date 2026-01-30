import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from '@en/common/user';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const headers = request.headers;
    if (!headers.authorization) {
      throw new UnauthorizedException('别偷了哥,买点东西吧');
    }
    const token = headers.authorization.split(' ')[1];
    try {
      const payload = this.jwtService.verify<RefreshToken>(token);
      if (payload.tokenType !== 'access') {
        throw new UnauthorizedException('token类型错误');
      }
      request.user = payload;
      return true;
    } catch (err) {
      throw new UnauthorizedException('token 失效了');
    }
  }
}
