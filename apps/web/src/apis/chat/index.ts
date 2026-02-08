import { aiApi } from "@/apis";
import type { ChatMode } from "@en/common/chat";
import type { Response } from "@/apis";

export const getChatMode = () => {
  return aiApi.get("/prompt/list") as Promise<Response<ChatMode[]>>;
};
