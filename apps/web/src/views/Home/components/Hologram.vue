<template>
    <canvas ref="hologramRef"></canvas>
</template>

<script setup lang='ts'>
import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import { onMounted, useTemplateRef } from 'vue';

const hologramRef = useTemplateRef<HTMLCanvasElement>('hologramRef')

function initTree() {
    // 创建场景 ->  相机 -> 渲染器
    const scene = new THREE.Scene()
    // 相机 
    const camera = new THREE.PerspectiveCamera(75, 500 / 250, 0.1, 1000);
    camera.position.set(0, 0, 10)

    //动画混合器
    let mixer: THREE.AnimationMixer | null = null

    const clock = new THREE.Clock() //创建时钟

    const loader = new GLTFLoader()
    loader.load(
        '/models/hologram/scene.gltf',
        function (gltf) {
            scene.add(gltf.scene);
            gltf.scene.scale.set(4, 4, 4)
            if (gltf.animations && gltf.animations.length > 0) {
                gltf.animations.forEach(clip => {
                    mixer = new THREE.AnimationMixer(gltf.scene)
                    const action = mixer.clipAction(clip);
                    action.play();
                })
            }
        }
    )
    // 环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    // 平行光
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // 创建渲染
    const render = new THREE.WebGLRenderer({
        alpha: true, //透明背景
        canvas: hologramRef.value!,   // 渲染器绑定canvas
        antialias: true,        // 开启抗锯齿
        powerPreference: "high-performance", // 开启高性能渲染
        precision: "highp", // 高精度渲染
    })
    render.setSize(500, 250);

    // 创建轨道
    const controls = new OrbitControls(camera, render.domElement);

    const animate = () => {
        requestAnimationFrame(animate);
        const delta = clock.getDelta() //1 - 2
        if (mixer) {
            mixer.update(delta) //更新动画混合器
        }
        controls.update();
        render.render(scene, camera);
    }

    animate();
}

onMounted(() => {
    initTree()
})
</script>
<style scoped></style>