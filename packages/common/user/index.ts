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
  bio?: string | null; // 签名
  isTimingTask: boolean; // 是否开启定时任务
  timingTaskTime: string; //定时任务时间默认晚上0点开始，每隔24小时执行
}

// 用户更新类型
export type UserUpdate = Pick<
  User,
  | "name"
  | "email"
  | "address"
  | "avatar"
  | "bio"
  | "isTimingTask"
  | "timingTaskTime"
>;

// 头像返回类型
export type Avatar = {
  previewUrl: string; //预览地址
  databaseUrl: string; //数据库地址
};

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

// token 负载类型
export type TokenPayload = Pick<User, "email" | "name"> & {
  userId: User["id"];
};

// 刷新token
export type RefreshToken = TokenPayload & {
  tokenType: "refresh" | "access";
};
