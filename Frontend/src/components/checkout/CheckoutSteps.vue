<template>
  <div class="checkout-steps">
    <div v-for="(step, index) in steps" :key="index" :class="['step', { active: currentStep >= index + 1, completed: currentStep > index }]">
      {{ step.title }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'CheckoutSteps',
  props: {
    currentStep: {
      type: Number,
      required: true
    },
    steps: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
.checkout-steps {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.step {
  padding: 10px 20px;
  border-radius: 50px;
  background-color: #f5f5f5;
  color: #333;
  text-align: center;
  margin: 0 5px;
  transition: all 0.3s ease;
}

.step.active {
  background-color: #FF6B6B;
  color: white;
}

.step.completed {
  background-color: #28A745;
  color: white;
}

.step:hover {
  cursor: pointer;
  transform: scale(1.1);
}
</style>