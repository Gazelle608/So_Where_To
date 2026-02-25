<template>
  <div class="loading-spinner" :class="[size, { 'fullscreen': fullscreen }]">
    <!-- Animated Globe for Dark Mode, Classic Spinner for Light Mode -->
    <div class="spinner-container">
      <!-- Dark Mode Globe Animation -->
      <div v-if="isDarkMode" class="globe-spinner">
        <div class="globe">
          <div class="globe-hemisphere north"></div>
          <div class="globe-hemisphere south"></div>
          <div class="globe-line longitude"></div>
          <div class="globe-line latitude"></div>
          <div class="globe-plane">✈️</div>
        </div>
      </div>
      
      <!-- Light Mode Classic Spinner -->
      <div v-else class="classic-spinner" :class="size">
        <div class="spinner-ring"></div>
        <div class="spinner-ring-inner"></div>
        <div class="spinner-dot"></div>
      </div>
    </div>

    <!-- Message -->
    <div v-if="message" class="message-container">
      <p class="spinner-message">{{ message }}</p>
      <p v-if="submessage" class="spinner-submessage">{{ submessage }}</p>
    </div>

    <!-- Progress Bar (Optional) -->
    <div v-if="showProgress" class="progress-container">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progress + '%' }"></div>
      </div>
      <span class="progress-text">{{ progress }}%</span>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'LoadingSpinner',
  props: {
    message: {
      type: String,
      default: 'Loading...'
    },
    submessage: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'medium', // small, medium, large
      validator: (value) => ['small', 'medium', 'large'].includes(value)
    },
    fullscreen: {
      type: Boolean,
      default: false
    },
    showProgress: {
      type: Boolean,
      default: false
    },
    progress: {
      type: Number,
      default: 0,
      validator: (value) => value >= 0 && value <= 100
    },
    theme: {
      type: String,
      default: 'auto', // auto, light, dark
      validator: (value) => ['auto', 'light', 'dark'].includes(value)
    }
  },
  setup(props) {
    const store = useStore()
    
    // Determine theme based on prop or store
    const isDarkMode = computed(() => {
      if (props.theme === 'dark') return true
      if (props.theme === 'light') return false
      return store.state.isDarkMode || false
    })
    
    return {
      isDarkMode
    }
  }
}
</script>

<style scoped>
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 2rem;
  transition: all 0.3s ease;
}

.loading-spinner.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--bg-color, rgba(255, 255, 255, 0.95));
  backdrop-filter: blur(8px);
  z-index: 9999;
  padding: 0;
}

/* Dark mode fullscreen background */
:root.dark-mode .loading-spinner.fullscreen {
  background: rgba(11, 30, 51, 0.98);
}

.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100px;
}

/* ===== LIGHT MODE SPINNER ===== */
.classic-spinner {
  position: relative;
  width: 60px;
  height: 60px;
}

.classic-spinner.small {
  width: 40px;
  height: 40px;
}

.classic-spinner.large {
  width: 80px;
  height: 80px;
}

.spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 4px solid transparent;
  border-top-color: #FF6B6B;
  border-right-color: #FF6B6B;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-ring-inner {
  position: absolute;
  top: 8px;
  left: 8px;
  right: 8px;
  bottom: 8px;
  border: 4px solid transparent;
  border-bottom-color: #4A6FA5;
  border-left-color: #4A6FA5;
  border-radius: 50%;
  animation: spin-reverse 1.5s linear infinite;
}

.spinner-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  background: linear-gradient(135deg, #FF6B6B, #4A6FA5);
  border-radius: 50%;
  animation: pulse 1s ease-in-out infinite;
}

.classic-spinner.small .spinner-ring-inner {
  top: 5px;
  left: 5px;
  right: 5px;
  bottom: 5px;
  border-width: 3px;
}

.classic-spinner.small .spinner-dot {
  width: 8px;
  height: 8px;
}

.classic-spinner.large .spinner-ring-inner {
  top: 12px;
  left: 12px;
  right: 12px;
  bottom: 12px;
  border-width: 5px;
}

.classic-spinner.large .spinner-dot {
  width: 16px;
  height: 16px;
}

/* ===== DARK MODE GLOBE SPINNER (Airport Terminal Theme) ===== */
.globe-spinner {
  position: relative;
  width: 80px;
  height: 80px;
  perspective: 1000px;
}

.loading-spinner.small .globe-spinner {
  width: 50px;
  height: 50px;
}

.loading-spinner.large .globe-spinner {
  width: 120px;
  height: 120px;
}

.globe {
  position: relative;
  width: 100%;
  height: 100%;
  animation: globe-spin 3s ease-in-out infinite;
  transform-style: preserve-3d;
}

@keyframes globe-spin {
  0% {
    transform: rotateY(0deg) rotateX(20deg);
  }
  25% {
    transform: rotateY(90deg) rotateX(20deg);
  }
  50% {
    transform: rotateY(180deg) rotateX(20deg);
  }
  75% {
    transform: rotateY(270deg) rotateX(20deg);
  }
  100% {
    transform: rotateY(360deg) rotateX(20deg);
  }
}

.globe-hemisphere {
  position: absolute;
  width: 100%;
  height: 50%;
  left: 0;
  background: rgba(0, 212, 255, 0.2);
  border: 2px solid #00D4FF;
  overflow: hidden;
}

.globe-hemisphere.north {
  top: 0;
  border-radius: 50% 50% 0 0;
  border-bottom: none;
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.3), rgba(0, 212, 255, 0.1));
}

.globe-hemisphere.south {
  bottom: 0;
  border-radius: 0 0 50% 50%;
  border-top: none;
  background: linear-gradient(45deg, rgba(0, 212, 255, 0.2), rgba(0, 212, 255, 0.05));
}

.globe-line {
  position: absolute;
  background: rgba(0, 212, 255, 0.3);
  box-shadow: 0 0 8px #00D4FF;
}

.globe-line.longitude {
  width: 2px;
  height: 100%;
  left: 50%;
  transform: translateX(-50%);
}

.globe-line.latitude {
  width: 100%;
  height: 2px;
  top: 50%;
  transform: translateY(-50%);
}

.globe-plane {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotateY(0deg);
  font-size: 24px;
  animation: plane-orbit 1.5s linear infinite;
  filter: drop-shadow(0 0 10px #00D4FF);
  z-index: 10;
}

/* @keyframes plane-orbit {
  from {
    transform: translate(-50%, -50%) rotateY(0deg) translateZ(40px);
  }
  to {
    transform: translate(-50%, -50%) rotateY(-360deg) translateZ(40px);
  }
} */
@keyframes plane-orbit {
  0% {
    transform: translate(-50%, -50%) rotateY(0deg) translateZ(40px);
  }
  25% {
    transform: translate(-50%, -50%) rotateY(90deg) translateZ(40px);
  }
  50% {
    transform: translate(-50%, -50%) rotateY(180deg) translateZ(40px);
  }
  75% {
    transform: translate(-50%, -50%) rotateY(270deg) translateZ(40px);
  }
  100% {
    transform: translate(-50%, -50%) rotateY(360deg) translateZ(40px);
  }
}

.loading-spinner.small .globe-plane {
  font-size: 16px;
}

.loading-spinner.small .globe-line {
  opacity: 0.5;
}

.loading-spinner.large .globe-plane {
  font-size: 32px;
}

/* Message Container */
.message-container {
  text-align: center;
  max-width: 300px;
}

.spinner-message {
  color: var(--text-color, #333333);
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
  animation: fadeInUp 0.3s ease;
}

.spinner-submessage {
  color: var(--text-secondary, #666666);
  font-size: 0.9rem;
  opacity: 0.8;
  animation: fadeInUp 0.3s ease 0.1s both;
}

/* Dark mode text */
:root.dark-mode .spinner-message {
  color: #F5F9FF;
}

:root.dark-mode .spinner-submessage {
  color: #B0C4DE;
}

/* Progress Bar */
.progress-container {
  width: 200px;
  display: flex;
  align-items: center;
  gap: 10px;
  animation: fadeInUp 0.3s ease 0.2s both;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

:root.dark-mode .progress-bar {
  background: rgba(255, 255, 255, 0.1);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #FF6B6B, #00D4FF);
  border-radius: 3px;
  transition: width 0.3s ease;
  box-shadow: 0 0 10px rgba(255, 107, 107, 0.5);
}

.progress-text {
  color: var(--text-color, #333333);
  font-size: 0.9rem;
  font-weight: 600;
  min-width: 45px;
}

:root.dark-mode .progress-text {
  color: #00D4FF;
}

/* Animations */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes spin-reverse {
  to {
    transform: rotate(-360deg);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.7;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Size Variations */
.loading-spinner.small {
  padding: 1rem;
}

.loading-spinner.small .spinner-message {
  font-size: 0.9rem;
}

.loading-spinner.small .spinner-submessage {
  font-size: 0.8rem;
}

.loading-spinner.large {
  padding: 3rem;
}

.loading-spinner.large .spinner-message {
  font-size: 1.3rem;
}

.loading-spinner.large .spinner-submessage {
  font-size: 1rem;
}

/* Custom animations for different states */
.loading-spinner.error .classic-spinner .spinner-ring {
  border-top-color: #DC3545;
  border-right-color: #DC3545;
}

.loading-spinner.error .classic-spinner .spinner-ring-inner {
  border-bottom-color: #DC3545;
  border-left-color: #DC3545;
}

.loading-spinner.error .classic-spinner .spinner-dot {
  background: #DC3545;
}

.loading-spinner.success .classic-spinner .spinner-ring {
  border-top-color: #28A745;
  border-right-color: #28A745;
}

.loading-spinner.success .classic-spinner .spinner-ring-inner {
  border-bottom-color: #28A745;
  border-left-color: #28A745;
}

.loading-spinner.success .classic-spinner .spinner-dot {
  background: #28A745;
}

/* Responsive */
@media (max-width: 768px) {
  .loading-spinner.fullscreen {
    padding: 1rem;
  }
  
  .progress-container {
    width: 150px;
  }
  
  .globe-plane {
    font-size: 20px;
  }
  
  .loading-spinner.large .globe-plane {
    font-size: 28px;
  }
}

@media (max-width: 480px) {
  .globe-spinner {
    width: 60px;
    height: 60px;
  }
  
  .globe-plane {
    font-size: 16px;
  }
  
  .spinner-message {
    font-size: 1rem;
  }
  
  .progress-container {
    width: 120px;
    flex-direction: column;
    gap: 5px;
  }
}
</style>