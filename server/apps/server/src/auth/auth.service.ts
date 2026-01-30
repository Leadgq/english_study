import { Token, TokenPayload, RefreshToken } from '@en/common/user';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  generateToken(payload: TokenPayload): Token {
    return {
      accessToken: this.jwtService.sign<RefreshToken>({
        ...payload,
        tokenType: 'access',
      }),
      refreshToken: this.jwtService.sign<RefreshToken>(
        {
          ...payload,
          tokenType: 'refresh',
        },
        {
          expiresIn: '7d',
        },
      ),
    };
  }
}
