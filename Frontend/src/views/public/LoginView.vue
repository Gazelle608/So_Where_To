<template>
  <div class="login-view">
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
            <h1 class="welcome-title">Welcome Back</h1>
            <p class="welcome-text">
              Sign in to continue your mystery travel journey. Access your bookings, 
              manage your wishlist, and spin the globe for new adventures.
            </p>
            <div class="feature-list">
              <div class="feature-item">
                <svg class="feature-icon" viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span>Access your upcoming trips</span>
              </div>
              <div class="feature-item">
                <svg class="feature-icon" viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span>Manage your wishlist</span>
              </div>
              <div class="feature-item">
                <svg class="feature-icon" viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span>Save your preferences</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side - Form -->
        <div class="form-side">
          <LoginForm />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoginForm from '@/components/auth/LoginForm.vue'

export default {
  name: 'LoginView',
  components: {
    LoginForm
  }
}
</script>

<style scoped>
.login-view {
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
  background: linear-gradient(135deg, #FF6B6B 0%, #4A6FA5 100%);
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

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1rem;
  opacity: 0.9;
}

.feature-icon {
  color: #FFD93D;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.form-side {
  flex: 1;
  padding: 48px;
  display: flex;
  align-items: center;
  background: white;
}

/* Dark Mode */
:root.dark-mode .login-view {
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

:root.dark-mode .feature-icon {
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
}
</style>