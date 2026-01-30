import type {
  UserLogin,
  UserRegister,
  ResultUserWithToken,
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