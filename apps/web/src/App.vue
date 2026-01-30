<script setup lang="ts">
import { RouterView } from "vue-router"
import Search from "@/componets/Search/index.vue"
import Login from "@/componets/Login/index.vue"
import { IS_SHOW_LOGIN } from "@/componets/Login/types.ts"
import { provide, ref } from "vue";
provide(IS_SHOW_LOGIN, ref<boolean>(false));
</script>

<template>
  <RouterView></RouterView>
  <Search></Search>
  <Login></Login>
</template>

<style scoped></style>
