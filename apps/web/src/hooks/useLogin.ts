import { inject, onUnmounted, ref } from "vue";
import type { Ref } from "vue";
import { IS_SHOW_LOGIN } from "@/componets/Login/types.ts";
import { userStore } from "@/stores/user";
import router from "@/router";

export const useLogin = () => {
  let isShowLogin = inject(IS_SHOW_LOGIN, ref<boolean>(false)) as Ref<boolean>;
  const userStoreInstance = userStore();

  const bindKeydownEvent = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      loginHidden();
    }
  };

  window.addEventListener("keydown", bindKeydownEvent);

  onUnmounted(() => {
    window.removeEventListener("keydown", bindKeydownEvent);
  });

  const login = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (userStoreInstance.user) {
        resolve(true);
      } else {
        reject(false);
        isShowLogin.value = true;
        document.body.style.overflow = "hidden";
      }
    });
  };

  const loginOut = () => {
    userStoreInstance.loginOut();
    router.push("/");
  };

  const loginHidden = () => {
    isShowLogin.value = false;
    document.body.style.overflow = "auto";
  };
  return {
    login,
    loginHidden,
    loginOut,
    isShowLogin,
  };
};
