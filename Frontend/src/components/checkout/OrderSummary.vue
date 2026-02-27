<template>
  <div class="order-summary">
    <h3>Order Summary</h3>
    <div class="summary-row" v-for="(item, index) in orderItems" :key="index">
      <span>{{ item.title }}</span>
      <span>{{ item.price }}</span>
    </div>
    <div class="summary-row total">
      <span>Total</span>
      <span class="total-price">{{ grandTotal }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderSummary',
  props: {
    orderItems: {
      type: Array,
      required: true
    },
    grandTotal: {
      type: Number,
      required: true
    }
  }
}
</script>

<style scoped>
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

.total-price {
  font-size: 1.2rem;
  font-weight: 700;
  color: #28A745;
}
</style>