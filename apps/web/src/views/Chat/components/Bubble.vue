<template>
    <div class="flex-1 h-[750px] p-5 bg-purple-50 flex flex-col">
        <div class="flex-1 overflow-y-auto">
            <div v-for="(item, index) in list" :key="index">
                <div class="flex justify-end items-center  gap-4 mt-5 mb-5 mr-5" v-if="item.role === 'human'">
                    <div class="text-sm text-white max-w-[80%] rounded-lg p-2 bg-blue-500 shadow-md">
                        {{ item.content }}
                    </div>
                    <div>
                        <el-avatar :size="35">user</el-avatar>
                    </div>
                </div>
                <div class="flex justify-start gap-4 mt-5 mb-5" v-else>
                    <div> <el-avatar :size="35">AI</el-avatar></div>
                     <div v-if="item.role === 'ai' && item.reasoning" class="text-[12px] text-gray-500 max-w-[80%] p-2">
                            {{ item.reasoning }}
                        </div>
                        <div v-if="item.role === 'ai' && item.content !== ''"
                            class="text-sm text-gray-700 max-w-[80%] bg-white rounded-lg mt-2 deepseek-markdown"
                            v-html="parseMarkdown(item.content)" />
                </div>
            </div>
            <div ref="chatRef"></div>
        </div>
        <div class="flex p-5 border-t border-gray-200 box-border flex-col gap-3">
            <!-- 功能选项 -->
            <div class="flex items-center gap-3">
                <div class="flex items-center gap-1 px-3 py-1 rounded-full text-xs cursor-pointer transition-all border"
                    :class="deepThink
                        ? 'bg-purple-100 border-purple-400 text-purple-700'
                        : 'bg-gray-100 border-gray-200 text-gray-500 hover:bg-gray-200'"
                    @click="deepThink = !deepThink">
                    <span>🧠</span>
                    <span>深度思考</span>
                </div>
                <div class="flex items-center gap-1 px-3 py-1 rounded-full text-xs cursor-pointer transition-all border"
                    :class="webSearch
                        ? 'bg-blue-100 border-blue-400 text-blue-700'
                        : 'bg-gray-100 border-gray-200 text-gray-500 hover:bg-gray-200'"
                    @click="webSearch = !webSearch">
                    <span>🌐</span>
                    <span>联网搜索</span>
                </div>
            </div>
            <!-- 输入框 -->
            <div class="flex">
                <el-input @keyup.enter="sendMessage" type="textarea" :rows="2" v-model="message" placeholder="请输入内容" />
                <el-button class="ml-2" :icon="Position" type="primary" @click="sendMessage"></el-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { nextTick, ref, useTemplateRef, watch } from 'vue'
import { Position } from '@element-plus/icons-vue'
import type { ChatMessageList } from "@en/common/chat"
import type { ChatRoleType } from "@en/common/chat";
import { marked } from "marked"
import '@/assets/css/makeDown.css'

const emit = defineEmits<{
    (e: 'sendMessage', value: string, deepThink: boolean, webSearch: boolean): void
}>()

const chatRef = useTemplateRef<HTMLDivElement>("chatRef")
const deepThink = ref(false)
const webSearch = ref(false)
const props = defineProps<{
    list?: ChatMessageList,
    role: ChatRoleType,
}>()

const message = ref('')

function sendMessage() {
    emit('sendMessage', message.value, deepThink.value, webSearch.value)
    message.value = ''
}

function parseMarkdown(content: string) {
    if (!content) {
        return ''
    }
    return marked.parse(content)
}

watch(() => props.list, () => {
    nextTick(() => {
        chatRef.value?.scrollIntoView({ behavior: 'smooth' })
    })
}, {
    deep: true,
    immediate: true,
})
</script>