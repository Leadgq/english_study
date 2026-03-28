import { serverApi } from "../index";
import type { Response } from "../index.ts";

export const getWorldList = async (id: string) => {
  return serverApi.get(`/learn/world/${id}`) as Promise<Response<any>>;
};
