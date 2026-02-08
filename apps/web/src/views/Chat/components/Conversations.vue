<template>
    <div
        class="p-5 rounded-[5px] w-[256px] bg-purple-50 border border-right-1 border-t-0 border-b-0 border-l-0 border-gray-200">
        <div @click="changeActive(value)" :class="{ 'bg-purple-300': active === value.id }"
            class="rounded-[5px] p-2 transition-all duration-300" v-for="value in chatMode" :key="value.id">
            <div class="text-sm  cursor-pointer p-2 px-4 text-gray-700">
                {{ value.label }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getChatMode } from "@/apis/chat";
import type { ChatModeList, ChatMode } from "@en/common/chat";
import { onMounted, ref } from "vue"
import { userStore } from "@/stores/user";
import { getChatHistory } from "@/apis/chat";

const userInstance = userStore();

const active = ref<string | null>(null)

const chatMode = ref<ChatModeList>([])

function changeActive(value: ChatMode) {
    active.value = value.id
}

async function getModelList() {
    const res = await getChatMode()
    if (res.success && res.message) {
        chatMode.value = res.data
    }
}

async function getMessageList() {
    const res = await getChatHistory(userInstance.user?.id!, 'normal')
    if (res.success && res.message) {
        console.log(res.data)
    }
}

onMounted(() => {
    getModelList()
    getMessageList()
})
</script>