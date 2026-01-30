import axios from "axios";
const TIMEOUT = 50000;
import { userStore } from "@/stores/user";
import router from "@/router";
import { ElMessage } from "element-plus";
import { refreshTokenApi } from "./auth";

export const serverApi = axios.create({
  baseURL: "/api/v1",
  timeout: TIMEOUT,
});

// 请求拦截
serverApi.interceptors.request.use((config) => {
  const user = userStore();
  if (user.getAccessToken) {
    config.headers.Authorization = `Bearer ${user.getAccessToken}`;
  }
  return config;
});

// 响应拦截
serverApi.interceptors.response.use(
  (config) => {
    return config.data;
  },
  async (error) => {
    if (error.response.status !== 401) {
      return Promise.reject(error);
    } else {
      const user = userStore();
      const accessToken = user.getAccessToken;
      const refreshToken = user.getRefreshToken;
      const originalRequest = error.config;
      if (!accessToken || !refreshToken) {
        ElMessage.error("没有任何token,无法刷新");
        user.loginOut();
        router.replace("/");
        return Promise.reject(error);
      }
      // 准备刷新token
      const newToken = await refreshTokenApi({ refreshToken });
      console.log(newToken);
      if (newToken.success) {
        user.updateToken(newToken.data);
      } else {
        user.loginOut();
        router.replace("/");
        return Promise.reject(error);
      }
      return serverApi(originalRequest);
    }
  },
);

// ai服务的拦截
export const aiApi = axios.create({
  baseURL: "/api/v1/ai",
  timeout: TIMEOUT,
});

aiApi.interceptors.response.use((config) => {
  return config.data;
});

export interface Response<T = any> {
  timestamp: string;
  path: string;
  message: string;
  code: number;
  success: boolean;
  data: T;
}
