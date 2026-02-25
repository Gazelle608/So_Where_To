<template>
  <div class="newsletter-signup">
    <h3 class="newsletter-title">Never Miss a Deal</h3>
    <p class="newsletter-text">Subscribe to get exclusive offers and early access to new destinations</p>
    
    <form @submit.prevent="handleSubmit" class="newsletter-form">
      <div class="form-group">
        <input 
          type="email" 
          v-model="email" 
          placeholder="Enter your email"
          required
          class="newsletter-input"
        >
        <button type="submit" class="newsletter-btn" :disabled="loading">
          <span v-if="loading" class="spinner-small"></span>
          <span v-else>Subscribe</span>
        </button>
      </div>
      <p v-if="message" class="newsletter-message" :class="{ 'success': success, 'error': !success }">
        {{ message }}
      </p>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'NewsletterSignup',
  setup() {
    const email = ref('')
    const loading = ref(false)
    const message = ref('')
    const success = ref(false)

    const handleSubmit = async () => {
      loading.value = true
      message.value = ''
      
      try {
        // In a real app, this would be an API call to your backend
        // For demo, we'll simulate sending to a service like Mailchimp
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Store in localStorage for demo
        const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]')
        
        if (subscribers.includes(email.value)) {
          message.value = 'This email is already subscribed!'
          success.value = false
        } else {
          subscribers.push(email.value)
          localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers))
          
          // In production, you would send to your email service
          // Example: await fetch('/api/newsletter', { method: 'POST', body: JSON.stringify({ email: email.value }) })
          
          message.value = 'Thanks for subscribing! Check your email for confirmation.'
          success.value = true
          email.value = ''
        }
        
      } catch (error) {
        message.value = 'Something went wrong. Please try again.'
        success.value = false
      } finally {
        loading.value = false
      }
    }

    return {
      email,
      loading,
      message,
      success,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.newsletter-signup {
  background: white;
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
}

.newsletter-title {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 10px;
}

.newsletter-text {
  color: #666;
  margin-bottom: 20px;
}

.newsletter-form {
  max-width: 500px;
  margin: 0 auto;
}

.form-group {
  display: flex;
  gap: 10px;
}

.newsletter-input {
  flex: 1;
  padding: 12px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
}

.newsletter-input:focus {
  border-color: #FF6B6B;
  outline: none;
}

.newsletter-btn {
  padding: 12px 25px;
  background: #FF6B6B;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 100px;
}

.newsletter-btn:hover {
  background: #FF5252;
  transform: translateY(-2px);
}

/* .newsletter-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
} */

.newsletter-message {
  margin-top: 15px;
  font-size: 0.9rem;
}

.newsletter-message.success {
  color: #28A745;
}

.newsletter-message.error {
  color: #DC3545;
}

.spinner-small {
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
:root.dark-mode .newsletter-signup {
  background: #122B44;
}

:root.dark-mode .newsletter-title {
  color: #F5F9FF;
}

:root.dark-mode .newsletter-text {
  color: #B0C4DE;
}

:root.dark-mode .newsletter-input {
  background: #0B1E33;
  border-color: #1A334D;
  color: #F5F9FF;
}

:root.dark-mode .newsletter-input::placeholder {
  color: #B0C4DE;
}

:root.dark-mode .newsletter-btn {
  background: #00D4FF;
  color: #0B1E33;
}

:root.dark-mode .newsletter-btn:hover {
  background: #80EAFF;
}

@media (max-width: 480px) {
  .form-group {
    flex-direction: column;
  }
  
  .newsletter-btn {
    width: 100%;
  }
}
</style>