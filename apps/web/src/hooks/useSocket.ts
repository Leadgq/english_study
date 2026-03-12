import { io, type Socket } from "socket.io-client";
import { socketUrl } from "@/apis";
import { userStore } from "@/stores/user";
//单例模式
let socket: Socket | null = null;

export const useSocket = () => {
  const userInstance = userStore();
  const connect = () => {
    const userId = userInstance.getUser().value?.id;
    if (!userId || socket) {
      return;
    }
    socket = io(socketUrl, {
      transports: ["websocket"],
      autoConnect: true, // 自动连接
      reconnection: true, // 开启重连
      reconnectionAttempts: 5, // 最大重连尝试次数
      reconnectionDelay: 1000, // 初始重连延迟时间
      reconnectionDelayMax: 5000, // 最大重连延迟时间
      timeout: 20000, // 连接超时时间
      query: {
        userId,
      },
    });
  };

  const disconnect = () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  };

  const getConnect = (): Socket | null => {
    return socket;
  };
  return {
    connect,
    disconnect,
    getConnect,
  };
};
