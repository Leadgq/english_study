import { defineStore } from "pinia";
import type { ResultUserWithToken } from "@en/common/user";
import { computed, ref } from "vue";

export const userStore = defineStore(
  "user",
  () => {
    const user = ref<ResultUserWithToken | null>(null);

    const setUser = (userData: ResultUserWithToken | null) => {
      user.value = userData;
    };

    const getUser = () => computed(() => user.value);

    const loginOut = () => {
      user.value = null;
    };

    return { user, setUser, getUser, loginOut };
  },
  {
    persist: true,
  },
);
