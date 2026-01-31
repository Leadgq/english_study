import { IsNotEmpty, IsString, Length, IsEmail } from 'class-validator';
export class UserRegisterDto {

  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString({ message: '用户名必须是字符串' })
  @Length(4, 20, { message: '用户名长度必须在4到20之间' })
  name: string; // 用户名

  @IsNotEmpty({ message: '手机号不能为空' })
  @IsString({ message: '手机号必须是字符串' })
  @Length(11, 11, { message: '手机号长度必须是11位' })
  phone: string; // 手机号

  @IsNotEmpty({ message: '密码不能为空' })
  password: string; // 密码

  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string; // 邮箱
}
