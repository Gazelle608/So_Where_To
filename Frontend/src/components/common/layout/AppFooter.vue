<template>
  <footer class="app-footer">
    <!-- Newsletter Section -->
    <div class="newsletter-section">
      <div class="container">
        <div class="newsletter-content">
          <div class="newsletter-text">
            <h3>Never Miss a Mystery</h3>
            <p>Subscribe to get exclusive deals and early access to new destinations</p>
          </div>
          <form class="newsletter-form" @submit.prevent="subscribeNewsletter">
            <div class="form-group">
              <input 
                type="email" 
                v-model="newsletterEmail" 
                placeholder="Enter your email"
                required
              >
              <button type="submit" class="btn btn-primary" :disabled="subscribing">
                <span v-if="subscribing" class="spinner-small"></span>
                <span v-else>Subscribe</span>
              </button>
            </div>
            <p class="form-note" v-if="newsletterMessage">{{ newsletterMessage }}</p>
          </form>
        </div>
      </div>
    </div>

    <!-- Main Footer -->
    <div class="main-footer">
      <div class="container">
        <div class="footer-grid">
          <!-- Company Info -->
          <div class="footer-col">
            <div class="footer-logo">
              <span class="logo-icon">✈️</span>
              <span class="logo-text">So <span class="highlight">Where To</span>?</span>
            </div>
            <p class="company-description">
              Turn your wanderlust into mystery. We find the flights, you find the adventure. 
              Global destinations, one fixed price.
            </p>
            <div class="social-links">
              <a href="#" class="social-link" aria-label="Facebook"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-facebook" viewBox="0 0 16 16">
                  <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/>
                </svg></a>
                              <a href="#" class="social-link" aria-label="Instagram"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-instagram" viewBox="0 0 16 16">
                  <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
                </svg></a>
                              <a href="#" class="social-link" aria-label="Twitter"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-twitter-x" viewBox="0 0 16 16">
                  <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/>
                </svg></a>
                              <a href="#" class="social-link" aria-label="TikTok"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-tiktok" viewBox="0 0 16 16">
                  <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- Quick Links -->
          <div class="footer-col">
            <h4 class="footer-title">Quick Links</h4>
            <ul class="footer-links">
              <li><router-link to="/">Home</router-link></li>
              <li><router-link to="/how-it-works">How It Works</router-link></li>
              <li><router-link to="/destinations">Destinations</router-link></li>
              <li><router-link to="/spin">Spin the Globe</router-link></li>
              <li><router-link to="/faq">FAQ</router-link></li>
            </ul>
          </div>

          <!-- Support -->
          <div class="footer-col">
            <h4 class="footer-title">Support</h4>
            <ul class="footer-links">
              <li><router-link to="/contact">Contact Us</router-link></li>
              <li><router-link to="/help">Help Center</router-link></li>
              <li><router-link to="/terms">Terms of Service</router-link></li>
              <li><router-link to="/privacy">Privacy Policy</router-link></li>
              <li><router-link to="/cookies">Cookie Policy</router-link></li>
            </ul>
          </div>

          <!-- Contact Info -->
          <div class="footer-col">
            <h4 class="footer-title">Get in Touch</h4>
            <ul class="contact-info">
              <li>
                <span class="info-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt" viewBox="0 0 16 16">
                  <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10"/>
                  <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                </svg></span>
                <span>123 Adventure Lane, Cape Town, 8001</span>
              </li>
              <li>
                <span class="info-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-telephone" viewBox="0 0 16 16">
                  <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"/>
                </svg></span>
                <a href="tel:+27123456789">+27 12 345 6789</a>
              </li>
              <li>
                <span class="info-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-envelope" viewBox="0 0 16 16">
  <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z"/>
</svg></span>
                <a href="mailto:hello@sowhereto.com">hello@sowhereto.com</a>
              </li>
              <li>
                <span class="info-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clock" viewBox="0 0 16 16">
  <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
  <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0"/>
</svg></span>
                <span>Mon-Fri: 8am - 6pm</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="bottom-bar">
      <div class="container">
        <div class="bottom-bar-content">
          <p class="copyright">
            &copy; {{ currentYear }} So Where To? All rights reserved.
          </p>
          <div class="payment-methods">
            <span class="payment-icon" title="Visa">💳</span>
            <span class="payment-icon" title="Mastercard">💳</span>
            <span class="payment-icon" title="PayFast">⚡</span>
            <span class="payment-icon" title="EFT">🏦</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Back to Top (Mobile) -->
    <button class="mobile-back-to-top" @click="scrollToTop" v-show="showMobileTop">
      ↑
    </button>
  </footer>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from 'vue'

export default {
  name: 'AppFooter',
  setup() {
    const newsletterEmail = ref('')
    const subscribing = ref(false)
    const newsletterMessage = ref('')
    const showMobileTop = ref(false)

    const currentYear = computed(() => new Date().getFullYear())

    const subscribeNewsletter = async () => {
      subscribing.value = true
      newsletterMessage.value = ''
      
      // Simulate API call
      setTimeout(() => {
        subscribing.value = false
        newsletterMessage.value = '✅ Thanks for subscribing! Check your email.'
        newsletterEmail.value = ''
        
        // Clear message after 5 seconds
        setTimeout(() => {
          newsletterMessage.value = ''
        }, 5000)
      }, 1500)
    }

    const handleScroll = () => {
      showMobileTop.value = window.scrollY > 300
    }

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }

    onMounted(() => {
      window.addEventListener('scroll', handleScroll)
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
    })

    return {
      newsletterEmail,
      subscribing,
      newsletterMessage,
      showMobileTop,
      currentYear,
      subscribeNewsletter,
      scrollToTop
    }
  }
}
</script>

<style scoped>
.app-footer {
  background: #1a1a1a;
  color: #ffffff;
  margin-top: auto;
  position: relative;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Newsletter Section */
.newsletter-section {
  background: linear-gradient(135deg, #05142a 0%, #162841 100%);
  padding: 60px 0;
}

.newsletter-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 40px;
}

.newsletter-text h3 {
  font-size: 1.8rem;
  color: white;
  margin-bottom: 10px;
}

.newsletter-text p {
  color: rgba(255,255,255,0.9);
  font-size: 1rem;
}

.newsletter-form {
  flex: 1;
  max-width: 500px;
}

.form-group {
  display: flex;
  gap: 10px;
}

.newsletter-form input {
  flex: 1;
  padding: 15px 20px;
  border: none;
  border-radius: var(--radius-md);
  font-size: 1rem;
  background: white;
}

.newsletter-form input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(255,255,255,0.3);
}

.newsletter-form .btn {
  padding: 15px 30px;
  background: var(--text-dark);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 120px;
}

.newsletter-form .btn:hover:not(:disabled) {
  background: black;
  transform: translateY(-2px);
}

.newsletter-form .btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.form-note {
  margin-top: 10px;
  color: white;
  font-size: 0.9rem;
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

/* Main Footer */
.main-footer {
  padding: 60px 0 40px;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 40px;
}

/* Footer Logo */
.footer-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 20px;
}

.footer-logo .logo-icon {
  font-size: 2.2rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.footer-logo .logo-text {
  color: white;
}

.footer-logo .highlight {
  color: var(--primary);
}

.company-description {
  color: #b0b0b0;
  line-height: 1.6;
  margin-bottom: 25px;
  font-size: 0.95rem;
}

/* Social Links */
.social-links {
  display: flex;
  gap: 15px;
}

.social-link {
  width: 40px;
  height: 40px;
  background: rgba(255,255,255,0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-decoration: none;
  font-size: 1.2rem;
  transition: all 0.3s;
}

.social-link:hover {
  background: var(--primary);
  transform: translateY(-3px);
}

/* Footer Titles */
.footer-title {
  color: white;
  font-size: 1.2rem;
  margin-bottom: 20px;
  position: relative;
  padding-bottom: 10px;
}

.footer-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 2px;
  background: var(--primary);
}

/* Footer Links */
.footer-links {
  list-style: none;
  padding: 0;
}

.footer-links li {
  margin-bottom: 12px;
}

.footer-links a {
  color: #b0b0b0;
  text-decoration: none;
  transition: all 0.3s;
  display: inline-block;
}

.footer-links a:hover {
  color: var(--primary);
  transform: translateX(5px);
}

/* Contact Info */
.contact-info {
  list-style: none;
  padding: 0;
}

.contact-info li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 15px;
  color: #b0b0b0;
}

.info-icon {
  color: var(--primary);
  font-size: 1.1rem;
  min-width: 24px;
}

.contact-info a {
  color: #b0b0b0;
  text-decoration: none;
  transition: color 0.3s;
}

.contact-info a:hover {
  color: var(--primary);
}

/* Bottom Bar */
.bottom-bar {
  background: #111111;
  padding: 20px 0;
  border-top: 1px solid #333;
}

.bottom-bar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.copyright {
  color: #888;
  font-size: 0.9rem;
}

.payment-methods {
  display: flex;
  gap: 15px;
}

.payment-icon {
  font-size: 1.5rem;
  opacity: 0.7;
  transition: opacity 0.3s;
  cursor: help;
}

.payment-icon:hover {
  opacity: 1;
}

/* Mobile Back to Top */
.mobile-back-to-top {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--primary);
  color: white;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  display: none;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-lg);
  z-index: 99;
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Responsive */
@media (max-width: 968px) {
  .footer-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .newsletter-content {
    flex-direction: column;
    text-align: center;
  }
  
  .newsletter-form {
    width: 100%;
  }
  
  .form-group {
    max-width: 400px;
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .newsletter-section {
    padding: 40px 0;
  }
  
  .newsletter-text h3 {
    font-size: 1.5rem;
  }
  
  .main-footer {
    padding: 40px 0;
  }
  
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .footer-col:first-child {
    text-align: center;
  }
  
  .footer-logo {
    justify-content: center;
  }
  
  .social-links {
    justify-content: center;
  }
  
  .footer-title::after {
    left: 50%;
    transform: translateX(-50%);
  }
  
  .footer-links {
    text-align: center;
  }
  
  .footer-links a:hover {
    transform: translateX(0) scale(1.05);
  }
  
  .contact-info li {
    justify-content: center;
  }
  
  .bottom-bar-content {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }
  
  .mobile-back-to-top {
    display: flex;
  }
}

@media (max-width: 480px) {
  .form-group {
    flex-direction: column;
  }
  
  .newsletter-form .btn {
    width: 100%;
  }
  
  .payment-methods {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>