import { createRouter, createWebHistory } from "vue-router";
import Home from "./home/index.ts";
import WordBook from "./word-book/index.ts";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...Home, // 主页
    ...WordBook, // 单词本
  ],
});

export default router;
