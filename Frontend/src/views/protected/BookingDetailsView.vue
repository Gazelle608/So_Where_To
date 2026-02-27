<template>
  <div class="booking-details" v-if="booking">
    <!-- Header -->
    <div class="booking-header">
      <h1>Complete Your Booking</h1>
      <div class="timer">
        <svg viewBox="0 0 24 24" width="20" height="20">
          <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
        </svg>
        <span class="timer-text">{{ formatTime(timeLeft) }}</span>
      </div>
    </div>

    <!-- Flight Info Ticket -->
    <div class="flight-info">
      <div class="route">
        <div class="from">
          <span class="code">JNB</span>
          <span class="city">Johannesburg</span>
        </div>
        <div class="arrow"><i class="fas fa-plane"></i></div>
        <div class="to">
          <span class="code">{{ booking.code || '???' }}</span>
          <span class="city">{{ booking.city || 'Mystery' }}</span>
        </div>
      </div>
      <div class="flight-details">
        <div class="detail">
          <span class="label">Flight</span>
          <span class="value">{{ booking.flight || 'SWT123' }}</span>
        </div>
        <div class="detail">
          <span class="label">Date</span>
          <span class="value">{{ booking.date || '15 MAR 2026' }}</span>
        </div>
        <div class="detail">
          <span class="label">Time</span>
          <span class="value">10:30</span>
        </div>
        <div class="detail">
          <span class="label">Price</span>
          <span class="value price">R{{ booking.price }}</span>
        </div>
      </div>
    </div>

    <!-- Booking Summary -->
    <div class="booking-summary">
      <h3>Booking Summary</h3>
      <div class="summary-row">
        <span>Flight:</span>
        <span>{{ booking.flight || 'SWT123' }}</span>
      </div>
      <div class="summary-row">
        <span>Destination:</span>
        <span>{{ booking.city || 'Mystery Destination' }}</span>
      </div>
      <div class="summary-row">
        <span>Date:</span>
        <span>{{ booking.date || '15 MAR 2026' }}</span>
      </div>
      <div class="summary-row">
        <span>Seat:</span>
        <span class="selected-seat">{{ booking.seat || 'Selected during checkout' }}</span>
      </div>
      <div class="summary-row total">
        <span>Total:</span>
        <span class="total-price">R{{ booking.price }}</span>
      </div>
      
      <button class="confirm-btn" @click="confirmBooking">
        Confirm Booking
      </button>
    </div>

    <!-- Timeout Warning -->
    <div v-if="showTimeoutWarning" class="timeout-warning">
      <p>Your booking session will expire in {{ timeoutSeconds }} seconds</p>
      <button @click="extendSession" class="extend-btn"><i class="fas fa-plus"></i></button>
    </div>
  </div>
</template>
<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { apiService, apiHelpers } from '@/services/api'
import { useStore } from 'vuex'

export default {
  name: 'BookingDetailsView',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    
    const booking = ref(null)
    
    // Timer (10 minutes = 600 seconds)
    const timeLeft = ref(600)
    const showTimeoutWarning = ref(false)
    const timeoutSeconds = ref(30)
    
    let timer = null
    let warningTimer = null

    // Format time (MM:SS)
    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    // Start countdown
    const startTimer = () => {
      timer = setInterval(() => {
        timeLeft.value--
        
        // Show warning at 30 seconds
        if (timeLeft.value === 30) {
          showTimeoutWarning.value = true
          
          // Countdown warning
          let warningCount = 30
          warningTimer = setInterval(() => {
            warningCount--
            timeoutSeconds.value = warningCount
            if (warningCount <= 0) {
              clearInterval(warningTimer)
            }
          }, 1000)
        }
        
        // Time's up - redirect
        if (timeLeft.value <= 0) {
          clearInterval(timer)
          clearInterval(warningTimer)
          router.push('/destinations')
        }
      }, 1000)
    }

    // Extend session
    const extendSession = () => {
      timeLeft.value = 600
      showTimeoutWarning.value = false
      clearInterval(warningTimer)
    }

    const loadBooking = async () => {
      try {
        const response = await apiService.bookings.getOne(route.params.id)
        const row = response.data || {}
        booking.value = {
          id: row.id || row.booking_id,
          code: row.destination_name ? row.destination_name.slice(0, 3).toUpperCase() : '???',
          city: row.destination_name || 'Mystery',
          flight: `SWT${row.id || row.booking_id}`,
          date: row.departure_date
            ? new Date(row.departure_date).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' })
            : 'TBD',
          price: Number(row.total_amount || row.price || 0),
          status: row.status || 'pending'
        }
      } catch (error) {
        store.commit('SHOW_NOTIFICATION', {
          message: apiHelpers.getErrorMessage(error),
          type: 'error'
        })
        router.push('/bookings')
      }
    }

    const confirmBooking = async () => {
      if (!booking.value?.id) return
      try {
        await apiService.bookings.update(booking.value.id, { status: 'confirmed' })
        store.commit('SHOW_NOTIFICATION', {
          message: `Booking #${booking.value.id} confirmed`,
          type: 'success'
        })
        router.push('/bookings')
      } catch (error) {
        store.commit('SHOW_NOTIFICATION', {
          message: apiHelpers.getErrorMessage(error),
          type: 'error'
        })
      }
    }

    onMounted(() => {
      loadBooking()
      startTimer()
    })

    onUnmounted(() => {
      clearInterval(timer)
      clearInterval(warningTimer)
    })

    return {
      booking,
      timeLeft,
      showTimeoutWarning,
      timeoutSeconds,
      formatTime,
      confirmBooking,
      extendSession
    }
  }
}
</script>

<style scoped>
.booking-details {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.booking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.booking-header h1 {
  font-size: 2rem;
  color: #333;
}

.timer {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f0f0f0;
  padding: 10px 20px;
  border-radius: 30px;
  color: #FF6B6B;
  font-weight: 600;
}

.timer-text {
  font-size: 1.2rem;
  font-family: monospace;
}

/* Flight Info */
.flight-info {
  background: white;
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
}

.route {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
}

.from, .to {
  text-align: center;
}

.from .code, .to .code {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: #333;
}

.from .city, .to .city {
  color: #666;
  font-size: 0.9rem;
}

.arrow {
  font-size: 2rem;
  color: #FF6B6B;
  animation: fly 2s ease-in-out infinite;
}

@keyframes fly {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(10px); }
}

.flight-details {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding-top: 20px;
  border-top: 2px dashed #e0e0e0;
}

.detail {
  text-align: center;
}

.detail .label {
  display: block;
  font-size: 0.8rem;
  color: #999;
  margin-bottom: 5px;
}

.detail .value {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.value.price {
  color: #28A745;
}

/* Booking Summary */
.booking-summary {
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
}

.booking-summary h3 {
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  color: #666;
}

.summary-row.total {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 2px dashed #e0e0e0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
}

.selected-seat {
  color: #4A6FA5;
  font-weight: 700;
}

.total-price {
  color: #28A745;
  font-size: 1.5rem;
}

.confirm-btn {
  width: 100%;
  padding: 15px;
  background: #28A745;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 20px;
}

.confirm-btn:hover {
  background: #218838;
  transform: translateY(-2px);
}

/* Timeout Warning */
.timeout-warning {
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: #FFC107;
  color: #333;
  padding: 15px 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.2);
  z-index: 100;
}

.extend-btn {
  padding: 8px 15px;
  background: #333;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
}

.extend-btn:hover {
  background: #000;
}

/* Dark Mode */
:root.dark-mode .booking-header h1,
:root.dark-mode .booking-summary h3 {
  color: #F5F9FF;
}

:root.dark-mode .flight-info,
:root.dark-mode .booking-summary {
  background: #0B1E33;
  border: 1px solid #1A334D;
}

:root.dark-mode .timer {
  background: #122B44;
  color: #00D4FF;
}

:root.dark-mode .from .code,
:root.dark-mode .to .code,
:root.dark-mode .detail .value {
  color: #F5F9FF;
}

:root.dark-mode .from .city,
:root.dark-mode .to .city,
:root.dark-mode .detail .label {
  color: #B0C4DE;
}

:root.dark-mode .flight-details {
  border-top-color: #1A334D;
}

:root.dark-mode .summary-row {
  color: #B0C4DE;
}

:root.dark-mode .summary-row.total {
  border-top-color: #1A334D;
  color: #F5F9FF;
}

/* Responsive */
@media (max-width: 768px) {
  .booking-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .flight-details {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .timeout-warning {
    left: 20px;
    right: 20px;
    bottom: 20px;
    flex-direction: column;
    text-align: center;
  }
}
</style>
