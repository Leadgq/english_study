import { userStore } from "@/stores/user";
import { uploadUrl } from "@/apis";
import defaultAvatar from "@/assets/images/avatar/default-avatar.png";
import { computed } from "vue";

export function useAvatar() {
  const userInstance = userStore();

  const avatar = computed(() => {
    if (userInstance.user?.avatar) {
      return uploadUrl + userInstance.user.avatar;
    }
    return defaultAvatar;
  });

  return {
    avatar,
  };
}
