import type { App } from "vue";

export default {
  install(app: App) {
    app.directive("focus", {
      mounted(el) {
        el.focus();
      },
    });
  },
};
