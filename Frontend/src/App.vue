<template>
  <div id="app" :class="{ 'dark-mode': isDarkMode }">
    <template v-if="isAppLoading">
      <div class="app-loading" :class="{ 'dark-mode': isDarkMode }">
        <div class="globe-container">
          <div class="globe">
            <div class="globe-sphere"></div>
            <div class="globe-grid">
              <div class="grid-line horizontal"></div>
              <div class="grid-line horizontal"></div>
              <div class="grid-line horizontal"></div>
              <div class="grid-line vertical"></div>
              <div class="grid-line vertical"></div>
              <div class="grid-line vertical"></div>
            </div>
            <div class="globe-circle"></div>
            <div class="globe-circle"></div>
            <div class="globe-circle"></div>
          </div>
          <div class="plane">
            <svg viewBox="0 0 24 24" width="32" height="32">
              <path fill="currentColor" d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
            </svg>
          </div>
          <div class="trail"></div>
          <div class="trail"></div>
          <div class="trail"></div>
        </div>
        <p class="loading-text">So Where To?</p>
        <p class="loading-subtext">Preparing your adventure...</p>
      </div>
    </template>

    <template v-else>
      <div class="app-container">
        <!-- Header -->
        <AppHeader />

        <!-- Main Content with Transitions -->
        <main class="main-content">
          <router-view v-slot="{ Component, route }">
            <transition 
              :name="route.meta.transition || 'fade'" 
              mode="out-in"
            >
              <component :is="Component" :key="route.path" />
            </transition>
          </router-view>
        </main>

        <!-- Footer -->
        <AppFooter />

        <!-- Back to Top Button -->
        <transition name="fade">
          <button 
            v-show="showBackToTop" 
            class="back-to-top"
            @click="scrollToTop"
            aria-label="Back to top"
          >
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"/>
            </svg>
          </button>
        </transition>

        <!-- Global Notification -->
        <transition name="slide">
          <div v-if="notification.show" class="notification" :class="notification.type">
            <svg class="notification-icon" viewBox="0 0 24 24" width="20" height="20">
              <path v-if="notification.type === 'success'" fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              <path v-else-if="notification.type === 'error'" fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              <path v-else fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <span class="notification-message">{{ notification.message }}</span>
            <button class="notification-close" @click="closeNotification">×</button>
          </div>
        </transition>

        <!-- Cookie Consent Banner -->
        <transition name="slide-up">
          <div v-if="showCookieConsent" class="cookie-consent">
            <div class="cookie-content">
              <p>We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.</p>
              <div class="cookie-actions">
                <button @click="acceptCookies" class="btn btn-primary btn-small">Accept</button>
                <button @click="declineCookies" class="btn btn-outline btn-small">Decline</button>
              </div>
            </div>
          </div>
        </transition>

        <!-- Network Status Indicator -->
        <transition name="fade">
          <div v-if="!isOnline" class="offline-indicator">
            <svg class="offline-icon" viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <span>You are offline. Some features may be unavailable.</span>
          </div>
        </transition>
      </div>
    </template>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '@/components/common/layout/AppHeader.vue'
import AppFooter from '@/components/common/layout/AppFooter.vue'

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    
    // State
    const isAppLoading = ref(true)
    const showBackToTop = ref(false)
    const isOnline = ref(navigator.onLine)

    // Computed
    const isDarkMode = computed(() => store.state.isDarkMode)
    const notification = computed(() => store.state.notification || {
      show: false,
      message: '',
      type: 'info'
    })
    
    const showCookieConsent = computed(() => {
      return !localStorage.getItem('cookiesAccepted')
    })

    // Activity tracking for session timeout
    const updateActivity = () => {
      if (store.getters['auth/isAuthenticated']) {
        store.dispatch('auth/updateActivity')
      }
    }

    // Check for idle timeout
    const checkIdle = () => {
      if (store.getters['auth/isAuthenticated']) {
        store.dispatch('auth/checkIdle')
      }
    }

    // Scroll handler
    const handleScroll = () => {
      showBackToTop.value = window.scrollY > 300
      // Update activity on scroll
      updateActivity()
    }

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }

    // Notification
    const closeNotification = () => {
      store.commit('HIDE_NOTIFICATION')
    }

    // Cookie methods
    const acceptCookies = () => {
      localStorage.setItem('cookiesAccepted', 'true')
      store.commit('SHOW_NOTIFICATION', {
        message: 'Thank you for accepting cookies!',
        type: 'success'
      })
    }

    const declineCookies = () => {
      localStorage.setItem('cookiesAccepted', 'false')
    }

    // Network status
    const updateOnlineStatus = () => {
      isOnline.value = navigator.onLine
      store.commit('SHOW_NOTIFICATION', {
        message: isOnline.value ? 'You are back online!' : 'You are offline',
        type: isOnline.value ? 'success' : 'warning'
      })
    }

    // Initialize app
    const initializeApp = async () => {
      try {
        // Initialize store
        await store.dispatch('init')
        
        // Set theme
        if (store.state.isDarkMode) {
          document.documentElement.classList.add('dark-mode')
        }

        // Check for redirect after login
        const { query } = route
        if (query.redirect) {
          router.push(query.redirect)
        }

      } catch (error) {
        console.error('Failed to initialize app:', error)
      } finally {
        // Hide loading after minimum 3 seconds to enjoy the animation
        setTimeout(() => {
          isAppLoading.value = false
        }, 3000)
      }
    }

    // Lifecycle
    onMounted(() => {
      // Scroll event
      window.addEventListener('scroll', handleScroll)
      
      // Network events
      window.addEventListener('online', updateOnlineStatus)
      window.addEventListener('offline', updateOnlineStatus)
      
      // Activity events for session timeout
      const events = ['mousedown', 'keydown', 'touchstart', 'mousemove']
      events.forEach(event => {
        window.addEventListener(event, updateActivity)
      })
      
      // Check idle every minute
      setInterval(checkIdle, 60000)
      
      // Initialize app
      initializeApp()
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
      
      const events = ['mousedown', 'keydown', 'touchstart', 'mousemove']
      events.forEach(event => {
        window.removeEventListener(event, updateActivity)
      })
    })

    return {
      isAppLoading,
      showBackToTop,
      showCookieConsent,
      isOnline,
      isDarkMode,
      notification,
      scrollToTop,
      closeNotification,
      acceptCookies,
      declineCookies
    }
  }
}
</script>

<style>
/* Global CSS Variables */
:root {
  --primary: #FF6B6B;
  --primary-dark: #FF5252;
  --primary-light: #FFB5B5;
  --secondary: #4A6FA5;
  --secondary-dark: #3A5A84;
  --secondary-light: #7A9BC2;
  --accent: #9B6B9E;
  --success: #28A745;
  --warning: #FFC107;
  --error: #DC3545;
  --info: #17A2B8;
  --white: #F9F9F9;
  --white-pure: #FFFFFF;
  --gray-light: #E0E0E0;
  --gray: #999999;
  --gray-dark: #666666;
  --text: #333333;
  --text-dark: #222222;
  --shadow-sm: 0 2px 4px rgba(0,0,0,0.1);
  --shadow-md: 0 5px 15px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 30px rgba(0,0,0,0.15);
  --radius-sm: 5px;
  --radius-md: 10px;
  --radius-lg: 20px;
  --radius-full: 9999px;
  
  /* Dark mode variables */
  --dark-bg: #0B1E33;
  --dark-surface: #122B44;
  --dark-surface-light: #1A334D;
  --dark-text: #F5F9FF;
  --dark-text-secondary: #B0C4DE;
  --dark-accent: #00D4FF;
  --dark-border: #1A334D;
}

/* Global Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-color: var(--white);
  color: var(--text);
  line-height: 1.6;
  overflow-x: hidden;
}

/* Dark Mode */
.dark-mode {
  background-color: var(--dark-bg);
  color: var(--dark-text);
}

.dark-mode .main-content {
  background-color: var(--dark-bg);
}

/* App Container */
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Main Content */
.main-content {
  flex: 1;
  position: relative;
  background-color: var(--white);
  transition: background-color 0.3s ease;
}

/* ===== LOADING SCREEN - PLANE AROUND GLOBE ===== */
.app-loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

/* Dark mode loading screen */
.app-loading.dark-mode {
  background: linear-gradient(135deg, var(--dark-bg) 0%, var(--dark-surface) 100%);
}

.globe-container {
  position: relative;
  width: 200px;
  height: 200px;
  margin-bottom: 40px;
}

/* Globe */
.globe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  animation: rotate 10s linear infinite;
}

.globe-sphere {
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), rgba(255,255,255,0.2));
  box-shadow: 0 0 30px rgba(255,255,255,0.3);
}

/* Dark mode globe */
.dark-mode .globe-sphere {
  background: radial-gradient(circle at 30% 30%, rgba(0,212,255,0.3), rgba(0,212,255,0.1));
  box-shadow: 0 0 40px rgba(0,212,255,0.3);
}

.globe-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.grid-line {
  position: absolute;
  background: rgba(255,255,255,0.3);
}

.dark-mode .grid-line {
  background: rgba(0,212,255,0.3);
}

.grid-line.horizontal {
  width: 100%;
  height: 1px;
  left: 0;
  transform: rotate(var(--rotation));
}

.grid-line.horizontal:nth-child(1) { top: 25%; --rotation: 0deg; }
.grid-line.horizontal:nth-child(2) { top: 50%; --rotation: 0deg; }
.grid-line.horizontal:nth-child(3) { top: 75%; --rotation: 0deg; }

.grid-line.vertical {
  width: 1px;
  height: 100%;
  top: 0;
  transform: rotate(var(--rotation));
}

.grid-line.vertical:nth-child(4) { left: 25%; --rotation: 0deg; }
.grid-line.vertical:nth-child(5) { left: 50%; --rotation: 0deg; }
.grid-line.vertical:nth-child(6) { left: 75%; --rotation: 0deg; }

.globe-circle {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 2px solid rgba(255,255,255,0.2);
  border-radius: 50%;
  box-shadow: 0 0 20px rgba(255,255,255,0.1);
}

.dark-mode .globe-circle {
  border-color: rgba(0,212,255,0.2);
  box-shadow: 0 0 20px rgba(0,212,255,0.2);
}

.globe-circle:nth-child(7) { transform: rotateX(60deg); }
.globe-circle:nth-child(8) { transform: rotateY(60deg); }
.globe-circle:nth-child(9) { transform: rotateZ(60deg); }

/* Plane */
.plane {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 40px;
  height: 40px;
  margin-top: -20px;
  margin-left: -20px;
  color: white;
  animation: orbit 10s linear infinite;
  filter: drop-shadow(0 0 10px rgba(255,255,255,0.5));
  z-index: 10;
}

.dark-mode .plane {
  color: var(--dark-accent);
  filter: drop-shadow(0 0 15px var(--dark-accent));
}

.plane svg {
  width: 100%;
  height: 100%;
  transform: rotate(90deg);
  animation: plane-bounce 2s ease-in-out infinite;
}

/* Trail effects */
.trail {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 4px;
  margin-top: -2px;
  margin-left: -2px;
  background: white;
  border-radius: 50%;
  animation: trail 2s ease-out infinite;
  opacity: 0;
}

.dark-mode .trail {
  background: var(--dark-accent);
}

.trail:nth-child(11) { animation-delay: 0s; }
.trail:nth-child(12) { animation-delay: 0.3s; }
.trail:nth-child(13) { animation-delay: 0.6s; }

/* Loading Text */
.loading-text {
  color: white;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 8px;
  text-shadow: 0 2px 10px rgba(0,0,0,0.2);
  letter-spacing: 2px;
}

.dark-mode .loading-text {
  color: var(--dark-text);
  text-shadow: 0 2px 10px rgba(0,212,255,0.3);
}

.loading-subtext {
  color: rgba(255,255,255,0.8);
  font-size: 1rem;
  font-weight: 400;
  animation: pulse 2s ease-in-out infinite;
}

.dark-mode .loading-subtext {
  color: var(--dark-text-secondary);
}

/* Animations */
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes orbit {
  from {
    transform: rotate(0deg) translateX(100px) rotate(0deg);
  }
  to {
    transform: rotate(360deg) translateX(100px) rotate(-360deg);
  }
}

@keyframes plane-bounce {
  0%, 100% {
    transform: rotate(90deg) scale(1);
  }
  50% {
    transform: rotate(90deg) scale(1.1);
  }
}

@keyframes trail {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  100% {
    transform: scale(20);
    opacity: 0;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.8;
  }
  50% {
    opacity: 0.5;
  }
}

/* Page Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-enter-from {
  transform: translateX(30px);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(-30px);
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}

/* Back to Top Button */
.back-to-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--primary);
  color: white;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-lg);
  transition: all 0.3s;
  z-index: 99;
}

.back-to-top:hover {
  background: var(--primary-dark);
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(255, 107, 107, 0.4);
}

/* Dark mode back to top */
.dark-mode .back-to-top {
  background: var(--dark-accent);
  color: var(--dark-bg);
}

.dark-mode .back-to-top:hover {
  background: #80EAFF;
}

/* Notification */
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 20px;
  border-radius: var(--radius-md);
  background: white;
  box-shadow: var(--shadow-lg);
  display: flex;
  align-items: center;
  gap: 15px;
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
  max-width: 400px;
  border-left: 4px solid;
}

.notification.success {
  border-left-color: var(--success);
  background: #f0fff4;
}

.notification.error {
  border-left-color: var(--error);
  background: #fff0f0;
}

.notification.warning {
  border-left-color: var(--warning);
  background: #fff9f0;
}

.notification.info {
  border-left-color: var(--info);
  background: #f0f9ff;
}

.notification-icon {
  width: 20px;
  height: 20px;
  color: var(--gray-dark);
  flex-shrink: 0;
}

.notification-message {
  flex: 1;
  color: var(--text);
  font-size: 0.95rem;
}

.notification-close {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: var(--gray);
  padding: 0 5px;
  transition: color 0.3s;
}

.notification-close:hover {
  color: var(--error);
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Dark mode notification */
.dark-mode .notification {
  background: var(--dark-surface);
  border-color: var(--dark-border);
}

.dark-mode .notification.success {
  border-left-color: var(--success);
}

.dark-mode .notification.error {
  border-left-color: var(--error);
}

.dark-mode .notification.warning {
  border-left-color: var(--warning);
}

.dark-mode .notification.info {
  border-left-color: var(--dark-accent);
}

.dark-mode .notification-message {
  color: var(--dark-text);
}

/* Cookie Consent */
.cookie-consent {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--text-dark);
  color: white;
  padding: 15px 30px;
  z-index: 98;
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.cookie-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}

.cookie-content p {
  font-size: 0.95rem;
  opacity: 0.9;
  margin: 0;
}

.cookie-actions {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 30px;
  font-size: 0.95rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: var(--primary);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 107, 107, 0.3);
}

.btn-outline {
  border: 2px solid white;
  color: white;
  background: transparent;
}

.btn-outline:hover {
  background: white;
  color: var(--text-dark);
}

.btn-small {
  padding: 6px 15px;
  font-size: 0.85rem;
}

/* Dark mode buttons */
.dark-mode .btn-outline {
  border-color: var(--dark-accent);
  color: var(--dark-accent);
}

.dark-mode .btn-outline:hover {
  background: var(--dark-accent);
  color: var(--dark-bg);
}

/* Offline Indicator */
.offline-indicator {
  position: fixed;
  bottom: 20px;
  left: 20px;
  background: var(--warning);
  color: var(--text-dark);
  padding: 10px 20px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  font-weight: 500;
  box-shadow: var(--shadow-lg);
  z-index: 98;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.offline-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

/* Dark mode offline indicator */
.dark-mode .offline-indicator {
  background: var(--warning);
  color: var(--dark-bg);
}

/* Utility Classes */
.text-center { text-align: center; }
.mt-1 { margin-top: 0.5rem; }
.mt-2 { margin-top: 1rem; }
.mt-3 { margin-top: 1.5rem; }
.mt-4 { margin-top: 2rem; }
.mt-5 { margin-top: 3rem; }
.mb-1 { margin-bottom: 0.5rem; }
.mb-2 { margin-bottom: 1rem; }
.mb-3 { margin-bottom: 1.5rem; }
.mb-4 { margin-bottom: 2rem; }
.mb-5 { margin-bottom: 3rem; }

/* Focus Styles */
:focus-visible {
  outline: 3px solid var(--primary);
  outline-offset: 2px;
}

.dark-mode :focus-visible {
  outline-color: var(--dark-accent);
}

/* Selection Style */
::selection {
  background: var(--primary);
  color: white;
}

.dark-mode ::selection {
  background: var(--dark-accent);
  color: var(--dark-bg);
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: var(--gray-light);
}

::-webkit-scrollbar-thumb {
  background: var(--primary);
  border-radius: var(--radius-full);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--primary-dark);
}

.dark-mode ::-webkit-scrollbar-track {
  background: var(--dark-surface);
}

.dark-mode ::-webkit-scrollbar-thumb {
  background: var(--dark-accent);
}

.dark-mode ::-webkit-scrollbar-thumb:hover {
  background: #80EAFF;
}

/* Responsive */
@media (max-width: 768px) {
  .globe-container {
    width: 150px;
    height: 150px;
  }
  
  @keyframes orbit {
    from {
      transform: rotate(0deg) translateX(75px) rotate(0deg);
    }
    to {
      transform: rotate(360deg) translateX(75px) rotate(-360deg);
    }
  }
  
  .loading-text {
    font-size: 1.5rem;
  }
  
  .notification {
    top: 10px;
    right: 10px;
    left: 10px;
    max-width: none;
  }
  
  .back-to-top {
    bottom: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
  }
  
  .cookie-content {
    flex-direction: column;
    text-align: center;
    padding: 10px;
  }
  
  .cookie-actions {
    width: 100%;
    justify-content: center;
  }
  
  .offline-indicator {
    left: 10px;
    right: 10px;
    bottom: 10px;
    text-align: center;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .globe-container {
    width: 120px;
    height: 120px;
  }
  
  @keyframes orbit {
    from {
      transform: rotate(0deg) translateX(60px) rotate(0deg);
    }
    to {
      transform: rotate(360deg) translateX(60px) rotate(-360deg);
    }
  }
  
  .loading-text {
    font-size: 1.2rem;
  }
  
  .loading-subtext {
    font-size: 0.9rem;
  }
}
</style>