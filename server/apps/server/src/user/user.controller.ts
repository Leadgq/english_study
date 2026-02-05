import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import type { Token, UserLogin,UserUpdate } from '@en/common/user';
import { UserRegisterDto } from './dto/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import type {Request} from "express"
import { AuthGuard } from '@libs/shared/auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  login(@Body() loginUserDto: UserLogin) {
    return this.userService.login(loginUserDto);
  }

  @Post('register')
  register(@Body() registerUserDto: UserRegisterDto) {
    return this.userService.register(registerUserDto);
  }

  //刷新token
  @Post('refresh-token')
  refreshToken(@Body() refreshTokenDto: Omit<Token, 'accessToken'>) {
    return this.userService.refreshToken(refreshTokenDto);
  }

  //头像上传
  @Post('upload-avatar')
  // 上传文件拦截器
  @UseInterceptors(FileInterceptor('file'))
  uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    return this.userService.uploadAvatar(file);
  }

  @UseGuards(AuthGuard)
  // 更新用户信息
  @Post("update-user")
  updateUser(@Body() updateUserDto: UserUpdate, @Req() req: Request){
    const user = req.user;
    return this.userService.updateUser(updateUserDto, user);
  }
}
