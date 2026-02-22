import type { Method } from "axios";
export const CHAT_URL = "/ai/v1/chat";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { userStore } from "@/stores/user";

export const sse = <T, V>(
  url: string,
  method: Method,
  body: V,
  callback?: (data: T) => void,
  errorCallback?: (error: Error) => void,
) => {
  fetchEventSource(url, {
    method: method.toLocaleLowerCase(),
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${userStore().getAccessToken}`,
    },
    body: JSON.stringify(body),
    onmessage: (event) => {
      callback?.(JSON.parse(event.data) as T );
    },
    onerror: (error) => {
      errorCallback?.(error);
    },
  });
};
