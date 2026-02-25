<template>
  <div class="register-view">
    <div class="container">
      <div class="auth-card">
        <!-- Left Side - Branding -->
        <div class="brand-side">
          <div class="brand-content">
            <div class="logo">
              <svg class="logo-icon" viewBox="0 0 24 24" width="48" height="48">
                <path fill="currentColor" d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
              </svg>
              <span class="logo-text">So <span class="highlight">Where To</span>?</span>
            </div>
            <h1 class="welcome-title">Start Your Journey</h1>
            <p class="welcome-text">
              Join thousands of travelers who've discovered the thrill of mystery travel. 
              Create an account and let the adventure begin.
            </p>
            <div class="stats-container">
              <div class="stat-item">
                <span class="stat-value">50+</span>
                <span class="stat-label">Destinations</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">10k+</span>
                <span class="stat-label">Travelers</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">4.8</span>
                <span class="stat-label">Rating</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side - Form -->
        <div class="form-side">
          <RegisterForm />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RegisterForm from '@/components/auth/RegisterForm.vue'

export default {
  name: 'RegisterView',
  components: {
    RegisterForm
  }
}
</script>

<style scoped>
.register-view {
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.container {
  max-width: 1200px;
  width: 100%;
}

.auth-card {
  display: flex;
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  min-height: 600px;
}

.brand-side {
  flex: 1;
  background: linear-gradient(135deg, #4A6FA5 0%, #9B6B9E 100%);
  color: white;
  padding: 48px;
  display: flex;
  align-items: center;
}

.brand-content {
  max-width: 400px;
  margin: 0 auto;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
}

.logo-icon {
  color: white;
  width: 48px;
  height: 48px;
}

.logo-text {
  font-size: 1.8rem;
  font-weight: 700;
  color: white;
}

.logo-text .highlight {
  color: #FFD93D;
  position: relative;
}

.logo-text .highlight::after {
  content: '';
  position: absolute;
  bottom: 4px;
  left: 0;
  width: 100%;
  height: 8px;
  background: rgba(255, 217, 61, 0.3);
  z-index: 1;
}

.welcome-title {
  font-size: 2.5rem;
  margin-bottom: 16px;
  font-weight: 700;
}

.welcome-text {
  font-size: 1.1rem;
  margin-bottom: 32px;
  opacity: 0.9;
  line-height: 1.6;
}

.stats-container {
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.8rem;
  font-weight: 700;
  color: #FFD93D;
  line-height: 1.2;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
}

.form-side {
  flex: 1;
  padding: 48px;
  display: flex;
  align-items: center;
  background: white;
}

/* Dark Mode */
:root.dark-mode .register-view {
  background: #0B1E33;
}

:root.dark-mode .auth-card {
  background: #0B1E33;
  border: 1px solid #1A334D;
}

:root.dark-mode .brand-side {
  background: linear-gradient(135deg, #0B1E33 0%, #1A334D 100%);
  border-right: 1px solid #00D4FF;
}

:root.dark-mode .form-side {
  background: #0B1E33;
}

:root.dark-mode .logo-text,
:root.dark-mode .welcome-title {
  color: #F5F9FF;
}

:root.dark-mode .logo-text .highlight {
  color: #00D4FF;
}

:root.dark-mode .logo-text .highlight::after {
  background: rgba(0, 212, 255, 0.3);
}

:root.dark-mode .stat-value {
  color: #00D4FF;
}

/* Responsive */
@media (max-width: 968px) {
  .auth-card {
    flex-direction: column;
  }
  
  .brand-side {
    padding: 40px;
  }
  
  .form-side {
    padding: 40px;
  }
}

@media (max-width: 480px) {
  .brand-side {
    padding: 30px 20px;
  }
  
  .form-side {
    padding: 30px 20px;
  }
  
  .welcome-title {
    font-size: 2rem;
  }
  
  .stats-container {
    flex-direction: column;
    gap: 15px;
  }
}
</style>