import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import type {
  UserLogin,
  Token,
  RefreshToken,
} from '@en/common/user';
import { ResponseService, PrismaService } from '@libs/shared';
import { UserCreateInput } from '@libs/shared/generated/prisma/models';
import { AuthService } from '../auth/auth.service';
import { userSelect } from './user.select';
import {UserRegisterDto} from './dto/create-user.dto'

@Injectable()
export class UserService {
  constructor(
    private readonly responseService: ResponseService,
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginUserDto: UserLogin) {
    let user = await this.prismaService.user.findUnique({
      where: {
        phone: loginUserDto.phone,
      },
    });
    if (!user) {
      return this.responseService.error(null, '用户不存在');
    }
    if (user.password !== loginUserDto.password) {
      return this.responseService.error(null, '密码错误');
    }
    const loginUser = await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        lastLoginAt: new Date(),
      },
      select: userSelect,
    });
    const token = this.authService.generateToken({
      userId: loginUser.id,
      email: loginUser.email,
      name: loginUser.name,
    });
    return this.responseService.success({
      ...loginUser,
      token,
    });
  }

  async register(registerUserDto: UserRegisterDto) {
    const data: UserCreateInput = {
      phone: registerUserDto.phone,
      name: registerUserDto.name,
      password: registerUserDto.password,
      lastLoginAt: new Date(),
    };
    const user = await this.prismaService.user.findUnique({
      where: {
        phone: registerUserDto.phone,
      },
    });
    if (user) {
      return this.responseService.error(null, '手机号已存在');
    }
    // 如果有邮箱，检查邮箱是否已存在
    if (registerUserDto.email) {
      const emailUser = await this.prismaService.user.findUnique({
        where: {
          email: registerUserDto.email,
        },
      });
      if (emailUser) {
        return this.responseService.error(null, '邮箱已存在');
      }
      data.email = registerUserDto.email;
    }
    // 注册用户
    const registerUser = await this.prismaService.user.create({
      data,
      select: userSelect,
    });
    const token = this.authService.generateToken({
      userId: registerUser.id,
      email: registerUser.email,
      name: registerUser.name,
    });
    return this.responseService.success({
      ...registerUser,
      token,
    });
  }

  async refreshToken(token: Omit<Token, 'accessToken'>) {
    try {
      const decoded = this.jwtService.verify<RefreshToken>(token.refreshToken);
      if (decoded.tokenType !== 'refresh') {
        return this.responseService.error(null, 'token类型错误');
      }
      const user = await this.prismaService.user.findUnique({
        where: {
          id: decoded.userId,
        },
      });
      if (!user) {
        return this.responseService.error(null, '用户不存在');
      }
      const newToken = this.authService.generateToken({
        userId: user.id,
        email: user.email,
        name: user.name,
      });
      return this.responseService.success(newToken);
    } catch {
      return this.responseService.error(null, 'token过期');
    }
  }
}
