<template>
  <transition name="modal-fade">
    <div v-if="show" class="modal-overlay" @click.self="handleOverlayClick">
      <div class="modal-container" :class="{ 'dark-mode': isDarkMode }">
        <!-- Header -->
        <div class="modal-header">
          <div class="modal-logo">
            <span class="logo-icon">✈️</span>
            <span class="logo-text">So <span class="highlight">Where To</span>?</span>
          </div>
          <button class="close-btn" @click="closeModal" aria-label="Close">
            <span>✕</span>
          </button>
        </div>

        <!-- Tabs -->
        <div class="modal-tabs">
          <button 
            class="tab-btn" 
            :class="{ active: activeTab === 'login' }"
            @click="activeTab = 'login'"
          >
            <span class="tab-icon">🔐</span>
            <span>Sign In</span>
          </button>
          <button 
            class="tab-btn" 
            :class="{ active: activeTab === 'register' }"
            @click="activeTab = 'register'"
          >
            <span class="tab-icon">📝</span>
            <span>Create Account</span>
          </button>
        </div>

        <!-- Content -->
        <div class="modal-content">
          <transition name="fade" mode="out-in">
            <LoginForm 
              v-if="activeTab === 'login'" 
              @success="handleSuccess"
              @switch-to-register="activeTab = 'register'"
            />
            <RegisterForm 
              v-else 
              @success="handleSuccess"
              @switch-to-login="activeTab = 'login'"
            />
          </transition>
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <p class="guest-text">
            <button @click="continueAsGuest" class="guest-link">
              Continue as Guest
            </button>
          </p>
          <p class="terms-text">
            By continuing, you agree to our 
            <router-link to="/terms" @click="closeModal">Terms</router-link> and 
            <router-link to="/privacy" @click="closeModal">Privacy Policy</router-link>
          </p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import LoginForm from './LoginForm.vue'
import RegisterForm from './RegisterForm.vue'

export default {
  name: 'AuthModal',
  components: {
    LoginForm,
    RegisterForm
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    initialTab: {
      type: String,
      default: 'login', // 'login' or 'register'
      validator: (value) => ['login', 'register'].includes(value)
    },
    returnUrl: {
      type: String,
      default: null
    },
    closeOnSuccess: {
      type: Boolean,
      default: true
    },
    closeOnOverlayClick: {
      type: Boolean,
      default: true
    }
  },
  emits: ['close', 'success', 'guest'],
  setup(props, { emit }) {
    const store = useStore()
    const router = useRouter()
    
    const activeTab = ref(props.initialTab)
    const isDarkMode = computed(() => store.state.isDarkMode)

    // Watch for prop changes
    watch(() => props.initialTab, (newVal) => {
      activeTab.value = newVal
    })

    // Handle escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape' && props.show) {
        closeModal()
      }
    }

    onMounted(() => {
      document.addEventListener('keydown', handleEscape)
    })

    onUnmounted(() => {
      document.removeEventListener('keydown', handleEscape)
    })

    // Methods
    const closeModal = () => {
      emit('close')
    }

    const handleOverlayClick = () => {
      if (props.closeOnOverlayClick) {
        closeModal()
      }
    }

    const handleSuccess = (user) => {
      if (props.closeOnSuccess) {
        closeModal()
      }
      
      emit('success', user)
      
      // Redirect if returnUrl provided
      if (props.returnUrl) {
        router.push(props.returnUrl)
      }
    }

    const continueAsGuest = () => {
      emit('guest')
      closeModal()
    }

    return {
      activeTab,
      isDarkMode,
      closeModal,
      handleOverlayClick,
      handleSuccess,
      continueAsGuest
    }
  }
}
</script>

<style scoped>
/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

/* Modal Container */
.modal-container {
  background: white;
  border-radius: 24px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: modalSlideUp 0.4s ease;
}

/* Dark Mode */
.modal-container.dark-mode {
  background: #0B1E33;
  border: 1px solid #00D4FF;
}

/* Animations */
@keyframes modalSlideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 16px;
  border-bottom: 1px solid #e0e0e0;
}

.dark-mode .modal-header {
  border-bottom-color: #1A334D;
}

.modal-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.3rem;
  font-weight: 700;
}

.logo-icon {
  font-size: 1.8rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.logo-text {
  color: #333;
}

.dark-mode .logo-text {
  color: #F5F9FF;
}

.logo-text .highlight {
  color: #FF6B6B;
  position: relative;
}

.logo-text .highlight::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 0;
  width: 100%;
  height: 6px;
  background: rgba(255, 107, 107, 0.2);
  z-index: -1;
}

.dark-mode .logo-text .highlight {
  color: #00D4FF;
}

.dark-mode .logo-text .highlight::after {
  background: rgba(0, 212, 255, 0.2);
}

.close-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: #f0f0f0;
  color: #666;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.close-btn:hover {
  background: #FF6B6B;
  color: white;
  transform: rotate(90deg);
}

.dark-mode .close-btn {
  background: #122B44;
  color: #B0C4DE;
}

.dark-mode .close-btn:hover {
  background: #00D4FF;
  color: #0B1E33;
}

/* Tabs */
.modal-tabs {
  display: flex;
  padding: 16px 24px;
  gap: 12px;
  border-bottom: 1px solid #e0e0e0;
}

.dark-mode .modal-tabs {
  border-bottom-color: #1A334D;
}

.tab-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  background: transparent;
  color: #666;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.tab-btn:hover {
  border-color: #FF6B6B;
  color: #FF6B6B;
}

.tab-btn.active {
  background: #FF6B6B;
  border-color: #FF6B6B;
  color: white;
}

.dark-mode .tab-btn {
  border-color: #1A334D;
  color: #B0C4DE;
}

.dark-mode .tab-btn:hover {
  border-color: #00D4FF;
  color: #00D4FF;
}

.dark-mode .tab-btn.active {
  background: #00D4FF;
  border-color: #00D4FF;
  color: #0B1E33;
}

.tab-icon {
  font-size: 1.2rem;
}

/* Content */
.modal-content {
  padding: 24px;
}

/* Footer */
.modal-footer {
  padding: 16px 24px 24px;
  text-align: center;
  border-top: 1px solid #e0e0e0;
}

.dark-mode .modal-footer {
  border-top-color: #1A334D;
}

.guest-text {
  margin-bottom: 12px;
}

.guest-link {
  background: none;
  border: none;
  color: #FF6B6B;
  font-size: 0.95rem;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.3s;
}

.guest-link:hover {
  color: #FF5252;
}

.dark-mode .guest-link {
  color: #00D4FF;
}

.dark-mode .guest-link:hover {
  color: #80EAFF;
}

.terms-text {
  color: #999;
  font-size: 0.8rem;
  line-height: 1.5;
}

.terms-text a {
  color: #FF6B6B;
  text-decoration: none;
  font-weight: 500;
}

.terms-text a:hover {
  text-decoration: underline;
}

.dark-mode .terms-text {
  color: #B0C4DE;
}

.dark-mode .terms-text a {
  color: #00D4FF;
}

/* Scrollbar Styling */
.modal-container::-webkit-scrollbar {
  width: 8px;
}

.modal-container::-webkit-scrollbar-track {
  background: #f0f0f0;
  border-radius: 4px;
}

.modal-container::-webkit-scrollbar-thumb {
  background: #FF6B6B;
  border-radius: 4px;
}

.modal-container::-webkit-scrollbar-thumb:hover {
  background: #FF5252;
}

.dark-mode .modal-container::-webkit-scrollbar-track {
  background: #122B44;
}

.dark-mode .modal-container::-webkit-scrollbar-thumb {
  background: #00D4FF;
}

.dark-mode .modal-container::-webkit-scrollbar-thumb:hover {
  background: #80EAFF;
}

/* Responsive */
@media (max-width: 480px) {
  .modal-container {
    max-height: 95vh;
  }
  
  .modal-header {
    padding: 16px;
  }
  
  .modal-tabs {
    padding: 12px 16px;
  }
  
  .modal-content {
    padding: 16px;
  }
  
  .modal-footer {
    padding: 16px;
  }
  
  .tab-btn {
    padding: 8px;
    font-size: 0.9rem;
  }
}
</style>