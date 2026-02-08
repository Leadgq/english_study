<template>
    <div class="w-[1200px] mx-auto flex mt-10">
        <Conversations @onChangeActive="changeActive" />
        <Bubble :list="list" :role="active" @sendMessage="sendMessage" />
    </div>
</template>
<script setup lang="ts">
import Conversations from './components/Conversations.vue'
import Bubble from './components/Bubble.vue'
import type { ChatMode, ChatMessageList, ChatMessage, ChatDto } from "@en/common/chat";
import { getChatHistory } from "@/apis/chat";
import { ref } from 'vue';
import { userStore } from "@/stores/user";
import type { ChatRoleType } from "@en/common/chat";
import { sse, CHAT_URL } from '@/apis/sse';
const userInstance = userStore()

const active = ref<ChatRoleType>('normal')
const list = ref<ChatMessageList>([])

async function changeActive(value: ChatMode) {
    active.value = value.role
    const res = await getChatHistory(userInstance.user!.id, value.role)
    if (res.success && res.message) {
        list.value = res.data;
    }
}

function sendMessage(message: string) {
    list.value.push({
        role: "human",
        content: message,
    })
    list.value.push({
        role: "ai",
        content: "",
    })
    sse<ChatMessage, ChatDto>(CHAT_URL, "POST", {
        role: active.value,
        content: message,
        userId: userInstance.user!.id,
    }, (data) => {
        const last = list.value[list.value.length - 1]
        if (last) {
            last.content += data.content
        }
    })
}
</script>