export interface User {
  id: string; // 用户ID
  name: string; // 用户名
  email?: string | null; // 邮箱
  phone: string; // 手机号
  address?: string | null; // 地址
  password: string; // 密码
  avatar?: string | null; // 头像
  wordNumber: number; // 单词数量
  dayNumber: number; // 打卡天数
  createdAt: Date; // 创建时间
  updatedAt: Date; // 更新时间
  lastLoginAt?: Date | null; // 最后登录时间
}

// 登录类型
export type UserLogin = Pick<User, "phone" | "password">;

// 注册类型
export type UserRegister = Pick<User, "name" | "phone" | "password" | "email">;

// 返回的类型，不包括密码
export type ResultUser = Omit<User, "password">;

// token类型
export type Token = {
  accessToken: string;
  refreshToken: string;
};

// 返回的类型，包括token
export type ResultUserWithToken = ResultUser & {
  token: Token;
};
