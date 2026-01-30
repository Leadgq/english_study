import axios from "axios";
const TIMEOUT = 50000;
export const serverApi = axios.create({
  baseURL: "/api/v1",
  timeout: TIMEOUT,
});

serverApi.interceptors.response.use((config) => {
  return config.data;
});

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
