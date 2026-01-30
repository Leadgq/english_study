<template>
    <div class="relative w-[800px] h-full bg-linear-to-br from-gray-800 to-gray-900">
        <canvas class="w-full h-full" ref="canvasRef"></canvas>
        <div class="absolute top-6 left-6">
            <div class="flex items-center gap-2">
                <div
                    class="w-10 h-10 bg-linear-to-br from-indigo-500 to-purple-600 rounded-[10px] flex items-center justify-center">
                    <span class="text-white font-bold text-xl">E</span>
                </div>
                <span class="text-white text-xl font-bold">English App</span>
            </div>
        </div>
        <!-- 登录/注册切换按钮 -->
        <div class="absolute top-6 right-6">
            <div class="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-1">
                <button @click="loadModel('login')" :class="loginClass">
                    登录
                </button>
                <button @click="loadModel('register')" :class="registerClass">
                    注册
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, useTemplateRef } from 'vue'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { loginAndRegisterType } from './types';


const type = ref<'login' | 'register'>('login')
const canvasRef = useTemplateRef<HTMLCanvasElement>('canvasRef');

const loginClass = computed(() => {
    return type.value === 'login' ? 'bg-indigo-500 text-white shadow-lg px-4 py-2 rounded-md text-sm font-medium transition-all' : 'text-white/70 hover:text-white hover:bg-white/10 px-4 py-2 rounded-md text-sm font-medium transition-all'
})
const registerClass = computed(() => {
    return type.value === 'register' ? 'bg-indigo-500 text-white shadow-lg px-4 py-2 rounded-md text-sm font-medium transition-all' : 'text-white/70 hover:text-white hover:bg-white/10 px-4 py-2 rounded-md text-sm font-medium transition-all'
})

const emits = defineEmits(['changeType']);


const scene = new THREE.Scene();

let mixer: THREE.AnimationMixer;
const clock = new THREE.Clock();

let currentModel: THREE.Object3D | null = null;

function loadModel(url: loginAndRegisterType) {
    type.value = url;
    if (currentModel) {
        scene.remove(currentModel);
        currentModel = null;
    }
    const loader = new GLTFLoader();
    if (url === 'login') {
        loader.load('/models/login/scene.gltf', (gltf) => {
            currentModel = gltf.scene;
            scene.add(currentModel);
            scene.position.y = -0.8;
            // 调整模型大小
            currentModel.scale.set(0.8, 0.8, 0.8);
        })
    }
    if (url === 'register') {
        loader.load('/models/register/scene.gltf', (gltf) => {
            currentModel = gltf.scene;
            scene.add(currentModel);
            scene.position.y = -0.8;
            // 调整模型大小
            currentModel.scale.set(0.8, 0.8, 0.8);
            // 创建动画混合器
            mixer = new THREE.AnimationMixer(currentModel);
            // 加载动画
            gltf.animations.forEach(animation => {
                mixer.clipAction(animation).play();
            });
        })
    }
    emits('changeType', url);
}

function initTree() {
    const width = canvasRef.value!.clientWidth;
    const height = canvasRef.value!.clientHeight;
    // 创建相机
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(1, 0.5, 1)
    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({
        antialias: true, // 开启抗锯齿
        powerPreference: "high-performance", // 开启高性能模式
        alpha: true, // 开启透明背景
        canvas: canvasRef.value!, // 指定渲染到的 canvas 元素
        precision: "highp", // 高精度渲染
    });
    renderer.setSize(width, height);
    loadModel(type.value);
    // 创建控制器
    const controls = new OrbitControls(camera, renderer.domElement);

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        const delta = clock.getDelta();
        // 更新动画
        if (mixer) {
            mixer.update(delta);
        }
        // 旋转模型
        scene.rotation.y += 0.005;
        renderer.render(scene, camera);
    }
    animate();
}



onMounted(() => {
    initTree();
})
</script>