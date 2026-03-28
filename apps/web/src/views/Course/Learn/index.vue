<template>
    <div class="min-h-[60vh] bg-zinc-50/80">
        <div class="w-[1200px] mx-auto px-4 pt-12 pb-24">
            <header class="mb-10 text-center">
                <h1 class="text-3xl font-bold text-zinc-900 tracking-tight sm:text-4xl">{{ title }}</h1>
                <p class="mt-3 text-zinc-500 text-sm">请根据释义和翻译拼写单词</p>
            </header>

            <el-skeleton v-if="isLoading" :rows="10" animated />

            <div v-if="list.length === 0" class="flex justify-center py-20">
                <el-empty description="暂无单词或您尚未购买该课程" />
            </div>

            <template v-else>
                <!-- 本组已学完 -->
                <div v-if="currentIndex >= list.length"
                    class="text-center py-16 px-6 bg-white rounded-2xl border border-zinc-100 shadow-sm">
                    <p class="text-zinc-600 mb-6">本组 10 个词已学完</p>
                    <el-button type="primary" size="large" @click="saveWordMaster">
                        再练一组
                    </el-button>
                </div>

                <!-- 当前单词卡片 -->
                <div v-else>
                    <div class="mb-4 flex items-center justify-between text-sm text-zinc-500">
                        <span>第 {{ currentIndex + 1 }} / {{ list.length }} 个</span>
                    </div>
                    <article class="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
                        <div class="p-8 sm:p-10 relative">
                            <div class="flex justify-center mb-6">
                                <div :class="{ 'filter blur-md select-none': isWordBlurred }"
                                    class="transition-all duration-300 min-h-10 flex flex-col items-center text-center">
                                    <div class="text-2xl sm:text-3xl font-bold text-indigo-600 tracking-tight">
                                        {{ currentWord?.word }}
                                    </div>
                                    <div class="flex items-center justify-center gap-2 mt-1">
                                        <span v-if="currentWord?.phonetic" class="text-base text-zinc-500 font-mono">
                                            {{ currentWord.phonetic }}
                                        </span>
                                        <el-icon v-if="currentWord?.word"
                                            class="shrink-0 cursor-pointer text-slate-400 hover:text-indigo-400 transition-colors"
                                            :size="18" title="发音" @click="playAudio(currentWord)">
                                            <VideoPlay />
                                        </el-icon>
                                    </div>
                                </div>
                                <el-icon
                                    class="absolute! right-10 top-10 cursor-pointer text-slate-400 hover:text-indigo-400 transition-colors"
                                    :size="18" :title="isWordBlurred ? '点击显示单词' : '点击隐藏单词'"
                                    @click="isWordBlurred = !isWordBlurred">
                                    <View v-if="isWordBlurred" />
                                    <Hide v-else />
                                </el-icon>
                            </div>
                            <!-- 释义 -->
                            <div class="mb-4 rounded-lg bg-zinc-50/80 border border-zinc-100 p-4">
                                <p class="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-2">释义</p>
                                <div class="text-zinc-700 leading-relaxed prose prose-sm max-w-none"
                                    v-html="currentWord?.definition" />
                            </div>
                            <!-- 翻译 -->
                            <div class="rounded-lg bg-zinc-50/80 border border-zinc-100 p-4">
                                <p class="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-2">翻译</p>
                                <div class="text-zinc-600 leading-relaxed whitespace-pre-line prose prose-sm max-w-none"
                                    v-html="currentWord?.translation" />
                            </div>
                            <!--拼写练习-->
                            <div class="rounded-lg bg-zinc-50/80 border border-zinc-100 p-4">
                                <p class="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-2">拼写</p>
                                <div class="flex items-center gap-2 justify-center">
                                    <input :maxlength="1" ref="inputRefs" @input="onInput(index)"
                                        v-for="(item, index) in wordList" @keydown="onKeyDown(index, $event)"
                                        :key="index" type="text" v-model="item.input"
                                        :class="{ 'border-indigo-500!': item.isTrue === true, 'border-red-500!': item.isTrue === false }"
                                        class="border-0 border-b-2 border-zinc-300 focus:border-indigo-500 bg-transparent outline-none w-10 text-center text-2xl font-bold" />
                                </div>
                            </div>
                            <!--控制按钮-->
                            <div class="flex justify-end gap-2">
                                <el-button type="primary" @click="pagePrev">
                                    上一个
                                </el-button>
                                <el-button type="primary" @click="pageNext">
                                    下一个
                                </el-button>
                            </div>
                        </div>
                    </article>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import type { WordWithIsPlaying } from "@/views/WordBook/type";
import { useAudio } from "@/hooks/useAudio"
import { useRoute } from "vue-router"
import { getWorldList } from "@/apis/learn/index";

const route = useRoute();
const title = computed(() => {
    return route.params.title as string || '';
})

const courseId = computed(() => {
    return route.params.courseId as string || '';
})

interface WordItem {
    word: string;
    input: string;
    isTrue: boolean | undefined;
}
import { View, Hide, VideoPlay } from '@element-plus/icons-vue';
const { playAudio } = useAudio({});

const isLoading = ref(false);

const list = ref<WordWithIsPlaying[]>([]);

const currentIndex = ref(0);

const isWordBlurred = ref(true);

const wordList = ref<WordItem[]>([]);

const currentWord = computed<WordWithIsPlaying | undefined>(() => {
    let world = list.value[currentIndex.value];
    return world;
})

watch(currentWord, () => {
    const current = currentWord.value?.word || "";
    wordList.value = Array.from(current).map(item => {
        return {
            word: item,
            input: "",
            isTrue: undefined,
        }
    })
}, { immediate: true })

function pagePrev() {
    if (currentIndex.value <= 0) {
        return;
    }
    currentIndex.value--;
}

function pageNext() {
    currentIndex.value++;
}


function onInput(index: number) {

}

function onKeyDown(index: number, event: KeyboardEvent) {

}



function saveWordMaster() {

}

async function getWorldListData() {
    const res = await getWorldList(courseId.value);
    if (res.data) {
        list.value = (res.data || []).map(item => {
            return {
                ...item,
                isPlaying: false
            }
        })
    }
}

onMounted(() => {
    getWorldListData();
})
</script>