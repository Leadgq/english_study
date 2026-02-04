import { defineStore } from "pinia";
import type { ResultUserWithToken, Token } from "@en/common/user";
import { computed, ref } from "vue";
import type { UserUpdate } from "@en/common/user/index";

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

    const getUpdateUserInfo = (): UserUpdate => {
      return {
        name: user.value?.name || "",
        email: user.value?.email || "",
        address: user.value?.address || "",
        avatar: user.value?.avatar || "",
        bio: user.value?.bio || "",
        isTimingTask: user.value?.isTimingTask || false,
        timingTaskTime: user.value?.timingTaskTime || "",
      };
    };

    const updateUserInfo = (newInfo: UserUpdate) => {
      if (!user.value) {
        return;
      }
      user.value.name = newInfo.name;
      user.value.email = newInfo.email;
      user.value.address = newInfo.address;
      user.value.avatar = newInfo.avatar;
      user.value.bio = newInfo.bio;
      user.value.isTimingTask = newInfo.isTimingTask;
      user.value.timingTaskTime = newInfo.timingTaskTime;
    };

    return {
      user,
      setUser,
      getAccessToken,
      getRefreshToken,
      getUser,
      updateToken,
      loginOut,
      getUpdateUserInfo,
      updateUserInfo
    };
  },
  {
    persist: true,
  },
);
