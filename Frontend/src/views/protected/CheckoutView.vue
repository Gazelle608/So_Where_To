<template>
  <div class="checkout-view">
    <div class="checkout-header">
      <h1 class="page-title">Almost <span>There</span>!</h1>
      <p class="page-subtitle">Your adventure is just a payment away</p>
      <div class="checkout-timer" :class="{ warning: timeLeft <= 120 }">
        Time left: {{ formattedTimeLeft }}
      </div>
    </div>

    <div class="checkout-steps">
      <div v-for="(step, index) in steps" :key="index" class="step" :class="{ active: currentStep === index + 1, completed: currentStep > index }">
        {{ step.title }}
      </div>
    </div>

    <div class="checkout-content">
      <div v-if="currentStep === 1" class="checkout-step">
        <h2 class="step-title">Review Your Order</h2>

        <div class="order-summary">
          <h3>Order Summary</h3>
          <div class="summary-row" v-for="(item, index) in cartItems" :key="index">
            <span>{{ item.title }}</span>
            <span>{{ item.price }}</span>
          </div>
          <div class="summary-row total">
            <span>Total</span>
            <span class="total-price">{{ cartTotal }}</span>
          </div>
        </div>

        <div class="step-actions">
          <button @click="currentStep = 2" class="btn btn-primary" :disabled="cartCount === 0">
            Continue to Seat Selection
          </button>
          <router-link to="/cart" class="btn btn-outline">Back to Cart</router-link>
        </div>
      </div>

      <!-- Step 2: Seat Selection -->

      <div v-else-if="currentStep === 2" class="checkout-step">
        <h2 class="step-title">Choose Your Seats</h2>

        <div class="seat-selection">
          <div class="seat-grid" ref="seatGrid">
            <div class="seat" v-for="row in seatRows" :key="row.id" :class="['row', { selected: row.selected }]">
              <div class="seat" v-for="seat in row.seats" :key="seat.id" @click="selectSeat(seat)" :class="['seat', { selected: seat.selected }]">
                {{ seat.price }}
              </div>
            </div>
          </div>
          <div class="seat-summary">
            <h3>Selected Seats</h3>
            <ul>
              <li v-for="(seat, index) in selectedSeats" :key="index">
                <span class="seat-number">{{ index + 1 }}:</span>
                <span class="seat-price">{{ seat.price }}</span>
              </li>
            </ul>
            <div class="total-price">
              Total Price: {{ totalPrice }}
            </div>
          </div>
        </div>

        <div class="step-actions">
          <button @click="currentStep = 3" class="btn btn-primary" :disabled="selectedSeats.length === 0">
            Continue to Payment
          </button>
          <button @click="currentStep = 1" class="btn btn-outline">Back to Review</button>
        </div>
      </div>

      <!-- Step 3: Payment Method -->

      <div v-else-if="currentStep === 3" class="checkout-step">
        <h2 class="step-title">Choose Payment Method</h2>

        <div class="payment-methods">
          <div class="payment-method" @click="selectPaymentMethod('credit-card')">
            <div class="payment-icon">
              <i class="fa fa-credit-card"></i>
            </div>
            <div class="payment-text">
              <h3>Credit Card</h3>
              <p>Pay with your credit card</p>
            </div>
          </div>
          <div class="payment-method" @click="selectPaymentMethod('eft')">
            <div class="payment-icon">
              <i class="fa fa-money"></i>
            </div>
            <div class="payment-text">
              <h3>EFT</h3>
              <p>Pay using Electronic Funds Transfer</p>
            </div>
          </div>
        </div>

        <div class="step-actions">
          <button @click="currentStep = 2" class="btn btn-outline">Back to Seat Selection</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CheckoutView",
  data() {
    return {
      currentStep: 1,
      steps: [
        { title: "Review Order" },
        { title: "Select Seats" },
        { title: "Payment Method" }
      ],
      cartItems: [
        { title: "Movie Ticket", price: "$12.00" },
        { title: "Popcorn", price: "$5.00" }
      ],
      cartTotal: "$17.00",
      seatRows: [
        { id: 1, selected: false, seats: [{ id: 1, price: "$15.00", selected: false }] },
        { id: 2, selected: false, seats: [{ id: 2, price: "$15.00", selected: false }] }
      ],
      selectedSeats: [],
      totalPrice: "$0.00"
    };
  },
  computed: {
    cartCount() {
      return this.cartItems.length;
    }
  },
  methods: {
    selectSeat(seat) {
      seat.selected = !seat.selected;
      if (seat.selected) {
        this.selectedSeats.push(seat);
      } else {
        this.selectedSeats = this.selectedSeats.filter(s => s.id !== seat.id);
      }
      this.updateTotalPrice();
    },
    updateTotalPrice() {
      let total = 0;
      this.selectedSeats.forEach(seat => {
        total += parseFloat(seat.price.replace("$", ""));
      });
      this.totalPrice = `$${total.toFixed(2)}`;
    },
    selectPaymentMethod(method) {
      console.log("Selected payment method:", method);
    }
  }
};
</script>

<style scoped>
.checkout-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.checkout-header {
  text-align: center;
  margin-bottom: 40px;
}

.checkout-timer {
    margin-top: 10px;
    font-size: 1.2rem;
    color: #28A745;
}

.checkout-timer.warning {
    color: #FF6B6B;
}

.checkout-steps {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.checkout-step {
    background: #F9F9F9;
    padding: 30px;
    border-radius: 10px;
    width: 100%;
}

.step-title {
    margin-bottom: 20px;
    color: #333333;
}

.step-actions {
    margin-top: 30px;
    display: flex;
    justify-content: space-between;
}

.payment-methods {
    display: flex;
    gap: 20px;
}

.payment-method {
    flex: 1;
    display: flex;
    align-items: center;
    padding: 20px;
    background: #F9F9F9;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.payment-method:hover {
    background: #E0E0E0;
}

.payment-icon {
    font-size: 2rem;
    color: #FF6B6B;
    margin-right: 20px;
}

.payment-text h3 {
    margin: 0;
    color: #333333;
}

.payment-text p {
    margin: 5px 0 0;
    color: #666666;
}

.seat-selection {
    display: flex;
    gap: 40px;
}

.seat-selection-left {
    flex: 2;
}

.seat-selection-right {
    flex: 1;
}

.seat-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 15px;
}

.seat {
    background: #F9F9F9;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
}

.seat.selected {
    background: #28A745;
    color: white;
}

.seat.taken {
    background: #E0E0E0;
    color: #666666;
    cursor: not-allowed;
}

.seat-summary {
    background: #F9F9F9;
    padding: 20px;
    border-radius: 10px;
}

.seat-summary h3 {
    margin-bottom: 15px;
    color: #333333;
}

.seat-summary ul {
    list-style: none;
    padding: 0;
    margin: 0 0 20px;
}

.seat-summary li {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    color: #666666;
}

.total-price {
    font-size: 1.2rem;
    font-weight: 700;
    color: #28A745;
}
</style>