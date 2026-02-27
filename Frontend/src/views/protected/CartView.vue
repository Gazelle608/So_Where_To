<template>
  <div class="cart-view">
    <div class="cart-header">
      <h1 class="page-title">Your <span>Mystery Cart</span></h1>
      <p class="page-subtitle" v-if="cartCount > 0">
        You have {{ cartCount }} {{ cartCount === 1 ? 'adventure' : 'adventures' }} waiting
      </p>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Loading your cart...</p>
    </div>

    <div v-else-if="cartCount === 0" class="empty-cart">
      <div class="empty-cart-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="13" x="4" y="7" rx="2"/><path d="M9 7V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v3"/><path d="M12 11v4"/><path d="M12 17h.01"/><path d="M16 11v6"/><path d="M8 11v6"/></svg>
      </div>
      <h2>Your cart is empty</h2>
      <p>Time to spin the globe and find your next adventure!</p>
      <router-link to="/spin" class="btn btn-primary">
        <span class="btn-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M7.5 7.5h.01"/><path d="M16.5 16.5h.01"/><path d="M7.5 16.5h.01"/><path d="M16.5 7.5h.01"/><path d="M12 12h.01"/></svg>
        </span>
        Spin the Globe
      </router-link>
    </div>

    <div v-else class="cart-content">
      <div class="cart-items">
        <div v-for="item in cartItems" :key="item.id" class="cart-item">
          <div class="item-image" :style="{ backgroundImage: `url(${item.image})` }">
            <div class="mystery-badge" v-if="!item.revealed">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Mystery
            </div>
          </div>
          
          <div class="item-details">
            <div class="item-header">
              <h3 class="item-title">{{ item.destination || 'Mystery Destination' }}</h3>
              <button @click="removeItem(item.id)" class="remove-btn" title="Remove">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            
            <div class="item-info">
              <div class="info-row"><span class="info-label">Departure:</span><span class="info-value">{{ formatDate(item.departure) }}</span></div>
              <div class="info-row"><span class="info-label">Return:</span><span class="info-value">{{ formatDate(item.return) }}</span></div>
              <div class="info-row"><span class="info-label">Airline:</span><span class="info-value">{{ item.airline }}</span></div>
              <div class="info-row"><span class="info-label">Accommodation:</span><span class="info-value">{{ item.hostel }}</span></div>
            </div>

            <div class="item-footer">
              <div class="quantity-control">
                <button @click="updateQuantity(item.id, item.quantity - 1)" class="quantity-btn" :disabled="item.quantity <= 1">−</button>
                <span class="quantity">{{ item.quantity }}</span>
                <button @click="updateQuantity(item.id, item.quantity + 1)" class="quantity-btn">+</button>
              </div>
              <div class="item-price">
                <span class="price-label">Total:</span>
                <span class="price-value">R{{ (item.price * item.quantity).toLocaleString() }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="cart-summary">
        <h3 class="summary-title">Order Summary</h3>
        <div class="summary-details">
          <div class="summary-row"><span>Subtotal ({{ cartCount }} items)</span><span>R{{ cartTotal.toLocaleString() }}</span></div>
          <div class="summary-row"><span>Booking Fee</span><span>R{{ bookingFee.toLocaleString() }}</span></div>
          <div class="summary-row discount" v-if="discount > 0"><span>Mystery Discount</span><span>-R{{ discount.toLocaleString() }}</span></div>
          <div class="summary-row total"><span>Total</span><span class="total-value">R{{ grandTotal.toLocaleString() }}</span></div>
        </div>

        <div class="summary-actions">
          <router-link to="/spin" class="btn btn-outline">
            <span class="btn-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            </span>
            Add More
          </router-link>
          <router-link to="/checkout" class="btn btn-primary">
            <span class="btn-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
            </span>
            Checkout
          </router-link>
        </div>

        <div class="guarantee">
          <span class="guarantee-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#28A745" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </span>
          <div class="guarantee-text">
            <strong>Secure Checkout</strong>
            <p>Your payment info is encrypted</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'CartView',
  data() {
    return {
      loading: false,
      promoCode: '',
      promoApplied: false,
      discount: 0,
      bookingFee: 50,
      recentBundles: []
    }
  },
  computed: {
    ...mapGetters(['cartItems', 'cartCount', 'cartTotal']),
    grandTotal() {
      return this.cartTotal + this.bookingFee - this.discount
    }
  },
  created() {
    this.loadRecentBundles()
  },
  methods: {
    ...mapActions(['removeFromCart', 'updateCartQuantity', 'addToCart']),
    
    formatDate(dateString) {
      if (!dateString) return 'TBD'
      return new Date(dateString).toLocaleDateString('en-ZA', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    },
    
    removeItem(id) {
      if (confirm('Remove this adventure from your cart?')) {
        this.removeFromCart(id)
      }
    },
    
    updateQuantity(id, quantity) {
      if (quantity > 0) {
        this.updateCartQuantity({ id, quantity })
      }
    },
    
    applyPromo() {
      if (this.promoCode.toUpperCase() === 'MYSTERY10') {
        this.discount = this.cartTotal * 0.1
        this.promoApplied = true
        this.promoCode = ''
        alert('Promo code applied! 10% discount')
      } else {
        alert('Invalid promo code. Try "MYSTERY10"')
      }
    },
    
    loadRecentBundles() {
      // Mock data - replace with actual API call
      this.recentBundles = [
        { id: 101, destination: 'Tokyo', price: 1299, image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
        { id: 102, destination: 'Paris', price: 999, image: 'https://images.unsplash.com/photo-1679231926688-ef9cdab5ed2f?q=80&w=1391&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
        { id: 103, destination: 'Bangkok', price: 899, image: 'https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmFuZ2tvayUyMGNpdHl8ZW58MHx8MHx8fDA%3D' }
      ]
    }
  }
}
</script>

<style scoped>
.cart-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.cart-header {
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

/* Loading State */
.loading-container {
  text-align: center;
  padding: 60px 20px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #E0E0E0;
  border-top-color: #FF6B6B;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Empty Cart */
.empty-cart {
  text-align: center;
  padding: 60px 20px;
  background: #F9F9F9;
  border-radius: 20px;
  max-width: 500px;
  margin: 0 auto;
}

.empty-cart-icon {
  font-size: 5rem;
  margin-bottom: 20px;
  animation: float 3s ease-in-out infinite;
}

.empty-cart h2 {
  font-size: 2rem;
  color: #333333;
  margin-bottom: 15px;
}

.empty-cart p {
  color: #666666;
  margin-bottom: 30px;
}

/* Cart Content */
.cart-content {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 30px;
}

/* Cart Items */
.cart-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cart-item {
  display: flex;
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.cart-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(255, 107, 107, 0.15);
}

.item-image {
  width: 200px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.mystery-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(0,0,0,0.7);
  color: white;
  padding: 5px 10px;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
}

.item-details {
  flex: 1;
  padding: 20px;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.item-title {
  font-size: 1.5rem;
  color: #333333;
  margin: 0;
}

.remove-btn {
  background: none;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #F9F9F9;
  color: #999999;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.remove-btn:hover {
  background: #DC3545;
  color: white;
  transform: rotate(90deg);
}

.item-info {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  flex-direction: column;
}

.info-label {
  font-size: 0.8rem;
  color: #999999;
  margin-bottom: 3px;
}

.info-value {
  font-size: 0.95rem;
  color: #333333;
  font-weight: 500;
}

.item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid #E0E0E0;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 10px;
}

.quantity-btn {
  width: 30px;
  height: 30px;
  border: 1px solid #E0E0E0;
  background: white;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.quantity-btn:hover:not(:disabled) {
  background: #4A6FA5;
  color: white;
  border-color: #4A6FA5;
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity {
  font-size: 1.1rem;
  font-weight: 600;
  min-width: 30px;
  text-align: center;
}

.item-price {
  text-align: right;
}

.price-label {
  font-size: 0.9rem;
  color: #999999;
  margin-right: 5px;
}

.price-value {
  font-size: 1.3rem;
  font-weight: 700;
  color: #28A745;
}

/* Cart Summary */
.cart-summary {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  height: fit-content;
  position: sticky;
  top: 20px;
}

.summary-title {
  font-size: 1.5rem;
  color: #333333;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #F0F0F0;
}

.summary-details {
  margin-bottom: 25px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  color: #666666;
}

.summary-row.discount {
  color: #28A745;
}

.summary-row.total {
  padding-top: 15px;
  margin-top: 10px;
  border-top: 2px dashed #E0E0E0;
  font-size: 1.3rem;
  font-weight: 700;
  color: #333333;
}

.total-value {
  color: #FF6B6B;
}

/* Promo Code */
.promo-code {
  margin-bottom: 25px;
}

.promo-input-group {
  display: flex;
  gap: 10px;
  margin-bottom: 5px;
}

.promo-input-group input {
  flex: 1;
  padding: 12px;
  border: 2px solid #E0E0E0;
  border-radius: 10px;
  font-size: 0.95rem;
  transition: all 0.3s;
}

.promo-input-group input:focus {
  border-color: #FF6B6B;
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1);
}

.promo-btn {
  padding: 0 20px;
  background: #4A6FA5;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.promo-btn:hover {
  background: #3A5A84;
  transform: translateY(-2px);
}

.promo-hint {
  font-size: 0.8rem;
  color: #999999;
}

/* Summary Actions */
.summary-actions {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.summary-actions .btn {
  flex: 1;
  padding: 12px;
  font-size: 0.95rem;
}

/* Payment Badges */
.payment-badges {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 20px;
  padding: 15px 0;
  border-top: 1px solid #E0E0E0;
  border-bottom: 1px solid #E0E0E0;
}

.badge {
  padding: 5px 12px;
  background: #F0F0F0;
  border-radius: 50px;
  font-size: 0.8rem;
  color: #666666;
}

/* Guarantee */
.guarantee {
  display: flex;
  gap: 15px;
  align-items: center;
}

.guarantee-icon {
  font-size: 2rem;
}

.guarantee-text strong {
  display: block;
  color: #333333;
  margin-bottom: 3px;
}

.guarantee-text p {
  font-size: 0.9rem;
  color: #999999;
}

/* Recently Viewed */
.recently-viewed {
  margin-top: 60px;
}

.recent-title {
  font-size: 1.8rem;
  color: #333333;
  margin-bottom: 25px;
  text-align: center;
}

.recent-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.recent-card {
  height: 200px;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.recent-image {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
}

.recent-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(transparent, rgba(0,0,0,0.8));
  color: white;
  transform: translateY(100%);
  transition: transform 0.3s;
}

.recent-card:hover .recent-overlay {
  transform: translateY(0);
}

.recent-overlay h4 {
  color: white;
  margin-bottom: 5px;
}

.recent-overlay p {
  font-weight: 600;
  color: #FF6B6B;
  margin-bottom: 10px;
}

.recent-add-btn {
  padding: 5px 15px;
  background: #FF6B6B;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.recent-add-btn:hover {
  background: #FF5252;
  transform: scale(1.05);
}

/* Responsive */
@media (max-width: 968px) {
  .cart-content {
    grid-template-columns: 1fr;
  }
  
  .cart-summary {
    position: static;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2.2rem;
  }
  
  .cart-item {
    flex-direction: column;
  }
  
  .item-image {
    width: 100%;
    height: 150px;
  }
  
  .item-info {
    grid-template-columns: 1fr;
  }
  
  .summary-actions {
    flex-direction: column;
  }
  
  .recent-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .recent-grid {
    grid-template-columns: 1fr;
  }
  
  .payment-badges {
    justify-content: center;
  }
}
</style>