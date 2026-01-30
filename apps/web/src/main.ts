import { createApp } from "vue";
import { createPinia } from "pinia";
import "@/assets/base.css";
import ElementPlus from "element-plus";
// 国际化
import zhCn from "element-plus/es/locale/lang/zh-cn";
import "element-plus/dist/index.css";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import focus from "@/directives/focus";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.use(router);
app.use(ElementPlus, { locale: zhCn });
app.use(focus);

app.mount("#app");
