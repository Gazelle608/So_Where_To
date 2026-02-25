<template>
  <div class="contact-view">
    <h1 class="page-title">Contact <span>Us</span></h1>
    
    <div class="contact-container">
      <!-- Contact Info -->
      <div class="contact-info">
        <h2>Get in Touch</h2>
        <p>Have questions? We'd love to hear from you.</p>
        
        <div class="info-item">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
          <div>
            <h3>Email</h3>
            <p>hello@sowhereto.com</p>
          </div>
        </div>
        
        <div class="info-item">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
          </svg>
          <div>
            <h3>Phone</h3>
            <p>+27 12 345 6789</p>
          </div>
        </div>
        
        <div class="info-item">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <div>
            <h3>Address</h3>
            <p>123 Adventure Lane, Cape Town, 8001</p>
          </div>
        </div>
      </div>

      <!-- Contact Form -->
      <form class="contact-form" @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" id="name" v-model="form.name" required>
        </div>
        
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="form.email" required>
        </div>
        
        <div class="form-group">
          <label for="subject">Subject</label>
          <input type="text" id="subject" v-model="form.subject" required>
        </div>
        
        <div class="form-group">
          <label for="message">Message</label>
          <textarea id="message" v-model="form.message" rows="5" required></textarea>
        </div>
        
        <button type="submit" class="submit-btn" :disabled="sending">
          {{ sending ? 'Sending...' : 'Send Message' }}
        </button>
        
        <p v-if="message" class="form-message" :class="{ success: success }">
          {{ message }}
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'ContactView',
  setup() {
    const form = ref({
      name: '',
      email: '',
      subject: '',
      message: ''
    })
    
    const sending = ref(false)
    const message = ref('')
    const success = ref(false)

    const handleSubmit = async () => {
      sending.value = true
      
      // Simulate sending
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // In production, you would send to your backend
      // await fetch('/api/contact', { method: 'POST', body: JSON.stringify(form.value) })
      
      message.value = 'Thanks for your message! We\'ll get back to you soon.'
      success.value = true
      sending.value = false
      
      // Clear form
      form.value = {
        name: '',
        email: '',
        subject: '',
        message: ''
      }
      
      // Clear message after 5 seconds
      setTimeout(() => {
        message.value = ''
      }, 5000)
    }

    return {
      form,
      sending,
      message,
      success,
      handleSubmit
    }
  }
}
</script>

<style scoped>

.contact-view {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
}

.page-title {
  font-size: 2.5rem;
  color: #333;
  text-align: center;
  margin-bottom: 40px;
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

.contact-container {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 40px;
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
}

/* Contact Info */
.contact-info h2 {
  color: #333;
  margin-bottom: 15px;
}

.contact-info > p {
  color: #666;
  margin-bottom: 30px;
}

.info-item {
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
}

.info-item svg {
  color: #FF6B6B;
  flex-shrink: 0;
}

.info-item h3 {
  color: #333;
  font-size: 1.1rem;
  margin-bottom: 5px;
}

.info-item p {
  color: #666;
}

/* Contact Form */
.contact-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-group label {
  color: #666;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #FF6B6B;
  outline: none;
}

.submit-btn {
  padding: 14px;
  background: #FF6B6B;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 10px;
}

.submit-btn:hover {
  background: #FF5252;
  transform: translateY(-2px);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-message {
  text-align: center;
  padding: 10px;
  border-radius: 8px;
  font-size: 0.9rem;
}

.form-message.success {
  background: #28A745;
  color: white;
}

/* Dark Mode */
:root.dark-mode .page-title {
  color: #F5F9FF;
}

:root.dark-mode .contact-container {
  background: #0B1E33;
  border: 1px solid #1A334D;
}

:root.dark-mode .contact-info h2,
:root.dark-mode .info-item h3 {
  color: #F5F9FF;
}

:root.dark-mode .contact-info p,
:root.dark-mode .info-item p {
  color: #B0C4DE;
}

:root.dark-mode .form-group label {
  color: #B0C4DE;
}

:root.dark-mode .form-group input,
:root.dark-mode .form-group textarea {
  background: #122B44;
  border-color: #1A334D;
  color: #F5F9FF;
}

:root.dark-mode .form-group input::placeholder,
:root.dark-mode .form-group textarea::placeholder {
  color: #B0C4DE;
}

:root.dark-mode .submit-btn {
  background: #00D4FF;
  color: #0B1E33;
}

:root.dark-mode .submit-btn:hover {
  background: #80EAFF;
}

/* Responsive */
@media (max-width: 768px) {
  .contact-container {
    grid-template-columns: 1fr;
  }
}
</style>