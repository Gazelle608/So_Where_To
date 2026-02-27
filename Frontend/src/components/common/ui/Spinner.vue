<template>
    <div class="globe-container">
        <canvas ref="globeCanvas" class="globe-canvas"></canvas>
    </div>

    <div class="spinner-overlay" v-if="!globeReady">
        <div class="spinner">
            <div class="double-bounce1"></div>
            <div class="double-bounce2"></div>
        </div>
    </div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { onMounted, ref } from 'vue'

export default {
    setup() {
        const globeCanvas = ref(null)
        const globeReady = ref(false)

        onMounted(() => {
            const scene = new THREE.Scene()
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
            camera.position.z = 5

            const renderer = new THREE.WebGLRenderer({ canvas: globeCanvas.value })
            renderer.setSize(window.innerWidth, window.innerHeight)

            const loader = new GLTFLoader()
            loader.load('/globe.glb', (gltf) => {
                scene.add(gltf.scene)
                globeReady.value = true
            })

            const controls = new OrbitControls(camera, renderer.domElement)
            controls.enableDamping = true

            const animate = () => {
                requestAnimationFrame(animate)
                controls.update()
                renderer.render(scene, camera)
            }

            animate()

            window.addEventListener('resize', () => {
                camera.aspect = window.innerWidth / window.innerHeight
                camera.updateProjectionMatrix()
                renderer.setSize(window.innerWidth, window.innerHeight)
            })
            }
        )

        return {
            globeCanvas,
            globeReady
        }
    }
}
</script>

<style scoped>
.globe-container {
    position: relative;
    width: 100%;
    height: 100vh;
}

.globe-canvas {
    width: 100%;
    height: 100%;
    display: block;
}

.spinner-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
}

.spinner {
    width: 40px;
    height: 40px;
    position: relative;
}

.double-bounce1, .double-bounce2 {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #FF6B6B;
    opacity: 0.6;
    position: absolute;
    top: 0;
    left: 0;
    
    animation: bounce 2.0s infinite ease-in-out;
}
.double-bounce2 {
    animation-delay: -1.0s;
}

@keyframes bounce {
    0%, 100% {
        transform: scale(0.0);
    } 50% {
        transform: scale(1.0);
    }
}

@media (max-width: 768px) {
    .globe-container {
        height: 50vh;
    }
}
</style>