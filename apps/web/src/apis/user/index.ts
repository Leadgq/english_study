import type {
  UserLogin,
  UserRegister,
  ResultUserWithToken,
  AvatarResult,
  UserUpdate,
} from "@en/common/user";
import { serverApi } from "../index";
import type { Response } from "../index.ts";

export const login = (loginData: UserLogin) => {
  return serverApi.post("/user/login", loginData) as Promise<
    Response<ResultUserWithToken>
  >;
};

export const register = (registerData: UserRegister) => {
  return serverApi.post("/user/register", registerData) as Promise<
    Response<ResultUserWithToken>
  >;
};

// 上传头像
export const uploadAvatar = (file: FormData) => {
  return serverApi.post("/user/upload-avatar", file) as Promise<
    Response<AvatarResult>
  >;
};

//更新
export const updateUser = (updateUser: UserUpdate) => {
  return serverApi.post("/user/update-user", updateUser) as Promise<
    Response<UserUpdate>
  >;
};
