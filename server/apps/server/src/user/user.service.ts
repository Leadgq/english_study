import { Injectable } from '@nestjs/common';
import type { UserLogin, UserRegister } from '@en/common/user';
import { ResponseService, PrismaService } from '@libs/shared';
import { UserCreateInput } from '@libs/shared/generated/prisma/models';
const userSelect = {
  id: true,
  phone: true,
  name: true,
  email: true,
  address: true,
  avatar: true,
  createdAt: true,
  updatedAt: true,
  lastLoginAt: true,
  wordNumber: true,
  dayNumber: true,
};
@Injectable()
export class UserService {
  constructor(
    private readonly responseService: ResponseService,
    private readonly prismaService: PrismaService,
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
    return this.responseService.success(loginUser);
  }

  async register(registerUserDto: UserRegister) {
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
    return this.responseService.success(registerUser);
  }
}
