<template>
  <div class="booking-details" v-if="booking">
    <!-- Header with Back Button -->
    <div class="details-header">
      <button @click="$emit('back')" class="back-btn">
        <span class="back-icon">←</span>
        Back to Bookings
      </button>
      
      <div class="header-actions">
        <button @click="downloadItinerary" class="action-btn" title="Download Itinerary">
          <span class="action-icon">📄</span>
        </button>
        <button @click="printPage" class="action-btn" title="Print">
          <span class="action-icon">🖨️</span>
        </button>
        <button @click="shareBooking" class="action-btn" title="Share">
          <span class="action-icon">📤</span>
        </button>
      </div>
    </div>

    <!-- Status Banner -->
    <div class="status-banner" :class="booking.status">
      <div class="status-icon">{{ statusIcon }}</div>
      <div class="status-content">
        <h3 class="status-title">{{ statusTitle }}</h3>
        <p class="status-message">{{ statusMessage }}</p>
      </div>
      <div v-if="canCancel" class="status-action">
        <button @click="$emit('cancel', booking.id)" class="cancel-btn">
          Cancel Booking
        </button>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="details-grid">
      <!-- Left Column -->
      <div class="left-column">
        <!-- Destination Card -->
        <div class="destination-card" :class="{ mystery: !booking.revealed }">
          <div class="destination-image" :style="{ backgroundImage: `url(${booking.image})` }">
            <div v-if="!booking.revealed" class="mystery-reveal">
              <span class="mystery-icon">❓</span>
              <p class="reveal-countdown">
                Reveals in {{ daysUntilReveal }} days
              </p>
            </div>
          </div>
          <div class="destination-info">
            <h2>{{ booking.revealed ? booking.destination : 'Mystery Destination' }}</h2>
            <p v-if="booking.revealed">{{ booking.country }}</p>
            <p v-else class="region">{{ booking.region }} Region</p>
          </div>
        </div>

        <!-- Countdown Timer -->
        <div class="countdown-card">
          <h3>Time Until Departure</h3>
          <div class="countdown-timer">
            <div class="countdown-item">
              <span class="countdown-value">{{ countdown.days }}</span>
              <span class="countdown-label">Days</span>
            </div>
            <div class="countdown-item">
              <span class="countdown-value">{{ countdown.hours }}</span>
              <span class="countdown-label">Hours</span>
            </div>
            <div class="countdown-item">
              <span class="countdown-value">{{ countdown.minutes }}</span>
              <span class="countdown-label">Mins</span>
            </div>
          </div>
          
          <div class="progress-section">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
            </div>
            <p class="progress-text">{{ progressPercentage }}% of wait time complete</p>
          </div>
        </div>

        <!-- Weather Widget (if revealed) -->
        <div v-if="booking.revealed && weather" class="weather-card">
          <h3>Weather in {{ booking.destination }}</h3>
          <div class="weather-content">
            <span class="weather-icon">{{ weather.icon }}</span>
            <div class="weather-info">
              <span class="weather-temp">{{ weather.temp }}°C</span>
              <span class="weather-desc">{{ weather.description }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="right-column">
        <!-- Flight Details -->
        <div class="info-section">
          <h3>
            <span class="section-icon">✈️</span>
            Flight Details
          </h3>
          <div class="info-grid">
            <div class="info-row">
              <span class="info-label">Airline:</span>
              <span class="info-value">{{ booking.airline }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Flight Number:</span>
              <span class="info-value">{{ booking.flightNumber || 'TBA' }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Departure:</span>
              <span class="info-value">{{ formatDateTime(booking.departure) }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Arrival:</span>
              <span class="info-value">{{ formatDateTime(booking.arrival) }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Duration:</span>
              <span class="info-value">{{ booking.duration || 'TBA' }}</span>
            </div>
          </div>
        </div>

        <!-- Accommodation Details -->
        <div class="info-section">
          <h3>
            <span class="section-icon">🏨</span>
            Accommodation
          </h3>
          <div class="info-grid">
            <div class="info-row">
              <span class="info-label">Name:</span>
              <span class="info-value">{{ booking.accommodation }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Type:</span>
              <span class="info-value">{{ booking.accommodationType || 'Standard' }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Address:</span>
              <span class="info-value">{{ booking.accommodationAddress || 'TBA' }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Check-in:</span>
              <span class="info-value">{{ formatTime(booking.checkIn) || '14:00' }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Check-out:</span>
              <span class="info-value">{{ formatTime(booking.checkOut) || '10:00' }}</span>
            </div>
          </div>
        </div>

        <!-- Payment Details -->
        <div class="info-section">
          <h3>
            <span class="section-icon">💰</span>
            Payment Details
          </h3>
          <div class="info-grid">
            <div class="info-row">
              <span class="info-label">Booking #:</span>
              <span class="info-value">{{ booking.bookingNumber }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Booked On:</span>
              <span class="info-value">{{ formatDate(booking.bookedDate) }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Payment Method:</span>
              <span class="info-value">{{ booking.paymentMethod || 'Credit Card' }}</span>
            </div>
            <div class="info-row total">
              <span class="info-label">Total Paid:</span>
              <span class="info-value price">R{{ booking.totalPrice.toLocaleString() }}</span>
            </div>
          </div>
        </div>

        <!-- Passenger Details -->
        <div v-if="booking.passengers" class="info-section">
          <h3>
            <span class="section-icon">👥</span>
            Passengers
          </h3>
          <div v-for="(passenger, index) in booking.passengers" :key="index" class="passenger-item">
            <span class="passenger-name">{{ passenger.name }}</span>
            <span class="passenger-detail">{{ passenger.passport }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="action-buttons">
      <button @click="downloadItinerary" class="btn-primary">
        <span class="btn-icon">📄</span>
        Download Full Itinerary
      </button>
      <button @click="$emit('contact')" class="btn-secondary">
        <span class="btn-icon">📞</span>
        Contact Support
      </button>
    </div>
  </div>
</template>

<script>
import { computed, ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'BookingDetails',
  props: {
    booking: {
      type: Object,
      required: true
    }
  },
  emits: ['back', 'cancel', 'contact'],
  setup(props) {
    const timer = ref(null)
    const weather = ref(null)
    
    // Status helpers
    const statusIcon = computed(() => {
      const icons = {
        confirmed: '✅',
        pending: '⏳',
        completed: '🎉',
        cancelled: '❌'
      }
      return icons[props.booking.status] || '📅'
    })

    const statusTitle = computed(() => {
      const titles = {
        confirmed: 'Booking Confirmed',
        pending: 'Awaiting Confirmation',
        completed: 'Trip Completed',
        cancelled: 'Booking Cancelled'
      }
      return titles[props.booking.status] || 'Booking Status'
    })

    const statusMessage = computed(() => {
      if (props.booking.status === 'confirmed') {
        return 'Your adventure is confirmed! Check your email for e-tickets.'
      } else if (props.booking.status === 'pending') {
        return 'We\'re confirming your booking with partners. This usually takes 24 hours.'
      } else if (props.booking.status === 'completed') {
        return 'Hope you had an amazing trip! Share your experience with us.'
      } else if (props.booking.status === 'cancelled') {
        return 'This booking has been cancelled. Refund will be processed within 5-7 business days.'
      }
      return ''
    })

    const canCancel = computed(() => {
      return props.booking.status === 'confirmed' && 
             new Date(props.booking.departure) > new Date()
    })

    // Countdown
    const countdown = ref({ days: 0, hours: 0, minutes: 0 })
    
    const daysUntilReveal = computed(() => {
      if (!props.booking.revealDate) return '?'
      const diff = new Date(props.booking.revealDate) - new Date()
      return Math.ceil(diff / (1000 * 60 * 60 * 24))
    })

    const progressPercentage = computed(() => {
      if (!props.booking.departure) return 0
      
      const now = new Date()
      const departure = new Date(props.booking.departure)
      const bookedDate = new Date(props.booking.bookedDate)
      
      const totalTime = departure - bookedDate
      const elapsedTime = now - bookedDate
      
      if (elapsedTime < 0) return 0
      if (elapsedTime > totalTime) return 100
      
      return Math.round((elapsedTime / totalTime) * 100)
    })

    const updateCountdown = () => {
      if (!props.booking.departure) return
      
      const now = new Date()
      const departure = new Date(props.booking.departure)
      const diff = departure - now
      
      if (diff > 0) {
        countdown.value = {
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60)
        }
      }
    }

    // Formatting functions
    const formatDate = (dateString) => {
      if (!dateString) return 'TBD'
      return new Date(dateString).toLocaleDateString('en-ZA', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    }

    const formatDateTime = (dateString) => {
      if (!dateString) return 'TBD'
      return new Date(dateString).toLocaleString('en-ZA', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const formatTime = (dateString) => {
      if (!dateString) return 'TBD'
      return new Date(dateString).toLocaleTimeString('en-ZA', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    // Actions
    const downloadItinerary = () => {
      console.log('Downloading itinerary...')
    }

    const printPage = () => {
      window.print()
    }

    const shareBooking = () => {
      if (navigator.share) {
        navigator.share({
          title: `Booking #${props.booking.bookingNumber}`,
          text: `My adventure to ${props.booking.revealed ? props.booking.destination : '???'}`,
          url: window.location.href
        })
      } else {
        navigator.clipboard.writeText(window.location.href)
      }
    }

    // Lifecycle
    onMounted(() => {
      updateCountdown()
      timer.value = setInterval(updateCountdown, 60000)
      
      // Mock weather data
      if (props.booking.revealed) {
        weather.value = {
          icon: '☀️',
          temp: 22,
          description: 'Sunny'
        }
      }
    })

    onUnmounted(() => {
      if (timer.value) {
        clearInterval(timer.value)
      }
    })

    return {
      statusIcon,
      statusTitle,
      statusMessage,
      canCancel,
      countdown,
      daysUntilReveal,
      progressPercentage,
      weather,
      formatDate,
      formatDateTime,
      formatTime,
      downloadItinerary,
      printPage,
      shareBooking
    }
  }
}
</script>

<style scoped>
.booking-details {
  max-width: 1200px;
  margin: 0 auto;
}

/* Header */
.details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  background: none;
  border: none;
  color: #FF6B6B;
  font-size: 1rem;
  cursor: pointer;
  padding: 8px 15px;
  border-radius: 50px;
  transition: all 0.3s;
}

.back-btn:hover {
  background: rgba(255, 107, 107, 0.1);
}

.header-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: #f0f0f0;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.action-btn:hover {
  background: #FF6B6B;
  color: white;
  transform: translateY(-2px);
}

/* Status Banner */
.status-banner {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px 30px;
  border-radius: 10px;
  margin-bottom: 30px;
  color: white;
}

.status-banner.confirmed {
  background: #28A745;
}

.status-banner.pending {
  background: #FFC107;
  color: #333;
}

.status-banner.completed {
  background: #6C757D;
}

.status-banner.cancelled {
  background: #DC3545;
}

.status-icon {
  font-size: 2.5rem;
}

.status-content {
  flex: 1;
}

.status-title {
  font-size: 1.3rem;
  margin-bottom: 5px;
  color: inherit;
}

.status-message {
  opacity: 0.9;
  font-size: 0.95rem;
}

.cancel-btn {
  padding: 8px 20px;
  background: rgba(255,255,255,0.2);
  border: 1px solid white;
  color: white;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
}

.cancel-btn:hover {
  background: white;
  color: #DC3545;
}

/* Details Grid */
.details-grid {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 30px;
  margin-bottom: 30px;
}

/* Left Column */
.left-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Destination Card */
.destination-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  border: 1px solid #e0e0e0;
}

.destination-card.mystery {
  border: 2px solid #00D4FF;
}

.destination-image {
  height: 250px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.mystery-reveal {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
}

.mystery-icon {
  font-size: 4rem;
  margin-bottom: 15px;
  animation: pulse 2s infinite;
}

.reveal-countdown {
  font-size: 1rem;
  opacity: 0.9;
}

.destination-info {
  padding: 20px;
  text-align: center;
}

.destination-info h2 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 5px;
}

.destination-info p {
  color: #FF6B6B;
  font-weight: 500;
}

.destination-info .region {
  color: #00D4FF;
}

/* Countdown Card */
.countdown-card {
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  text-align: center;
}

.countdown-card h3 {
  color: #333;
  margin-bottom: 20px;
}

.countdown-timer {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 20px;
}

.countdown-item {
  text-align: center;
}

.countdown-value {
  display: block;
  font-size: 2.5rem;
  font-weight: 700;
  color: #FF6B6B;
  line-height: 1;
}

.countdown-label {
  color: #666;
  font-size: 0.9rem;
  text-transform: uppercase;
}

.progress-section {
  margin-top: 15px;
}

.progress-bar {
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #FF6B6B, #FFB5B5);
  transition: width 0.3s;
}

.progress-text {
  color: #666;
  font-size: 0.9rem;
}

/* Weather Card */
.weather-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  border-radius: 15px;
  color: white;
}

.weather-card h3 {
  color: white;
  margin-bottom: 15px;
}

.weather-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.weather-icon {
  font-size: 3rem;
}

.weather-info {
  flex: 1;
}

.weather-temp {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 5px;
}

.weather-desc {
  opacity: 0.9;
}

/* Right Column */
.right-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-section {
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
}

.info-section h3 {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #333;
  margin-bottom: 20px;
  font-size: 1.2rem;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
}

.section-icon {
  font-size: 1.3rem;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-row.total {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 2px dashed #e0e0e0;
}

.info-label {
  color: #666;
  font-weight: 500;
}

.info-value {
  color: #333;
  font-weight: 600;
}

.info-value.price {
  color: #28A745;
  font-size: 1.2rem;
}

.passenger-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #e0e0e0;
}

.passenger-item:last-child {
  border-bottom: none;
}

.passenger-name {
  font-weight: 600;
  color: #333;
}

.passenger-detail {
  color: #666;
  font-size: 0.9rem;
}

/* Action Buttons */
.action-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-top: 30px;
}

.btn-primary, .btn-secondary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 15px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1rem;
}

.btn-primary {
  background: #4A6FA5;
  color: white;
}

.btn-primary:hover {
  background: #3A5A84;
  transform: translateY(-2px);
}

.btn-secondary {
  background: white;
  border: 2px solid #FF6B6B;
  color: #FF6B6B;
}

.btn-secondary:hover {
  background: #FF6B6B;
  color: white;
  transform: translateY(-2px);
}

.btn-icon {
  font-size: 1.2rem;
}

/* Dark Mode */
:root.dark-mode .destination-card,
:root.dark-mode .countdown-card,
:root.dark-mode .info-section {
  background: #0B1E33;
  border-color: #1A334D;
}

:root.dark-mode .destination-info h2,
:root.dark-mode .countdown-card h3,
:root.dark-mode .info-section h3 {
  color: #F5F9FF;
}

:root.dark-mode .countdown-label,
:root.dark-mode .info-label {
  color: #B0C4DE;
}

:root.dark-mode .info-value {
  color: #F5F9FF;
}

:root.dark-mode .progress-text {
  color: #B0C4DE;
}

:root.dark-mode .action-btn {
  background: #122B44;
  color: #F5F9FF;
}

:root.dark-mode .action-btn:hover {
  background: #00D4FF;
  color: #0B1E33;
}

/* Responsive */
@media (max-width: 968px) {
  .details-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .status-banner {
    flex-direction: column;
    text-align: center;
  }
  
  .countdown-timer {
    gap: 15px;
  }
  
  .countdown-value {
    font-size: 2rem;
  }
  
  .action-buttons {
    grid-template-columns: 1fr;
  }
  
  .info-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
}

@media print {
  .back-btn,
  .header-actions,
  .status-action,
  .action-buttons {
    display: none !important;
  }
  
  .destination-card,
  .countdown-card,
  .info-section {
    break-inside: avoid;
    box-shadow: none;
    border: 1px solid #ccc;
  }
}
</style>