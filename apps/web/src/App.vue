<script setup lang="ts">
import { RouterView } from "vue-router"
import { useSocket } from "@/hooks/useSocket";
import { userStore } from "@/stores/user"
import Search from "@/componets/Search/index.vue"
import Login from "@/componets/Login/index.vue"
import { IS_SHOW_LOGIN } from "@/componets/Login/types.ts"
import { provide, ref, watch } from "vue";
provide(IS_SHOW_LOGIN, ref<boolean>(false));
const userInstance = userStore();
const { connect, disconnect } = useSocket();
watch(() => userInstance.getUser().value?.id, (newVal) => {
  if (newVal) {
    connect();
  } else {
    disconnect();
  }
}, { immediate: true });
</script>

<template>
  <RouterView></RouterView>
  <Search></Search>
  <Login></Login>
</template>

<style scoped></style>
