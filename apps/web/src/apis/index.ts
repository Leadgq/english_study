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

export const uploadUrl =  import.meta.env.DEV ? 'http://192.168.1.6:9000' : 'http://目前没有'


// 创建锁
let isRefreshing = false;
// 创建失败的队列
let requestQueue: ((newAccessToken: string) => void)[] = [];
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
    //  离线异常
    if (error.code === "ERROR_NETWORK") {
      ElMessage.error("网络异常，请检查网络设置");
      return Promise.reject(error);
    }
    if (error.response.status !== 401) {
      ElMessage.error('服务异常');
      return Promise.reject(error);
    } else {
      const user = userStore();
      const accessToken = user.getAccessToken;
      const refreshToken = user.getRefreshToken;
      const originalRequest = error.config;
      if (!accessToken || !refreshToken) {
        ElMessage.error("没有任何token,无法刷新，请重新登录  ");
        user.loginOut();
        router.replace("/");
        return Promise.reject(error);
      }
      if (isRefreshing) {
        return new Promise((resolve) => {
          // 加入队列
          requestQueue.push((newAccessToken: string) => {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            resolve(serverApi(originalRequest));
          });
        });
      }
      isRefreshing = true;
      try {
        const newToken = await refreshTokenApi({ refreshToken });
        if (newToken.success) {
          user.updateToken(newToken.data);
        } else {
          user.loginOut();
          router.replace("/");
          return Promise.reject(error);
        }
        requestQueue.forEach((callback) => callback(newToken.data.accessToken));
        return serverApi(originalRequest);
      } catch (error) {
        return Promise.reject(error);
      } finally {
        requestQueue = [];
        isRefreshing = false;
      }
    }
  },
);

// ai服务的拦截
export const aiApi = axios.create({
  baseURL: "/ai/v1",
  timeout: TIMEOUT,
});

aiApi.interceptors.response.use((config) => {
  return config.data;
});

aiApi.interceptors.request.use((config) => {
  const user = userStore();
  if (user.getAccessToken) {
    config.headers.Authorization = `Bearer ${user.getAccessToken}`;
  }
  return config;
});

export interface Response<T = any> {
  timestamp: string;
  path: string;
  message: string;
  code: number;
  success: boolean;
  data: T;
}
