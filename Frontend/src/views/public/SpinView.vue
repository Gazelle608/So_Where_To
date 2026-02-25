<template>
  <div class="spin-view">
    <div class="spin-header">
      <h1 class="page-title">Spin the <span>Globe</span></h1>
      <p class="page-subtitle">
        {{ isAuthenticated ? 'Click any marker to book your mystery' : 'Sign in to book destinations' }}
      </p>
    </div>

    <!-- Interactive Globe with Spin Button -->
    <div class="globe-wrapper">
      <RealisticGlobe 
        ref="globeRef"
        :interactive="true"
        @locationSelected="handleLocationSelected"
        @spin="handleSpin"
        @spin-complete="handleSpinComplete"
      />
      
      <!-- Spin Button -->
      <button class="spin-globe-btn" @click="spinGlobe" :disabled="isSpinning">
        <svg v-if="!isSpinning" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="currentColor"/>
        </svg>
        <span v-if="isSpinning" class="spinner-small"></span>
        <span>{{ isSpinning ? 'Spinning...' : 'Spin the Globe' }}</span>
      </button>
    </div>

    <!-- Info Cards -->
    <div class="spin-info">
      <div class="info-card">
        <div class="info-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="currentColor"/>
          </svg>
        </div>
        <h3>50+ Destinations</h3>
        <p>Worldwide locations waiting to be discovered</p>
      </div>
      
      <div class="info-card">
        <div class="info-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.5 1L8 7h7l-3.5-6zm0 22L8 17h7l-3.5 6zM2 12.5L8 9v7l-6-3.5zm22 0L16 9v7l6-3.5z" fill="currentColor"/>
          </svg>
        </div>
        <h3>From R799</h3>
        <p>All-inclusive mystery bundles</p>
      </div>
      
      <div class="info-card">
        <div class="info-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 6h-2v2h2v10H4V8h2V6H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-8 6c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm6-6v2H6V6h12z" fill="currentColor"/>
          </svg>
        </div>
        <h3>Reveal Later</h3>
        <p>Destination revealed after purchase</p>
      </div>
    </div>

    <!-- CTA for non-authenticated users -->
    <div v-if="!isAuthenticated" class="spin-cta">
      <p>Ready to book your mystery adventure?</p>
      <div class="cta-buttons">
        <router-link to="/register" class="btn btn-primary">
          <span>Create Account</span>
        </router-link>
        <router-link to="/login" class="btn btn-outline">
          <span>Sign In</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import RealisticGlobe from '@/components/protected/RealisticGlobe.vue'

export default {
  name: 'SpinView',
  components: {
    RealisticGlobe
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const globeRef = ref(null)
    const isSpinning = ref(false)
    
    const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])
    
    const spinGlobe = async () => {
      if (globeRef.value) {
        isSpinning.value = true
        try {
          // Call the exposed method
          await globeRef.value.spinGlobe()
        } catch (error) {
          console.error('Failed to spin globe:', error)
          isSpinning.value = false
        }
      }
    }
    
    const handleSpin = () => {
      console.log('Globe started spinning')
    }
    
    const handleSpinComplete = () => {
      console.log('Globe finished spinning')
      isSpinning.value = false
    }
    
    const handleLocationSelected = (location) => {
      if (isAuthenticated.value) {
        localStorage.setItem('selected_destination', JSON.stringify(location))
        router.push('/bookings')
      } else {
        store.commit('SHOW_NOTIFICATION', {
          message: 'Please sign in to book destinations',
          type: 'info'
        })
      }
    }
    
    return {
      globeRef,
      isAuthenticated,
      isSpinning,
      spinGlobe,
      handleSpin,
      handleSpinComplete,
      handleLocationSelected
    }
  }
}
</script>

<style scoped>
.spin-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.spin-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  font-size: 3.5rem;
  color: #333333;
  margin-bottom: 10px;
}

.page-title span {
  color: #FF6B6B;
  position: relative;
}

.page-title span::after {
  content: '';
  position: absolute;
  bottom: 5px;
  left: 0;
  width: 100%;
  height: 8px;
  background: rgba(255, 107, 107, 0.2);
  z-index: -1;
}

.page-subtitle {
  font-size: 1.2rem;
  color: #666666;
}

.globe-wrapper {
  position: relative;
  width: 100%;
  margin-bottom: 40px;
}

.spin-globe-btn {
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #FF6B6B;
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 5px 20px rgba(255, 107, 107, 0.3);
}

.spin-globe-btn:hover:not(:disabled) {
  background: #FF5252;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(255, 107, 107, 0.4);
}

.spin-globe-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner-small {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.spin-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin: 60px 0 40px;
}

.info-card {
  text-align: center;
  padding: 30px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}

.info-card:hover {
  transform: translateY(-5px);
}

.info-icon {
  margin-bottom: 15px;
  color: #FF6B6B;
}

.info-icon svg {
  width: 48px;
  height: 48px;
}

.info-card h3 {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 10px;
}

.info-card p {
  color: #666;
  line-height: 1.5;
}

.spin-cta {
  text-align: center;
  padding: 40px;
  background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
  border-radius: 20px;
  margin-top: 40px;
}

.spin-cta p {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 20px;
}

.cta-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.btn {
  padding: 12px 30px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
  display: inline-block;
}

.btn-primary {
  background: #FF6B6B;
  color: white;
}

.btn-primary:hover {
  background: #FF5252;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(255, 107, 107, 0.4);
}

.btn-outline {
  border: 2px solid #FF6B6B;
  color: #FF6B6B;
  background: transparent;
}

.btn-outline:hover {
  background: #FF6B6B;
  color: white;
  transform: translateY(-2px);
}

/* Dark mode */
:root.dark-mode .page-title {
  color: #F5F9FF;
}

:root.dark-mode .page-subtitle {
  color: #B0C4DE;
}

:root.dark-mode .spin-globe-btn {
  background: #00D4FF;
  color: #0B1E33;
  box-shadow: 0 5px 20px rgba(0, 212, 255, 0.3);
}

:root.dark-mode .spin-globe-btn:hover:not(:disabled) {
  background: #80EAFF;
}

:root.dark-mode .info-card {
  background: #0B1E33;
  border: 1px solid #1A334D;
}

:root.dark-mode .info-card h3 {
  color: #F5F9FF;
}

:root.dark-mode .info-card p {
  color: #B0C4DE;
}

:root.dark-mode .info-icon svg {
  color: #00D4FF;
}

:root.dark-mode .spin-cta {
  background: linear-gradient(135deg, #0B1E33 0%, #1A334D 100%);
}

:root.dark-mode .spin-cta p {
  color: #F5F9FF;
}

:root.dark-mode .btn-primary {
  background: #00D4FF;
  color: #0B1E33;
}

:root.dark-mode .btn-outline {
  border-color: #00D4FF;
  color: #00D4FF;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2.5rem;
  }
  
  .spin-info {
    grid-template-columns: 1fr;
  }
  
  .cta-buttons {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}
</style>