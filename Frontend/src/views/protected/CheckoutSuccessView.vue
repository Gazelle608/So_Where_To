<template>
  <div class="checkout-success">
    <h1 class="success-title">Your booking was successful!</h1>
    <p class="success-message">Thank you for booking with us. Your booking reference number is {{ bookingReference }}. We will send you an email confirmation shortly.</p>
    <router-link to="/bookings" class="btn btn-primary">Back to Bookings</router-link>
  </div>
</template>

<script>
export default {
  name: 'CheckoutSuccessView',
  props: {
    bookingReference: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.checkout-success {
  text-align: center;
  margin-top: 100px;
}

.success-title {
  font-size: 2rem;
  margin-bottom: 20px;
}

.success-message {
  font-size: 1.2rem;
  margin-bottom: 20px;
}

.btn {
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 1.2rem;
  cursor: pointer;
}

.btn-primary {
  background-color: #FF6B6B;
  color: #fff;
}

.btn-secondary {
  background-color: #ccc;
  color: #333;
}
</style>