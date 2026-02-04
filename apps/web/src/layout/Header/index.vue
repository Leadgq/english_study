<template>
    <header class="flex items-center h-20 border-b border-gray-200 justify-center sticky top-0 bg-white z-10">
        <div class="w-[1200px] mx-auto flex items-center justify-between">
            <div
                class="text-2xl font-bold bg-indigo-700 text-white rounded-[10px] px-2 py-1 w-10 flex items-center justify-center h-10 ">
                E</div>
            <div class="text-2xl font-bold">English App</div>
            <div @click="router.push('/')"
                class="flex items-center gap-2 cursor-pointer rounded-[10px] px-2 py-1 text-gray-500">
                <el-icon>
                    <HomeFilled />
                </el-icon> <span>主页</span>
            </div>
            <div @click="router.push('/smart/chat')" class="flex items-center gap-2 cursor-pointer text-gray-500">
                <el-icon>
                    <MagicStick />
                </el-icon> <span>AI</span>
            </div>
            <div @click="router.push('/word-book/index')" class="flex items-center gap-2 cursor-pointer text-gray-500">
                <el-icon>
                    <Notebook />
                </el-icon> <span>词库</span>
            </div>
            <div @click="router.push('/courses/index')" class="flex items-center gap-2 cursor-pointer text-gray-500">
                <el-icon>
                    <Reading />
                </el-icon> <span>课程</span>
            </div>
            <div @click="router.push('/setting/index')" class="flex items-center gap-2 cursor-pointer text-gray-500">
                <el-icon>
                    <Setting />
                </el-icon> <span>设置</span>
            </div>
            <div class="flex items-center gap-2 bg-blue-200 text-blue-700 rounded-full px-2 py-1"><el-icon>
                    <Sunny />
                </el-icon> <span class="font-bold text-sm">{{ userInstance.user?.dayNumber ?? 0 }}</span></div>
            <div class="flex items-center gap-2 bg-amber-200 text-amber-700 rounded-full px-2 py-1"><el-icon>
                    <Star />
                </el-icon> <span class="font-bold text-sm">{{ userInstance.user?.wordNumber ?? 0 }}</span></div>
            <ElPopover :width="340">
                <template #reference>
                    <div class="flex items-center gap-2 border-l cursor-pointer border-gray-200 pl-4">
                        <img class="w-10 h-10 rounded-full ml-2 mr-2" :src="avatar" />
                        <span class="text-sm font-bold">{{ userInstance.user?.name ?? '游客' }}</span>
                    </div>
                </template>
                <Profile />
            </ElPopover>
        </div>
    </header>
</template>


<script setup lang="ts">
import { Sunny, Star, HomeFilled, Notebook, MagicStick, Reading, Setting } from '@element-plus/icons-vue'
import { userStore } from '@/stores/user';
import avatar from '@/assets/images/avatar/default-avatar.png'
import Profile from '@/layout/Profile/index.vue'
import { ElPopover } from 'element-plus'
import { useRouter } from 'vue-router';
const router = useRouter()

const userInstance = userStore();
</script>