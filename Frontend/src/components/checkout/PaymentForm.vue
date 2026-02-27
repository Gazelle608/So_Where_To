<template>
  <div class="payment-form">
    <h3>{{ title }}</h3>
    <form @submit.prevent="submitForm">
      <div v-for="(field, index) in fields" :key="index" class="form-group">
        <label :for="`field-${index}`">{{ field.label }}</label>
        <input :id="`field-${index}`" v-model="field.value" :type="field.type" :placeholder="field.placeholder">
        <span v-if="field.errors && field.errors.length > 0" class="error-message">{{ field.errors[0] }}</span>
      </div>
      <button type="submit" class="btn btn-primary">{{ submitButtonText }}</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'PaymentForm',
  props: {
    title: {
      type: String,
      required: true
    },
    fields: {
      type: Array,
      required: true
    },
    submitButtonText: {
      type: String,
      default: 'Submit'
    }
  },
  methods: {
    submitForm() {
      this.$emit('submit', this.fields)
    }
  }
}
</script>

<style scoped>
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
  border: 1px solid #CCCCCC;
  border-radius: 5px;
}

.error-message {
  color: #FF6B6B;
  font-size: 0.9rem;
  margin-top: 5px;
}

.btn {
  margin-top: 20px;
}
</style>