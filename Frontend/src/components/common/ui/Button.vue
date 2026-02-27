<template>
  <button :class="['btn', { 'btn-primary': primary, 'btn-secondary': secondary }, { 'btn-small': small, 'btn-large': large }, { 'btn-rounded': rounded }, { 'btn-loading': isLoading }]">
    <span v-if="iconName" class="btn-icon">
      <i :class="['fa', iconName]"></i>
    </span>
    <span :class="['btn-text', { 'btn-loading-text': isLoading }]">{{ text }}</span>
  </button>
</template>

<script>
export default {
  name: 'Button',
  props: {
    text: {
      type: String,
      required: true
    },
    primary: {
      type: Boolean,
      default: false
    },
    secondary: {
      type: Boolean,
      default: false
    },
    small: {
      type: Boolean,
      default: false
    },
    large: {
      type: Boolean,
      default: false
    },
    rounded: {
      type: Boolean,
      default: false
    },
    iconName: {
      type: String,
      default: ''
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.btn {
  font-size: 1rem;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #28A745;
  color: white;
}

.btn-secondary {
  background-color: #6C757D;
  color: white;
}

.btn-small {
  padding: 8px 16px;
}

.btn-large {
  padding: 12px 24px;
}

.btn-rounded {
  border-radius: 50px;
}

.btn-loading {
  cursor: not-allowed;
  background-color: #CED4DA;
  opacity: 0.7;
}

.btn-loading-text {
  opacity: 0;
}

.btn-icon {
  margin-right: 10px;
}

.btn-text {
  margin-left: 10px;
}
</style>