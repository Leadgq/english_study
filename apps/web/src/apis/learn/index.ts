import type { WordWithIsPlaying } from "@/views/WordBook/type.ts";
import { serverApi } from "../index";
import type { Response } from "../index.ts";
import type { ResultLearn } from "@en/common/learn";

export const getWorldList = async (id: string) => {
  return serverApi.get(`/learn/world/${id}`) as Promise<Response<WordWithIsPlaying[]>>;
};

export const saveWorldMaster = async (worldIds: string[]) => {
  return serverApi.post(`/learn/world/master`, { worldIds }) as Promise<
    Response<ResultLearn>
  >;
};
