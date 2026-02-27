<template>
  <div class="dashboard-view">
    <div class="container">
      <!-- Welcome Section -->
      <div class="welcome-section">
        <div class="welcome-text">
          <h1 class="welcome-title">
            Welcome back, <span class="highlight">{{ userFirstName }}</span>!
          </h1>
          <p class="welcome-subtitle">
            Your next adventure is waiting. What will it be today?
          </p>
        </div>
        <div class="welcome-actions">
          <router-link to="/spin" class="btn btn-primary">
            <svg class="btn-icon" viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
            </svg>
            <span>Spin Now</span>
          </router-link>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon-wrapper">
            <svg class="stat-icon" viewBox="0 0 24 24" width="32" height="32">
              <path fill="currentColor" d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.upcoming }}</span>
            <span class="stat-label">Upcoming Trips</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrapper">
            <svg class="stat-icon" viewBox="0 0 24 24" width="32" height="32">
              <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.completed }}</span>
            <span class="stat-label">Completed</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrapper">
            <svg class="stat-icon" viewBox="0 0 24 24" width="32" height="32">
              <path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.wishlist }}</span>
            <span class="stat-label">Wishlist</span>
          </div>
        </div>
      </div>

      <!-- Quick Actions Grid -->
      <h2 class="section-title">Quick Actions</h2>
      <div class="actions-grid">
        <router-link to="/spin" class="action-card">
          <div class="action-icon-wrapper">
            <svg class="action-icon" viewBox="0 0 24 24" width="48" height="48">
              <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
            </svg>
          </div>
          <h3 class="action-title">Spin the Globe</h3>
          <p class="action-description">Find your next mystery destination</p>
          <span class="action-link">
            <span>Get Started</span>
            <svg class="arrow-icon" viewBox="0 0 24 24" width="16" height="16">
              <path fill="currentColor" d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
            </svg>
          </span>
        </router-link>

        <router-link to="/bookings" class="action-card">
          <div class="action-icon-wrapper">
            <svg class="action-icon" viewBox="0 0 24 24" width="48" height="48">
              <path fill="currentColor" d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
            </svg>
          </div>
          <h3 class="action-title">My Bookings</h3>
          <p class="action-description">View your upcoming adventures</p>
          <span class="action-link">
            <span>View All</span>
            <svg class="arrow-icon" viewBox="0 0 24 24" width="16" height="16">
              <path fill="currentColor" d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
            </svg>
          </span>
        </router-link>

        <router-link to="/profile" class="action-card">
          <div class="action-icon-wrapper">
            <svg class="action-icon" viewBox="0 0 24 24" width="48" height="48">
              <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
            </svg>
          </div>
          <h3 class="action-title">My Profile</h3>
          <p class="action-description">Manage your preferences</p>
          <span class="action-link">
            <span>Edit Profile</span>
            <svg class="arrow-icon" viewBox="0 0 24 24" width="16" height="16">
              <path fill="currentColor" d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
            </svg>
          </span>
        </router-link>
      </div>

      <!-- Recent Activity Section (Optional) -->
      <div class="recent-section">
        <h2 class="section-title">Recent Activity</h2>
        <div class="activity-list">
          <div class="activity-item" v-for="(activity, index) in recentActivities" :key="index">
            <div class="activity-icon-wrapper">
              <svg class="activity-icon" viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <div class="activity-content">
              <p class="activity-text">{{ activity.text }}</p>
              <p class="activity-time">{{ activity.time }}</p>
            </div>
          </div>
          <div v-if="recentActivities.length === 0" class="no-activity">
            <p>No recent activity to show</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Session Timeout Warning -->
    <transition name="fade">
      <div v-if="showTimeoutWarning" class="timeout-warning">
        <div class="timeout-content">
          <svg class="warning-icon" viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          <div class="timeout-text">
            <h4>Session Timeout Warning</h4>
            <p>You've been idle for a while. You'll be logged out in {{ timeoutSeconds }} seconds.</p>
          </div>
          <button class="btn btn-primary btn-small" @click="stayLoggedIn">
            Stay Logged In
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'DashboardView',
  setup() {
    const store = useStore()
    const router = useRouter()
    
    // User data
    const user = computed(() => store.state.auth.user || {})
    const userFirstName = computed(() => user.value.firstName || 'Adventurer')
    
    // Stats (replace with real data from API)
    const stats = ref({
      upcoming: 2,
      completed: 5,
      wishlist: 8
    })
    
    // Recent activities
    const recentActivities = ref([
      {
        text: 'You spun the globe and found a mystery offer',
        time: '2 hours ago'
      },
      {
        text: 'Added "Paris" to your wishlist',
        time: 'yesterday'
      },
      {
        text: 'Booked mystery adventure to Asia',
        time: '3 days ago'
      }
    ])
    
    // Session timeout
    const IDLE_TIMEOUT = 1 * 60 * 1000 // 1 minute for testing 
    const WARNING_TIME = 10000 // Show warning 10 seconds before logout
    
    let activityTimer = null
    let warningTimer = null
    let logoutTimer = null
    
    const showTimeoutWarning = ref(false)
    const timeoutSeconds = ref(10)

    // Track user activity
    const updateActivity = () => {
      store.dispatch('auth/updateActivity')
      resetTimers()
      startIdleTimer()
    }

    const startIdleTimer = () => {
      activityTimer = setTimeout(() => {
        showWarning()
      }, IDLE_TIMEOUT - WARNING_TIME)
    }

    const showWarning = () => {
      showTimeoutWarning.value = true
      timeoutSeconds.value = 10
      
      // Countdown
      warningTimer = setInterval(() => {
        timeoutSeconds.value--
        if (timeoutSeconds.value <= 0) {
          clearInterval(warningTimer)
        }
      }, 1000)
      
      // Logout after warning
      logoutTimer = setTimeout(() => {
        handleLogout()
      }, WARNING_TIME)
    }

    const stayLoggedIn = () => {
      showTimeoutWarning.value = false
      clearTimeout(logoutTimer)
      clearInterval(warningTimer)
      updateActivity()
    }

    const handleLogout = async () => {
      showTimeoutWarning.value = false
      await store.dispatch('auth/logout')
      router.push('/login')
    }

    const resetTimers = () => {
      clearTimeout(activityTimer)
      clearTimeout(logoutTimer)
      clearInterval(warningTimer)
    }

    // Setup activity listeners
    const setupActivityListeners = () => {
      const events = ['mousedown', 'keydown', 'scroll', 'touchstart']
      events.forEach(event => {
        window.addEventListener(event, updateActivity)
      })
    }

    const removeActivityListeners = () => {
      const events = ['mousedown', 'keydown', 'scroll', 'touchstart']
      events.forEach(event => {
        window.removeEventListener(event, updateActivity)
      })
    }

    onMounted(() => {
      setupActivityListeners()
      startIdleTimer()
      updateActivity() // Set initial activity
    })

    onUnmounted(() => {
      removeActivityListeners()
      resetTimers()
    })

    return {
      userFirstName,
      stats,
      recentActivities,
      showTimeoutWarning,
      timeoutSeconds,
      stayLoggedIn
    }
  }
}
</script>

<style scoped>
.dashboard-view {
  min-height: calc(100vh - 200px);
  padding: 40px 20px;
  background: #f5f7fa;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Welcome Section */
.welcome-section {
  background: white;
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
}

.welcome-title {
  font-size: 2.2rem;
  color: #333;
  margin-bottom: 10px;
  font-weight: 600;
}

.welcome-title .highlight {
  color: #FF6B6B;
  position: relative;
}

.welcome-title .highlight::after {
  content: '';
  position: absolute;
  bottom: 5px;
  left: 0;
  width: 100%;
  height: 8px;
  background: rgba(255, 107, 107, 0.2);
  z-index: 1;
}

.welcome-subtitle {
  color: #666;
  font-size: 1.1rem;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: #FF6B6B;
  color: white;
}

.btn-primary:hover {
  background: #FF5252;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(255, 107, 107, 0.3);
}

.btn-small {
  padding: 8px 16px;
  font-size: 0.9rem;
}

.btn-icon {
  width: 20px;
  height: 20px;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  border-radius: 20px;
  padding: 25px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon-wrapper {
  width: 60px;
  height: 60px;
  border-radius: 15px;
  background: rgba(255, 107, 107, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon {
  color: #FF6B6B;
  width: 32px;
  height: 32px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  line-height: 1.2;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
}

/* Section Title */
.section-title {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 20px;
  font-weight: 600;
}

/* Actions Grid */
.actions-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.action-card {
  background: white;
  border-radius: 20px;
  padding: 30px;
  text-decoration: none;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(255, 107, 107, 0.15);
}

.action-icon-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: rgba(255, 107, 107, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.action-icon {
  color: #FF6B6B;
  width: 48px;
  height: 48px;
}

.action-title {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 8px;
  font-weight: 600;
}

.action-description {
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 20px;
  line-height: 1.5;
  flex: 1;
}

.action-link {
  color: #FF6B6B;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
}

.arrow-icon {
  transition: transform 0.3s;
}

.action-card:hover .arrow-icon {
  transform: translateX(5px);
}

/* Recent Activity */
.recent-section {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  border-radius: 10px;
  transition: background 0.3s;
}

.activity-item:hover {
  background: #f5f5f5;
}

.activity-icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(255, 107, 107, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.activity-icon {
  color: #FF6B6B;
  width: 20px;
  height: 20px;
}

.activity-content {
  flex: 1;
}

.activity-text {
  color: #333;
  font-weight: 500;
  margin-bottom: 4px;
}

.activity-time {
  color: #999;
  font-size: 0.85rem;
}

.no-activity {
  text-align: center;
  padding: 30px;
  color: #999;
}

/* Timeout Warning */
.timeout-warning {
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  padding: 20px;
  z-index: 1000;
  max-width: 400px;
  border-left: 4px solid #FFC107;
  animation: slideIn 0.3s;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.timeout-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.warning-icon {
  color: #FFC107;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.timeout-text {
  flex: 1;
}

.timeout-text h4 {
  color: #333;
  font-size: 1rem;
  margin-bottom: 4px;
}

.timeout-text p {
  color: #666;
  font-size: 0.9rem;
}

/* Dark Mode */
:root.dark-mode .dashboard-view {
  background: #0B1E33;
}

:root.dark-mode .welcome-section,
:root.dark-mode .stat-card,
:root.dark-mode .action-card,
:root.dark-mode .recent-section {
  background: #122B44;
  border: 1px solid #1A334D;
}

:root.dark-mode .welcome-title,
:root.dark-mode .stat-value,
:root.dark-mode .action-title,
:root.dark-mode .section-title,
:root.dark-mode .timeout-text h4 {
  color: #F5F9FF;
}

:root.dark-mode .welcome-subtitle,
:root.dark-mode .stat-label,
:root.dark-mode .action-description,
:root.dark-mode .timeout-text p {
  color: #B0C4DE;
}

:root.dark-mode .welcome-title .highlight {
  color: #00D4FF;
}

:root.dark-mode .welcome-title .highlight::after {
  background: rgba(0, 212, 255, 0.2);
}

:root.dark-mode .stat-icon-wrapper,
:root.dark-mode .action-icon-wrapper,
:root.dark-mode .activity-icon-wrapper {
  background: rgba(0, 212, 255, 0.1);
}

:root.dark-mode .stat-icon,
:root.dark-mode .action-icon,
:root.dark-mode .activity-icon,
:root.dark-mode .action-link {
  color: #00D4FF;
}

:root.dark-mode .activity-item:hover {
  background: #1A334D;
}

:root.dark-mode .activity-text {
  color: #F5F9FF;
}

:root.dark-mode .activity-time {
  color: #B0C4DE;
}

:root.dark-mode .timeout-warning {
  background: #122B44;
  border: 1px solid #1A334D;
}

/* Responsive */
@media (max-width: 768px) {
  .welcome-section {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
  
  .stats-grid,
  .actions-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-card {
    padding: 20px;
  }
  
  .action-card {
    padding: 25px;
  }
  
  .timeout-warning {
    left: 20px;
    right: 20px;
    bottom: 20px;
    max-width: none;
  }
  
  .timeout-content {
    flex-direction: column;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .welcome-title {
    font-size: 1.8rem;
  }
  
  .stat-value {
    font-size: 1.5rem;
  }
  
  .action-icon-wrapper {
    width: 60px;
    height: 60px;
  }
  
  .action-icon {
    width: 32px;
    height: 32px;
  }
  
  .action-title {
    font-size: 1.1rem;
  }
}
</style>