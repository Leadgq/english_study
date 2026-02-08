import { createRouter, createWebHistory } from "vue-router";
import Home from "./home/index.ts";
import WordBook from "./word-book/index.ts";
import Setting from "./setting/index.ts";
import Chat from "./ai/index.ts";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...Home, // 主页
    ...WordBook, // 单词本
    ...Setting, // 设置
    ...Chat, // 聊天
  ],
});

export default router;
