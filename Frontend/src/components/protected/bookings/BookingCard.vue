<template>
  <div class="booking-card" :class="{ 'mystery': !booking.revealed }">
    <!-- Status Badge -->
    <div class="status-badge" :class="booking.status">
      <span class="status-icon">{{ statusIcon }}</span>
      <span class="status-text">{{ booking.status.toUpperCase() }}</span>
    </div>

    <!-- Card Image -->
    <div class="card-image" :style="{ backgroundImage: `url(${booking.image})` }">
      <div v-if="!booking.revealed" class="mystery-overlay">
        <span class="mystery-icon">❓</span>
        <span class="mystery-text">Mystery Destination</span>
      </div>
      
      <!-- Countdown Badge (for upcoming) -->
      <div v-if="isUpcoming && booking.daysUntil !== undefined" class="countdown-badge">
        <span class="countdown-icon">⏰</span>
        <span>{{ booking.daysUntil }} days</span>
      </div>
    </div>

    <!-- Card Content -->
    <div class="card-content">
      <div class="card-header">
        <h3 class="card-title">
          {{ booking.revealed ? booking.destination : 'Mystery Adventure' }}
        </h3>
        <p v-if="booking.revealed" class="card-location">
          {{ booking.country }}, {{ booking.region }}
        </p>
        <p v-else class="card-location mystery-location">
          {{ booking.region }} Region
        </p>
      </div>

      <!-- Date Range -->
      <div class="date-range">
        <div class="date-item">
          <span class="date-icon">✈️</span>
          <div class="date-info">
            <span class="date-label">Depart</span>
            <span class="date-value">{{ formatDate(booking.departure) }}</span>
          </div>
        </div>
        <div class="date-arrow">→</div>
        <div class="date-item">
          <span class="date-icon">🏠</span>
          <div class="date-info">
            <span class="date-label">Return</span>
            <span class="date-value">{{ formatDate(booking.return) }}</span>
          </div>
        </div>
      </div>

      <!-- Booking Details Grid -->
      <div class="details-grid">
        <div class="detail-item">
          <span class="detail-icon">🔢</span>
          <div class="detail-info">
            <span class="detail-label">Booking #</span>
            <span class="detail-value">{{ booking.bookingNumber }}</span>
          </div>
        </div>
        <div class="detail-item">
          <span class="detail-icon">💰</span>
          <div class="detail-info">
            <span class="detail-label">Total</span>
            <span class="detail-value price">R{{ booking.totalPrice.toLocaleString() }}</span>
          </div>
        </div>
        <div class="detail-item">
          <span class="detail-icon">✈️</span>
          <div class="detail-info">
            <span class="detail-label">Airline</span>
            <span class="detail-value">{{ booking.airline || 'TBA' }}</span>
          </div>
        </div>
        <div class="detail-item">
          <span class="detail-icon">🏨</span>
          <div class="detail-info">
            <span class="detail-label">Accommodation</span>
            <span class="detail-value">{{ booking.accommodation || 'TBA' }}</span>
          </div>
        </div>
      </div>

      <!-- Tags -->
      <div v-if="booking.tags" class="tags">
        <span v-for="tag in booking.tags" :key="tag" class="tag">
          {{ tag }}
        </span>
      </div>

      <!-- Progress Bar (for upcoming) -->
      <div v-if="isUpcoming && booking.progress !== undefined" class="progress-section">
        <div class="progress-header">
          <span class="progress-label">Progress to departure</span>
          <span class="progress-value">{{ booking.progress }}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: booking.progress + '%' }"></div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="card-actions">
        <button @click="$emit('view', booking.id)" class="btn-view">
          <span class="btn-icon">👁️</span>
          View Details
        </button>
        
        <button v-if="canCancel" @click="$emit('cancel', booking.id)" class="btn-cancel">
          <span class="btn-icon">❌</span>
          Cancel
        </button>
        
        <button v-if="booking.status === 'cancelled'" @click="$emit('rebook', booking.id)" class="btn-rebook">
          <span class="btn-icon">🔄</span>
          Rebook
        </button>
        
        <button v-if="booking.status === 'completed'" @click="$emit('review', booking.id)" class="btn-review">
          <span class="btn-icon">⭐</span>
          Review
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'BookingCard',
  props: {
    booking: {
      type: Object,
      required: true
    }
  },
  emits: ['view', 'cancel', 'rebook', 'review'],
  setup(props) {
    const statusIcon = computed(() => {
      const icons = {
        confirmed: '✅',
        pending: '⏳',
        completed: '🎉',
        cancelled: '❌'
      }
      return icons[props.booking.status] || '📅'
    })

    const isUpcoming = computed(() => {
      return props.booking.status === 'confirmed' || props.booking.status === 'pending'
    })

    const canCancel = computed(() => {
      return props.booking.status === 'confirmed' && 
             new Date(props.booking.departure) > new Date()
    })

    const formatDate = (dateString) => {
      if (!dateString) return 'TBD'
      return new Date(dateString).toLocaleDateString('en-ZA', {
        day: 'numeric',
        month: 'short'
      })
    }

    return {
      statusIcon,
      isUpcoming,
      canCancel,
      formatDate
    }
  }
}
</script>

<style scoped>
.booking-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  border: 1px solid #e0e0e0;
  transition: all 0.3s;
  position: relative;
}

.booking-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(255, 107, 107, 0.15);
  border-color: #FF6B6B;
}

.booking-card.mystery {
  border: 2px solid #00D4FF;
}

/* Status Badge */
.status-badge {
  position: absolute;
  top: 15px;
  left: 15px;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.status-badge.confirmed {
  background: #28A745;
  color: white;
}

.status-badge.pending {
  background: #FFC107;
  color: #333;
}

.status-badge.completed {
  background: #6C757D;
  color: white;
}

.status-badge.cancelled {
  background: #DC3545;
  color: white;
}

/* Card Image */
.card-image {
  height: 180px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.mystery-overlay {
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
  backdrop-filter: blur(2px);
}

.mystery-icon {
  font-size: 2.5rem;
  margin-bottom: 8px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.mystery-text {
  font-size: 0.9rem;
  font-weight: 500;
}

.countdown-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(0,0,0,0.7);
  color: white;
  padding: 6px 12px;
  border-radius: 50px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 5px;
  backdrop-filter: blur(4px);
  border: 1px solid #FF6B6B;
}

.countdown-icon {
  font-size: 0.9rem;
}

/* Card Content */
.card-content {
  padding: 20px;
}

.card-header {
  margin-bottom: 15px;
}

.card-title {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 5px;
  font-weight: 600;
}

.card-location {
  color: #FF6B6B;
  font-size: 0.9rem;
  font-weight: 500;
}

.card-location.mystery-location {
  color: #00D4FF;
}

/* Date Range */
.date-range {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 10px;
}

.date-item {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.date-icon {
  font-size: 1.1rem;
}

.date-info {
  display: flex;
  flex-direction: column;
}

.date-label {
  font-size: 0.7rem;
  color: #999;
  text-transform: uppercase;
}

.date-value {
  font-size: 0.9rem;
  color: #333;
  font-weight: 500;
}

.date-arrow {
  color: #FF6B6B;
  font-weight: bold;
  font-size: 1.2rem;
}

/* Details Grid */
.details-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 15px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.detail-icon {
  font-size: 1rem;
  min-width: 20px;
}

.detail-info {
  display: flex;
  flex-direction: column;
}

.detail-label {
  font-size: 0.7rem;
  color: #999;
  text-transform: uppercase;
}

.detail-value {
  font-size: 0.85rem;
  color: #333;
  font-weight: 500;
}

.detail-value.price {
  color: #28A745;
  font-weight: 700;
}

/* Tags */
.tags {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  margin-bottom: 15px;
}

.tag {
  background: #f0f0f0;
  padding: 4px 10px;
  border-radius: 50px;
  font-size: 0.7rem;
  color: #666;
}

/* Progress Section */
.progress-section {
  margin-bottom: 15px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 0.8rem;
}

.progress-label {
  color: #666;
}

.progress-value {
  color: #FF6B6B;
  font-weight: 600;
}

.progress-bar {
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #FF6B6B, #FFB5B5);
  border-radius: 3px;
  transition: width 0.3s;
}

/* Card Actions */
.card-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-top: 5px;
}

.btn-view, .btn-cancel, .btn-rebook, .btn-review {
  padding: 10px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-size: 0.85rem;
}

.btn-view {
  background: #4A6FA5;
  color: white;
}

.btn-view:hover {
  background: #3A5A84;
  transform: translateY(-2px);
}

.btn-cancel {
  background: #DC3545;
  color: white;
}

.btn-cancel:hover {
  background: #c82333;
  transform: translateY(-2px);
}

.btn-rebook {
  background: #28A745;
  color: white;
}

.btn-rebook:hover {
  background: #218838;
  transform: translateY(-2px);
}

.btn-review {
  background: #FFC107;
  color: #333;
}

.btn-review:hover {
  background: #e0a800;
  transform: translateY(-2px);
}

.btn-icon {
  font-size: 1rem;
}

/* Dark Mode */
:root.dark-mode .booking-card {
  background: #0B1E33;
  border-color: #1A334D;
}

:root.dark-mode .booking-card:hover {
  border-color: #00D4FF;
  box-shadow: 0 15px 30px rgba(0, 212, 255, 0.15);
}

:root.dark-mode .card-title {
  color: #F5F9FF;
}

:root.dark-mode .date-range {
  background: #122B44;
}

:root.dark-mode .date-value {
  color: #F5F9FF;
}

:root.dark-mode .detail-label {
  color: #B0C4DE;
}

:root.dark-mode .detail-value {
  color: #F5F9FF;
}

:root.dark-mode .tag {
  background: #122B44;
  color: #B0C4DE;
  border: 1px solid #1A334D;
}

:root.dark-mode .progress-label {
  color: #B0C4DE;
}

/* Responsive */
@media (max-width: 768px) {
  .details-grid {
    grid-template-columns: 1fr;
  }
  
  .card-actions {
    grid-template-columns: 1fr;
  }
  
  .date-range {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .date-arrow {
    transform: rotate(90deg);
    align-self: center;
  }
}
</style>