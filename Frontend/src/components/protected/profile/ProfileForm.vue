<template>
  <div class="profile-form">
    <div class="form-header">
      <h3 class="form-title">Personal Information</h3>
      <p class="form-description">Update your personal details and preferences</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <LoadingSpinner size="medium" message="Loading profile..." />
    </div>

    <form v-else @submit.prevent="handleSubmit" class="form">
      <!-- Avatar Section -->
      <div class="avatar-section">
        <div class="avatar-container">
          <img 
            :src="avatarPreview || profile.avatar || '/images/default-avatar.png'" 
            :alt="profile.firstName"
            class="avatar-image"
          >
          <div class="avatar-overlay">
            <button type="button" @click="triggerFileInput" class="avatar-upload-btn">
              <span class="upload-icon">📷</span>
              <span>Change Photo</span>
            </button>
          </div>
        </div>
        <input 
          type="file" 
          ref="fileInput" 
          @change="handleFileChange" 
          accept="image/*"
          class="file-input"
        >
      </div>

      <!-- Form Grid -->
      <div class="form-grid">
        <!-- First Name -->
        <div class="form-group">
          <label for="firstName">First Name</label>
          <input 
            type="text" 
            id="firstName"
            v-model="formData.firstName" 
            :class="{ error: errors.firstName }"
            placeholder="Enter your first name"
          >
          <span v-if="errors.firstName" class="error-message">{{ errors.firstName }}</span>
        </div>

        <!-- Last Name -->
        <div class="form-group">
          <label for="lastName">Last Name</label>
          <input 
            type="text" 
            id="lastName"
            v-model="formData.lastName" 
            :class="{ error: errors.lastName }"
            placeholder="Enter your last name"
          >
          <span v-if="errors.lastName" class="error-message">{{ errors.lastName }}</span>
        </div>

        <!-- Email -->
        <div class="form-group">
          <label for="email">Email Address</label>
          <input 
            type="email" 
            id="email"
            v-model="formData.email" 
            :class="{ error: errors.email }"
            placeholder="your@email.com"
          >
          <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
        </div>

        <!-- Phone -->
        <div class="form-group">
          <label for="phone">Phone Number</label>
          <input 
            type="tel" 
            id="phone"
            v-model="formData.phone" 
            :class="{ error: errors.phone }"
            placeholder="+27 12 345 6789"
          >
          <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
        </div>

        <!-- Date of Birth -->
        <div class="form-group">
          <label for="dob">Date of Birth</label>
          <input 
            type="date" 
            id="dob"
            v-model="formData.dateOfBirth" 
            :class="{ error: errors.dateOfBirth }"
          >
          <span v-if="errors.dateOfBirth" class="error-message">{{ errors.dateOfBirth }}</span>
        </div>

        <!-- City -->
        <div class="form-group">
          <label for="city">City</label>
          <input 
            type="text" 
            id="city"
            v-model="formData.city" 
            :class="{ error: errors.city }"
            placeholder="Enter your city"
          >
          <span v-if="errors.city" class="error-message">{{ errors.city }}</span>
        </div>

        <!-- Country -->
        <div class="form-group">
          <label for="country">Country</label>
          <select 
            id="country"
            v-model="formData.country" 
            :class="{ error: errors.country }"
          >
            <option value="">Select your country</option>
            <option value="South Africa">South Africa</option>
            <option value="Other">Other</option>
          </select>
          <span v-if="errors.country" class="error-message">{{ errors.country }}</span>
        </div>

        <!-- Passport Number -->
        <div class="form-group">
          <label for="passport">Passport Number</label>
          <input 
            type="text" 
            id="passport"
            v-model="formData.passportNumber" 
            :class="{ error: errors.passportNumber }"
            placeholder="Enter passport number"
          >
          <span v-if="errors.passportNumber" class="error-message">{{ errors.passportNumber }}</span>
        </div>

        <!-- Passport Expiry -->
        <div class="form-group">
          <label for="passportExpiry">Passport Expiry</label>
          <input 
            type="date" 
            id="passportExpiry"
            v-model="formData.passportExpiry" 
            :class="{ error: errors.passportExpiry }"
          >
          <span v-if="errors.passportExpiry" class="error-message">{{ errors.passportExpiry }}</span>
        </div>
      </div>

      <!-- Preferences Section -->
      <div class="preferences-section">
        <h4 class="preferences-title">Preferences</h4>
        
        <div class="preferences-grid">
          <!-- Preferred Airline -->
          <div class="form-group">
            <label for="airline">Preferred Airline</label>
            <select id="airline" v-model="formData.preferences.airline">
              <option value="">No preference</option>
              <option value="FlySafair">FlySafair</option>
              <option value="Lift">Lift</option>
              <option value="Kulula">Kulula</option>
              <option value="SAA">SAA</option>
              <option value="Emirates">Emirates</option>
            </select>
          </div>

          <!-- Accommodation Type -->
          <div class="form-group">
            <label for="accommodation">Accommodation Type</label>
            <select id="accommodation" v-model="formData.preferences.accommodation">
              <option value="hostel">Hostel (Shared)</option>
              <option value="budget">Budget Hotel</option>
              <option value="private">Private Room</option>
            </select>
          </div>

          <!-- Max Budget -->
          <div class="form-group">
            <label for="budget">Max Budget (R)</label>
            <input 
              type="range" 
              id="budget"
              v-model.number="formData.preferences.maxBudget" 
              min="799" 
              max="3000" 
              step="100"
            >
            <span class="range-value">R{{ formData.preferences.maxBudget }}</span>
          </div>
        </div>

        <!-- Notification Preferences -->
        <div class="notifications-section">
          <h5 class="notifications-title">Notifications</h5>
          
          <label class="checkbox-label">
            <input type="checkbox" v-model="formData.preferences.newsletter">
            <span class="checkbox-text">Email me mystery deals and offers</span>
          </label>

          <label class="checkbox-label">
            <input type="checkbox" v-model="formData.preferences.emailNotifications">
            <span class="checkbox-text">Email me booking confirmations</span>
          </label>

          <label class="checkbox-label">
            <input type="checkbox" v-model="formData.preferences.smsAlerts">
            <span class="checkbox-text">SMS alerts for flight changes</span>
          </label>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="form-actions">
        <button type="submit" class="btn-save" :disabled="saving || !isFormValid">
          <span v-if="saving" class="spinner"></span>
          <span v-else>Save Changes</span>
        </button>
        
        <button type="button" class="btn-cancel" @click="resetForm" :disabled="saving">
          Cancel
        </button>
      </div>

      <!-- Success Message -->
      <transition name="slide">
        <div v-if="showSuccess" class="success-message">
          <span class="success-icon">✓</span>
          Profile updated successfully!
        </div>
      </transition>
    </form>
  </div>
</template>

<script>
import { ref, reactive, computed, watch } from 'vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

export default {
  name: 'ProfileForm',
  components: {
    LoadingSpinner
  },
  props: {
    profile: {
      type: Object,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['save'],
  setup(props, { emit }) {
    // State
    const formData = reactive({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      city: '',
      country: '',
      passportNumber: '',
      passportExpiry: '',
      preferences: {
        airline: '',
        accommodation: 'hostel',
        maxBudget: 1500,
        newsletter: true,
        emailNotifications: true,
        smsAlerts: false
      }
    })

    const errors = ref({})
    const saving = ref(false)
    const showSuccess = ref(false)
    const avatarPreview = ref(null)
    const fileInput = ref(null)

    // Initialize form with props
    const initForm = () => {
      Object.assign(formData, {
        firstName: props.profile.firstName || '',
        lastName: props.profile.lastName || '',
        email: props.profile.email || '',
        phone: props.profile.phone || '',
        dateOfBirth: props.profile.dateOfBirth || '',
        city: props.profile.city || '',
        country: props.profile.country || '',
        passportNumber: props.profile.passportNumber || '',
        passportExpiry: props.profile.passportExpiry || '',
        preferences: {
          ...formData.preferences,
          ...(props.profile.preferences || {})
        }
      })
    }

    watch(() => props.profile, initForm, { immediate: true })

    // Computed
    const isFormValid = computed(() => {
      return formData.firstName && 
             formData.lastName && 
             formData.email && 
             Object.keys(errors.value).length === 0
    })

    // Validation
    const validateForm = () => {
      const newErrors = {}

      if (!formData.firstName) newErrors.firstName = 'First name is required'
      if (!formData.lastName) newErrors.lastName = 'Last name is required'
      
      if (!formData.email) {
        newErrors.email = 'Email is required'
      } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email'
      }

      if (formData.phone && !/^[+\d\s-]{10,}$/.test(formData.phone)) {
        newErrors.phone = 'Please enter a valid phone number'
      }

      if (formData.passportNumber && formData.passportNumber.length < 6) {
        newErrors.passportNumber = 'Passport number must be at least 6 characters'
      }

      if (formData.passportExpiry && new Date(formData.passportExpiry) < new Date()) {
        newErrors.passportExpiry = 'Passport has expired'
      }

      errors.value = newErrors
      return Object.keys(newErrors).length === 0
    }

    // Methods
    const handleSubmit = async () => {
      if (!validateForm()) return

      saving.value = true
      
      try {
        await emit('save', { ...formData })
        showSuccess.value = true
        setTimeout(() => {
          showSuccess.value = false
        }, 3000)
      } catch (error) {
        console.error('Failed to save profile:', error)
      } finally {
        saving.value = false
      }
    }

    const resetForm = () => {
      initForm()
      errors.value = {}
      avatarPreview.value = null
    }

    const triggerFileInput = () => {
      fileInput.value.click()
    }

    const handleFileChange = (event) => {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          avatarPreview.value = e.target.result
        }
        reader.readAsDataURL(file)
      }
    }

    return {
      formData,
      errors,
      saving,
      showSuccess,
      avatarPreview,
      fileInput,
      isFormValid,
      handleSubmit,
      resetForm,
      triggerFileInput,
      handleFileChange
    }
  }
}
</script>

<style scoped>
.profile-form {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  border: 1px solid #e0e0e0;
}

.form-header {
  margin-bottom: 30px;
}

.form-title {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 8px;
}

.form-description {
  color: #666;
  font-size: 0.95rem;
}

/* Loading State */
.loading-state {
  padding: 60px;
  text-align: center;
}

/* Avatar Section */
.avatar-section {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.avatar-container {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  border: 3px solid #FF6B6B;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.avatar-container:hover .avatar-overlay {
  opacity: 1;
}

.avatar-upload-btn {
  background: none;
  border: none;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  font-size: 0.9rem;
}

.upload-icon {
  font-size: 1.5rem;
}

.file-input {
  display: none;
}

/* Form Grid */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 5px;
  font-weight: 500;
}

.form-group input,
.form-group select {
  padding: 12px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 0.95rem;
  transition: all 0.3s;
  background: white;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #FF6B6B;
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1);
}

.form-group input.error,
.form-group select.error {
  border-color: #DC3545;
}

.error-message {
  color: #DC3545;
  font-size: 0.8rem;
  margin-top: 5px;
}

/* Range Input */
input[type="range"] {
  padding: 0;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  -webkit-appearance: none;
  appearance: none;

}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  background: #FF6B6B;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.2s;
}

input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.range-value {
  display: block;
  text-align: right;
  color: #FF6B6B;
  font-weight: 600;
  margin-top: 5px;
}

/* Preferences Section */
.preferences-section {
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
}

.preferences-title {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e0e0e0;
}

.preferences-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

/* Notifications */
.notifications-section {
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.notifications-title {
  font-size: 1rem;
  color: #333;
  margin-bottom: 15px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 0.95rem;
  color: #666;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

/* Form Actions */
.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
}

.btn-save, .btn-cancel {
  padding: 12px 30px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1rem;
}

.btn-save {
  background: #28A745;
  color: white;
}

.btn-save:hover:not(:disabled) {
  background: #218838;
  transform: translateY(-2px);
}

.btn-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-cancel {
  background: #f0f0f0;
  color: #666;
}

.btn-cancel:hover:not(:disabled) {
  background: #e0e0e0;
  transform: translateY(-2px);
}

.btn-cancel:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinner {
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

/* Success Message */
.success-message {
  margin-top: 20px;
  padding: 15px;
  background: #28A745;
  color: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.success-icon {
  font-size: 1.2rem;
  font-weight: bold;
}

/* Dark Mode */
:root.dark-mode .profile-form {
  background: #0B1E33;
  border-color: #1A334D;
}

:root.dark-mode .form-title {
  color: #F5F9FF;
}

:root.dark-mode .form-description {
  color: #B0C4DE;
}

:root.dark-mode .form-group label {
  color: #B0C4DE;
}

:root.dark-mode .form-group input,
:root.dark-mode .form-group select {
  background: #122B44;
  border-color: #1A334D;
  color: #F5F9FF;
}

:root.dark-mode .form-group input::placeholder {
  color: #B0C4DE;
}

:root.dark-mode .preferences-section {
  background: #122B44;
}

:root.dark-mode .preferences-title {
  color: #F5F9FF;
  border-bottom-color: #1A334D;
}

:root.dark-mode .notifications-title {
  color: #F5F9FF;
}

:root.dark-mode .checkbox-label {
  color: #B0C4DE;
}

:root.dark-mode .btn-cancel {
  background: #122B44;
  color: #B0C4DE;
  border: 1px solid #1A334D;
}

:root.dark-mode .btn-cancel:hover {
  background: #1A334D;
}

/* Responsive */
@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .preferences-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column-reverse;
  }
  
  .btn-save, .btn-cancel {
    width: 100%;
  }
  
  .avatar-container {
    width: 100px;
    height: 100px;
  }
}

@media (max-width: 480px) {
  .profile-form {
    padding: 20px;
  }
  
  .form-title {
    font-size: 1.3rem;
  }
}
</style>