<template>
  <div class="login-form">
    <h2 class="form-title">Welcome Back</h2>
    <p class="form-subtitle">Sign in to continue your adventure</p>

    <!-- Error Message -->
    <transition name="slide">
      <div v-if="error" class="error-message">
        <svg class="error-icon" viewBox="0 0 24 24" width="20" height="20">
          <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
        <span>{{ error }}</span>
        <button @click="clearError" class="error-close">×</button>
      </div>
    </transition>

    <!-- Login Form -->
    <form @submit.prevent="handleSubmit" class="form">
      <!-- Email Field -->
      <div class="form-group">
        <label for="email">Email Address</label>
        <div class="input-wrapper">
          <svg class="input-icon" viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
          <input 
            type="email" 
            id="email"
            v-model="form.email" 
            :class="{ error: errors.email }"
            placeholder="your@email.com"
            required
            @blur="validateField('email')"
            @input="clearFieldError('email')"
          >
        </div>
        <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
      </div>

      <!-- Password Field -->
      <div class="form-group">
        <label for="password">Password</label>
        <div class="input-wrapper">
          <svg class="input-icon" viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
          </svg>
          <input 
            :type="showPassword ? 'text' : 'password'" 
            id="password"
            v-model="form.password" 
            :class="{ error: errors.password }"
            placeholder="Enter your password"
            required
            @blur="validateField('password')"
            @input="clearFieldError('password')"
          >
          <button 
            type="button" 
            class="password-toggle"
            @click="togglePassword"
            tabindex="-1"
          >
            <svg v-if="!showPassword" viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
            </svg>
          </button>
        </div>
        <span v-if="errors.password" class="field-error">{{ errors.password }}</span>
      </div>

      <!-- Remember Me & Forgot Password -->
      <div class="form-options">
        <label class="checkbox-container">
          <input type="checkbox" v-model="form.remember">
          <span class="checkmark"></span>
          <span class="checkbox-text">Remember me</span>
        </label>
        <router-link to="/forgot-password" class="forgot-link">
          Forgot password?
        </router-link>
      </div>

      <!-- Submit Button -->
      <button 
        type="submit" 
        class="submit-btn" 
        :disabled="loading || !isFormValid"
      >
        <span v-if="loading" class="spinner"></span>
        <span v-else>Sign In</span>
      </button>
    </form>

    <!-- Register Link -->
    <p class="register-text">
      Don't have an account? 
      <router-link to="/register" class="register-link">
        Create one now
      </router-link>
    </p>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'LoginForm',
  setup() {
    const store = useStore()
    const router = useRouter()
    
    // Form state
    const form = reactive({
      email: '',
      password: '',
      remember: false
    })
    
    const errors = ref({})
    const loading = ref(false)
    const error = ref('')
    const showPassword = ref(false)

    // Validation rules
    const validateField = (field) => {
      const value = form[field]
      
      if (field === 'email') {
        if (!value) return 'Email is required'
        if (!/^\S+@\S+\.\S+$/.test(value)) return 'Please enter a valid email'
      }
      
      if (field === 'password') {
        if (!value) return 'Password is required'
        if (value.length < 6) return 'Password must be at least 6 characters'
      }
      
      return ''
    }

    const validateField2 = (field) => {
      const errorMsg = validateField(field)
      if (errorMsg) {
        errors.value[field] = errorMsg
      } else {
        delete errors.value[field]
      }
    }

    const clearFieldError = (field) => {
      delete errors.value[field]
    }

    const isFormValid = computed(() => {
      return form.email && form.password && Object.keys(errors.value).length === 0
    })

    const togglePassword = () => {
      showPassword.value = !showPassword.value
    }

    const clearError = () => {
      error.value = ''
    }

    const handleSubmit = async () => {
      // Validate all fields
      validateField2('email')
      validateField2('password')
      
      if (Object.keys(errors.value).length > 0) return

      loading.value = true
      error.value = ''

      try {
        const result = await store.dispatch('auth/login', {
          email: form.email,
          password: form.password
        })

        if (result.success) {
          store.commit('SHOW_NOTIFICATION', {
            message: `Welcome back, ${result.user.firstName}!`,
            type: 'success'
          })
          router.push('/dashboard')
        } else {
          error.value = result.error || 'Invalid email or password'
        }
      } catch (err) {
        error.value = 'An error occurred. Please try again.'
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      errors,
      loading,
      error,
      showPassword,
      isFormValid,
      validateField: validateField2,
      clearFieldError,
      togglePassword,
      clearError,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.login-form {
  width: 100%;
}

.form-title {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 8px;
  text-align: center;
  font-weight: 600;
}

.form-subtitle {
  color: #666;
  text-align: center;
  margin-bottom: 24px;
  font-size: 0.95rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 12px;
  color: #999;
  width: 20px;
  height: 20px;
}

.input-wrapper input {
  width: 100%;
  padding: 14px 40px 14px 45px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s;
  background: white;
  color: #333;
}

.input-wrapper input:focus {
  border-color: #FF6B6B;
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1);
}

.input-wrapper input.error {
  border-color: #DC3545;
}

.password-toggle {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.password-toggle:hover {
  color: #FF6B6B;
}

.field-error {
  color: #DC3545;
  font-size: 0.8rem;
  margin-top: 4px;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  position: relative;
  padding-left: 25px;
  user-select: none;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  left: 0;
  height: 18px;
  width: 18px;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 4px;
  transition: all 0.3s;
}

.checkbox-container:hover input ~ .checkmark {
  border-color: #FF6B6B;
}

.checkbox-container input:checked ~ .checkmark {
  background: #FF6B6B;
  border-color: #FF6B6B;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

.checkbox-container .checkmark:after {
  left: 5px;
  top: 1px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-text {
  color: #666;
  font-size: 0.9rem;
}

.forgot-link {
  color: #FF6B6B;
  font-size: 0.9rem;
  text-decoration: none;
}

.forgot-link:hover {
  color: #FF5252;
  text-decoration: underline;
}

.submit-btn {
  padding: 16px;
  background: #FF6B6B;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 8px;
}

.submit-btn:hover:not(:disabled) {
  background: #FF5252;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(255, 107, 107, 0.3);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.register-text {
  text-align: center;
  margin-top: 24px;
  color: #666;
  font-size: 0.95rem;
}

.register-link {
  color: #FF6B6B;
  font-weight: 600;
  text-decoration: none;
}

.register-link:hover {
  color: #FF5252;
  text-decoration: underline;
}

.error-message {
  background: #DC3545;
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
}

.error-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.error-close {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: rgba(255,255,255,0.8);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0;
}

.error-close:hover {
  color: white;
}

.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Dark Mode */
:root.dark-mode .form-title {
  color: #F5F9FF;
}

:root.dark-mode .form-subtitle {
  color: #B0C4DE;
}

:root.dark-mode .form-group label {
  color: #B0C4DE;
}

:root.dark-mode .input-wrapper input {
  background: #122B44;
  border-color: #1A334D;
  color: #F5F9FF;
}

:root.dark-mode .input-wrapper input:focus {
  border-color: #00D4FF;
  box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
}

:root.dark-mode .checkbox-text {
  color: #B0C4DE;
}

:root.dark-mode .checkmark {
  background: #122B44;
  border-color: #1A334D;
}

:root.dark-mode .checkbox-container:hover input ~ .checkmark {
  border-color: #00D4FF;
}

:root.dark-mode .checkbox-container input:checked ~ .checkmark {
  background: #00D4FF;
  border-color: #00D4FF;
}

:root.dark-mode .forgot-link {
  color: #00D4FF;
}

:root.dark-mode .submit-btn {
  background: #00D4FF;
  color: #0B1E33;
}

:root.dark-mode .submit-btn:hover:not(:disabled) {
  background: #80EAFF;
}

:root.dark-mode .register-text {
  color: #B0C4DE;
}

:root.dark-mode .register-link {
  color: #00D4FF;
}

@media (max-width: 480px) {
  .form-title {
    font-size: 1.5rem;
  }
  
  .input-wrapper input {
    padding: 12px 40px 12px 45px;
  }
  
  .form-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .submit-btn {
    padding: 14px;
  }
}
</style>