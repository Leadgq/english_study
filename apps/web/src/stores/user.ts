import { defineStore } from "pinia";
import type { ResultUserWithToken, Token } from "@en/common/user";
import { computed, ref } from "vue";

export const userStore = defineStore(
  "user",
  () => {
    const user = ref<ResultUserWithToken | null>(null);

    const setUser = (userData: ResultUserWithToken | null) => {
      user.value = userData;
    };

    const getAccessToken = computed(() => user.value?.token.accessToken || "");

    const getRefreshToken = computed(
      () => user.value?.token.refreshToken || "",
    );

    const updateToken = (newToken: Token) => {
      if (user.value) {
        user.value.token = newToken;
      }
    };

    const getUser = () => computed(() => user.value);

    const loginOut = () => {
      user.value = null;
    };

    return {
      user,
      setUser,
      getAccessToken,
      getRefreshToken,
      getUser,
      updateToken,
      loginOut,
    };
  },
  {
    persist: true,
  },
);
