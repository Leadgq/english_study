import { JwtService } from '@nestjs/jwt';
import {  Injectable } from '@nestjs/common';
import type {
  UserLogin,
  Token,
  RefreshToken,
  UserUpdate,
} from '@en/common/user';
import { ResponseService, PrismaService } from '@libs/shared';
import { UserCreateInput } from '@libs/shared/generated/prisma/models';
import { AuthService } from '../auth/auth.service';
import { updateUserSelect, userSelect } from './user.select';
import { UserRegisterDto } from './dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { MinioService } from '@libs/shared/minio/minio.service';
import type { Request } from 'express';
@Injectable()
export class UserService {
  constructor(
    private readonly responseService: ResponseService,
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly minioService: MinioService,
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

  async uploadAvatar(file: Express.Multer.File) {
    if (!file) {
      return this.responseService.error(null, '文件不存在');
    }
    if (file.size > 1024 * 1024 * 5) {
      return this.responseService.error(null, '文件大小不能超过5MB');
    }
    const minioClint = this.minioService.getClient();
    const bucket = this.minioService.getBucket();
    const fileName = `${Date.now()}-${file.originalname}`;
    await minioClint.putObject(bucket, fileName, file.buffer, file.size, {
      'Content-Type': file.mimetype,
    });
    const isHttps = !!Number(this.configService.get('MINIO_USE_SSL'));
    const baseUrl = isHttps ? 'https' : 'http';
    const port = this.configService.get('MINIO_PORT')!;
    const databaseUrl = `/${bucket}/${fileName}`;
    const previewUrl = `${baseUrl}://${this.configService.get('MINIO_URL')}:${port}${databaseUrl}`;
    return this.responseService.success({
      previewUrl,
      databaseUrl,
    });
  }

  async updateUser(updateUserDto: UserUpdate, user: Request['user']) {
    const userData = await this.prismaService.user.findUnique({
      where: {
        id: user.userId,
      },
    });
    if (updateUserDto.email && updateUserDto.email !== userData!.email) {
      const email = await this.prismaService.user.findUnique({
        where: {
          email: updateUserDto.email,
        },
      });
      if (email) {
        return this.responseService.error(null, '邮箱已存在');
      }
    }
    const updateUser = await this.prismaService.user.update({
      where: {
        id: user.userId,
      },
      data: {
        name: updateUserDto.name,
        email: updateUserDto.email,
        address: updateUserDto.address,
        avatar: updateUserDto.avatar,
        bio: updateUserDto.bio,
        isTimingTask: updateUserDto.isTimingTask,
        timingTaskTime: updateUserDto.timingTaskTime,
      },
      select: updateUserSelect,
    });
    return this.responseService.success(updateUser);
  }
}
