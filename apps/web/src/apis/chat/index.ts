import { aiApi } from "@/apis";
import type { ChatMessageList, ChatModeList, ChatRoleType } from "@en/common/chat";
import type { Response } from "@/apis";

export const getChatMode = () => {
  return aiApi.get("/prompt/list") as Promise<Response<ChatModeList>>;
};


export const getChatHistory = (userId: string, role: ChatRoleType) => {
  return aiApi.get(`/chat/history?userId=${userId}&role=${role}`) as Promise<Response<ChatMessageList>>;
}
