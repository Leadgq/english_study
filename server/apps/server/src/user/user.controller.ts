import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import type { Token, UserLogin } from '@en/common/user';
import { UserRegisterDto } from './dto/create-user.dto';

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
}
