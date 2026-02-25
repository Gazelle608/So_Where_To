<template>
  <div class="checkout-view">
    <div class="checkout-header">
      <h1 class="page-title">Almost <span>There</span>!</h1>
      <p class="page-subtitle">Your adventure is just a payment away</p>
    </div>

    <div class="checkout-container">
      <!-- Checkout Progress -->
      <div class="checkout-progress">
        <div class="progress-step" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">
          <span class="step-number">1</span>
          <span class="step-label">Review</span>
        </div>
        <div class="progress-line" :class="{ active: currentStep >= 2 }"></div>
        <div class="progress-step" :class="{ active: currentStep >= 2, completed: currentStep > 2 }">
          <span class="step-number">2</span>
          <span class="step-label">Payment</span>
        </div>
        <div class="progress-line" :class="{ active: currentStep >= 3 }"></div>
        <div class="progress-step" :class="{ active: currentStep >= 3, completed: currentStep > 3 }">
          <span class="step-number">3</span>
          <span class="step-label">Confirm</span>
        </div>
      </div>

      <!-- Step 1: Review Order -->
      <div v-if="currentStep === 1" class="checkout-step">
        <h2 class="step-title">Review Your Mystery Adventure</h2>
        
        <div class="order-items">
          <div v-for="item in cartItems" :key="item.id" class="order-item">
            <div class="item-image" :style="{ backgroundImage: `url(${item.image})` }"></div>
            <div class="item-details">
              <h3>{{ item.destination || 'Mystery Destination' }}</h3>
              <p>{{ item.airline }} • {{ item.hostel }}</p>
              <div class="item-meta">
                <span>Depart: {{ formatDate(item.departure) }}</span>
                <span>Return: {{ formatDate(item.return) }}</span>
              </div>
            </div>
            <div class="item-price">
              <span class="quantity">x{{ item.quantity }}</span>
              <span class="price">R{{ (item.price * item.quantity).toLocaleString() }}</span>
            </div>
          </div>
        </div>

        <div class="order-summary">
          <h3>Order Summary</h3>
          <div class="summary-row">
            <span>Subtotal</span>
            <span>R{{ cartTotal.toLocaleString() }}</span>
          </div>
          <div class="summary-row">
            <span>Booking Fee</span>
            <span>R50</span>
          </div>
          <div class="summary-row total">
            <span>Total</span>
            <span class="total-price">R{{ (cartTotal + 50).toLocaleString() }}</span>
          </div>
        </div>

        <div class="step-actions">
          <button @click="currentStep = 2" class="btn btn-primary" :disabled="cartCount === 0">
            Proceed to Payment
          </button>
          <router-link to="/cart" class="btn btn-outline">Back to Cart</router-link>
        </div>
      </div>

      <!-- Step 2: Payment Method -->
      <div v-else-if="currentStep === 2" class="checkout-step">
        <h2 class="step-title">Choose Payment Method</h2>
        
        <div class="payment-methods">
          <div class="payment-method" 
               :class="{ active: paymentMethod === 'card' }"
               @click="paymentMethod = 'card'">
            <div class="method-radio">
              <span class="radio-dot" v-if="paymentMethod === 'card'"></span>
            </div>
            <div class="method-content">
              <span class="method-icon">💳</span>
              <div class="method-details">
                <h4>Credit / Debit Card</h4>
                <p>Pay with Visa, Mastercard, or AMEX</p>
              </div>
            </div>
          </div>

          <div class="payment-method" 
               :class="{ active: paymentMethod === 'eft' }"
               @click="paymentMethod = 'eft'">
            <div class="method-radio">
              <span class="radio-dot" v-if="paymentMethod === 'eft'"></span>
            </div>
            <div class="method-content">
              <span class="method-icon">🏦</span>
              <div class="method-details">
                <h4>EFT</h4>
                <p>Pay via electronic funds transfer</p>
              </div>
            </div>
          </div>

          <div class="payment-method" 
               :class="{ active: paymentMethod === 'payfast' }"
               @click="paymentMethod = 'payfast'">
            <div class="method-radio">
              <span class="radio-dot" v-if="paymentMethod === 'payfast'"></span>
            </div>
            <div class="method-content">
              <span class="method-icon">⚡</span>
              <div class="method-details">
                <h4>PayFast</h4>
                <p>Fast and secure payment</p>
              </div>
            </div>
          </div>

          <div class="payment-method simulated" 
               :class="{ active: paymentMethod === 'simulated' }"
               @click="paymentMethod = 'simulated'">
            <div class="method-radio">
              <span class="radio-dot" v-if="paymentMethod === 'simulated'"></span>
            </div>
            <div class="method-content">
              <span class="method-icon">🧪</span>
              <div class="method-details">
                <h4>Simulated Payment (Demo)</h4>
                <p>Use for testing - no real payment</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Card Details Form -->
        <div v-if="paymentMethod === 'card'" class="payment-form">
          <h3>Card Details</h3>
          
          <div class="form-group">
            <label>Card Number</label>
            <input 
              type="text" 
              v-model="cardNumber" 
              placeholder="4242 4242 4242 4242"
              maxlength="19"
              @input="formatCardNumber"
            >
          </div>

          <div class="form-row">
            <div class="form-group half">
              <label>Expiry Date</label>
              <input 
                type="text" 
                v-model="expiryDate" 
                placeholder="MM/YY"
                maxlength="5"
                @input="formatExpiry"
              >
            </div>
            <div class="form-group half">
              <label>CVV</label>
              <input 
                type="text" 
                v-model="cvv" 
                placeholder="123"
                maxlength="3"
              >
            </div>
          </div>

          <div class="form-group">
            <label>Cardholder Name</label>
            <input type="text" v-model="cardName" placeholder="John Doe">
          </div>
        </div>

        <!-- EFT Instructions -->
        <div v-if="paymentMethod === 'eft'" class="payment-info">
          <h3>EFT Details</h3>
          <div class="info-box">
            <p><strong>Bank:</strong> FNB</p>
            <p><strong>Account Name:</strong> So Where To? Pty Ltd</p>
            <p><strong>Account Number:</strong> 628 1234 5678</p>
            <p><strong>Branch Code:</strong> 250 655</p>
            <p><strong>Reference:</strong> SWT-{{ orderReference }}</p>
          </div>
          <p class="info-note">Use the reference number when making payment.</p>
        </div>

        <!-- Simulated Payment -->
        <div v-if="paymentMethod === 'simulated'" class="payment-info">
          <h3>Demo Mode</h3>
          <div class="info-box simulated">
            <p>🧪 This is a simulated payment for testing purposes.</p>
            <p>No real money will be charged.</p>
            <p class="test-card">Test Card: 4242 4242 4242 4242</p>
          </div>
        </div>

        <div class="step-actions">
          <button @click="processPayment" class="btn btn-primary" :disabled="!canProcessPayment">
            {{ paymentMethod === 'simulated' ? 'Complete Demo Payment' : 'Pay Now' }}
          </button>
          <button @click="currentStep = 1" class="btn btn-outline">Back</button>
        </div>
      </div>

      <!-- Step 3: Confirmation -->
      <div v-else-if="currentStep === 3" class="checkout-step confirmation">
        <div class="confirmation-icon">🎉</div>
        <h2 class="confirmation-title">Payment Successful!</h2>
        <p class="confirmation-message">
          Your mystery adventure has been booked. You'll receive your destination 
          <strong>48 hours before departure</strong>.
        </p>

        <div class="order-details">
          <h3>Order Details</h3>
          <p><strong>Order Number:</strong> SWT-{{ orderReference }}</p>
          <p><strong>Total Paid:</strong> R{{ (cartTotal + 50).toLocaleString() }}</p>
          <p><strong>Payment Method:</strong> {{ formattedPaymentMethod }}</p>
        </div>

        <div class="next-steps">
          <h4>What's Next?</h4>
          <ul>
            <li>📧 Check your email for confirmation</li>
            <li>🎁 Destination revealed 48h before departure</li>
            <li>✈️ Start packing - adventure awaits!</li>
          </ul>
        </div>

        <div class="step-actions">
          <router-link to="/profile" class="btn btn-primary">View My Bookings</router-link>
          <router-link to="/" class="btn btn-outline">Back to Home</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'CheckoutView',
  data() {
    return {
      currentStep: 1,
      paymentMethod: 'simulated',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardName: '',
      orderReference: Math.floor(Math.random() * 1000000).toString().padStart(6, '0'),
      processing: false
    }
  },
  computed: {
    ...mapGetters(['cartItems', 'cartCount', 'cartTotal']),
    canProcessPayment() {
      if (this.paymentMethod === 'simulated') return true
      if (this.paymentMethod === 'card') {
        return this.cardNumber.length >= 16 && 
               this.expiryDate.length === 5 && 
               this.cvv.length === 3 && 
               this.cardName.length > 0
      }
      if (this.paymentMethod === 'eft') return true
      return false
    },
    formattedPaymentMethod() {
      const methods = {
        card: 'Credit Card',
        eft: 'EFT',
        payfast: 'PayFast',
        simulated: 'Demo Mode'
      }
      return methods[this.paymentMethod] || this.paymentMethod
    }
  },
  methods: {
    ...mapActions(['checkout', 'clearCart']),
    
    formatDate(dateString) {
      if (!dateString) return 'TBD'
      return new Date(dateString).toLocaleDateString('en-ZA', {
        day: 'numeric',
        month: 'short'
      })
    },
    
    formatCardNumber(e) {
      let value = e.target.value.replace(/\D/g, '')
      value = value.replace(/(.{4})/g, '$1 ').trim()
      this.cardNumber = value.substring(0, 19)
    },
    
    formatExpiry(e) {
      let value = e.target.value.replace(/\D/g, '')
      if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4)
      }
      this.expiryDate = value.substring(0, 5)
    },
    
    processPayment() {
      this.processing = true
      
      // Simulate payment processing
      setTimeout(() => {
        this.processing = false
        this.currentStep = 3
        
        // Clear cart after successful payment
        this.clearCart()
        
        // Here you would call your actual checkout action
        // this.checkout({
        //   method: this.paymentMethod,
        //   details: this.paymentMethod === 'card' ? {
        //     cardNumber: this.cardNumber,
        //     expiry: this.expiryDate,
        //     name: this.cardName
        //   } : null
        // })
      }, 2000)
    }
  }
}
</script>

<style scoped>
.checkout-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.checkout-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  font-size: 2.8rem;
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
  color: #666666;
  font-size: 1.2rem;
}

/* Progress Bar */
.checkout-progress {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 50px;
  padding: 0 20px;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #E0E0E0;
  color: #999999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-bottom: 8px;
  transition: all 0.3s;
}

.progress-step.active .step-number {
  background: #FF6B6B;
  color: white;
  box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.3);
}

.progress-step.completed .step-number {
  background: #28A745;
  color: white;
}

.step-label {
  font-size: 0.9rem;
  color: #666666;
  font-weight: 500;
}

.progress-step.active .step-label {
  color: #FF6B6B;
  font-weight: 600;
}

.progress-line {
  width: 100px;
  height: 2px;
  background: #E0E0E0;
  margin: 0 15px;
  transform: translateY(-12px);
}

.progress-line.active {
  background: #FF6B6B;
}

/* Checkout Steps */
.checkout-step {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.step-title {
  font-size: 1.8rem;
  color: #333333;
  margin-bottom: 30px;
  text-align: center;
}

/* Order Items */
.order-items {
  margin-bottom: 30px;
}

.order-item {
  display: flex;
  align-items: center;
  padding: 20px;
  border: 1px solid #E0E0E0;
  border-radius: 10px;
  margin-bottom: 15px;
  transition: all 0.3s;
}

.order-item:hover {
  border-color: #FF6B6B;
  box-shadow: 0 5px 15px rgba(255, 107, 107, 0.1);
}

.item-image {
  width: 80px;
  height: 80px;
  border-radius: 10px;
  background-size: cover;
  background-position: center;
  margin-right: 20px;
}

.item-details {
  flex: 1;
}

.item-details h3 {
  font-size: 1.2rem;
  color: #333333;
  margin-bottom: 5px;
}

.item-details p {
  color: #666666;
  font-size: 0.9rem;
  margin-bottom: 5px;
}

.item-meta {
  display: flex;
  gap: 15px;
  font-size: 0.85rem;
  color: #999999;
}

.item-price {
  text-align: right;
}

.item-price .quantity {
  display: block;
  color: #999999;
  font-size: 0.9rem;
  margin-bottom: 5px;
}

.item-price .price {
  font-size: 1.2rem;
  font-weight: 700;
  color: #28A745;
}

/* Order Summary */
.order-summary {
  background: #F9F9F9;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 30px;
}

.order-summary h3 {
  margin-bottom: 15px;
  color: #333333;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  color: #666666;
}

.summary-row.total {
  padding-top: 15px;
  margin-top: 10px;
  border-top: 2px dashed #E0E0E0;
  font-size: 1.2rem;
  font-weight: 700;
  color: #333333;
}

.total-price {
  color: #FF6B6B;
}

/* Payment Methods */
.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
}

.payment-method {
  display: flex;
  align-items: center;
  padding: 20px;
  border: 2px solid #E0E0E0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
}

.payment-method:hover {
  border-color: #FF6B6B;
  background: rgba(255, 107, 107, 0.02);
}

.payment-method.active {
  border-color: #FF6B6B;
  background: rgba(255, 107, 107, 0.05);
  box-shadow: 0 5px 15px rgba(255, 107, 107, 0.1);
}

.payment-method.simulated.active {
  border-color: #9B6B9E;
}

.method-radio {
  width: 20px;
  height: 20px;
  border: 2px solid #E0E0E0;
  border-radius: 50%;
  margin-right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.payment-method.active .method-radio {
  border-color: #FF6B6B;
}

.payment-method.simulated.active .method-radio {
  border-color: #9B6B9E;
}

.radio-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #FF6B6B;
}

.payment-method.simulated .radio-dot {
  background: #9B6B9E;
}

.method-content {
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
}

.method-icon {
  font-size: 2rem;
}

.method-details h4 {
  font-size: 1.1rem;
  color: #333333;
  margin-bottom: 3px;
}

.method-details p {
  font-size: 0.9rem;
  color: #999999;
}

/* Payment Form */
.payment-form {
  margin-bottom: 30px;
  padding: 25px;
  background: #F9F9F9;
  border-radius: 10px;
}

.payment-form h3 {
  margin-bottom: 20px;
  color: #333333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #666666;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #E0E0E0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s;
}

.form-group input:focus {
  border-color: #FF6B6B;
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1);
}

.form-row {
  display: flex;
  gap: 15px;
}

.form-group.half {
  flex: 1;
}

/* Payment Info */
.payment-info {
  margin-bottom: 30px;
}

.payment-info h3 {
  margin-bottom: 15px;
  color: #333333;
}

.info-box {
  background: #F0F0F0;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 10px;
}

.info-box p {
  margin-bottom: 8px;
  color: #333333;
}

.info-box.simulated {
  background: rgba(155, 107, 158, 0.1);
  border: 2px dashed #9B6B9E;
}

.test-card {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #E0E0E0;
  font-family: monospace;
  font-weight: 600;
  color: #9B6B9E;
}

.info-note {
  color: #999999;
  font-size: 0.9rem;
  font-style: italic;
}

/* Step Actions */
.step-actions {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}

.step-actions .btn {
  flex: 1;
  padding: 14px;
}

/* Confirmation */
.confirmation {
  text-align: center;
}

.confirmation-icon {
  font-size: 5rem;
  margin-bottom: 20px;
  animation: bounce 1s ease-in-out;
}

@keyframes bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.confirmation-title {
  font-size: 2.2rem;
  color: #28A745;
  margin-bottom: 15px;
}

.confirmation-message {
  color: #666666;
  font-size: 1.1rem;
  margin-bottom: 30px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.order-details {
  background: #F9F9F9;
  padding: 25px;
  border-radius: 10px;
  margin-bottom: 30px;
  text-align: left;
}

.order-details h3 {
  color: #333333;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #E0E0E0;
}

.order-details p {
  margin-bottom: 10px;
  color: #666666;
}

.order-details strong {
  color: #333333;
}

.next-steps {
  text-align: left;
  margin-bottom: 30px;
}

.next-steps h4 {
  color: #333333;
  margin-bottom: 15px;
  font-size: 1.2rem;
}

.next-steps ul {
  list-style: none;
  padding: 0;
}

.next-steps li {
  padding: 10px 0;
  color: #666666;
  border-bottom: 1px solid #F0F0F0;
}

.next-steps li:last-child {
  border-bottom: none;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 30px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: #FF6B6B;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #FF5252;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(255, 107, 107, 0.4);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-outline {
  border: 2px solid #4A6FA5;
  color: #4A6FA5;
  background: transparent;
}

.btn-outline:hover {
  background: #4A6FA5;
  color: white;
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 768px) {
  .page-title {
    font-size: 2.2rem;
  }
  
  .checkout-progress {
    flex-direction: column;
    gap: 20px;
  }
  
  .progress-line {
    width: 2px;
    height: 30px;
    transform: translateY(0);
    margin: 0;
  }
  
  .checkout-step {
    padding: 30px 20px;
  }
  
  .order-item {
    flex-direction: column;
    text-align: center;
  }
  
  .item-image {
    margin-right: 0;
    margin-bottom: 15px;
  }
  
  .item-price {
    text-align: center;
    margin-top: 15px;
  }
  
  .method-content {
    flex-direction: column;
    text-align: center;
    gap: 10px;
  }
  
  .form-row {
    flex-direction: column;
  }
  
  .step-actions {
    flex-direction: column;
  }
}
</style>