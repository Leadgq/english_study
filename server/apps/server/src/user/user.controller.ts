import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import type { UserLogin, UserRegister } from '@en/common/user';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  login(@Body() loginUserDto: UserLogin) {
    return this.userService.login(loginUserDto);
  }

  @Post('register')
  register(@Body() registerUserDto: UserRegister) {
    return this.userService.register(registerUserDto);
  }
}
