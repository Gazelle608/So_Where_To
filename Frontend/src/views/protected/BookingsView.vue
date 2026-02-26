<template>
  <div class="bookings-view">
    <h1 class="page-title">My <span>Bookings</span></h1>

    <div v-if="bookings.length === 0" class="no-bookings">
      <svg class="empty-icon" viewBox="0 0 24 24" width="64" height="64">
        <path fill="currentColor" d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
      </svg>
      <h2>No bookings yet</h2>
      <p>Ready to book your first adventure?</p>
      <router-link to="/destinations" class="btn btn-primary">
        Browse Destinations
      </router-link>
    </div>

    <div v-else class="bookings-list">
      <div v-for="booking in bookings" :key="booking.id" class="booking-card">
        <div class="booking-header">
          <span class="booking-number">Booking #{{ booking.id }}</span>
          <span class="booking-status" :class="booking.status || 'confirmed'">
            {{ booking.status || 'Confirmed' }}
          </span>
        </div>
        
        <div class="booking-route">
          <div class="from">
            <span class="code">JNB</span>
            <span class="city">Johannesburg</span>
          </div>
          <div class="arrow">✈️</div>
          <div class="to">
            <span class="code">{{ booking.code || '???' }}</span>
            <span class="city">{{ booking.city || 'Mystery' }}</span>
          </div>
        </div>

        <div class="booking-details">
          <div class="detail">
            <span class="label">Flight</span>
            <span class="value">{{ booking.flight || 'SWT123' }}</span>
          </div>
          <div class="detail">
            <span class="label">Date</span>
            <span class="value">{{ booking.date || '15 MAR 2026' }}</span>
          </div>
          <div class="detail">
            <span class="label">Seat</span>
            <span class="value seat">{{ booking.seat || 'TBD' }}</span>
          </div>
          <div class="detail">
            <span class="label">Price</span>
            <span class="value price">R{{ booking.price }}</span>
          </div>
        </div>

        <div class="booking-actions">
          <button @click="viewBooking(booking.id)" class="btn-view">
            View Details
          </button>
          <button @click="cancelBooking(booking.id)" class="btn-cancel">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { apiService, apiHelpers } from '@/services/api'
import { useStore } from 'vuex'

export default {
  name: 'BookingsView',
  setup() {
    const router = useRouter()
    const store = useStore()
    const bookings = ref([])

    const mapBooking = (row) => ({
      id: row.id || row.booking_id,
      status: row.status || 'pending',
      code: row.destination_name ? row.destination_name.slice(0, 3).toUpperCase() : '???',
      city: row.destination_name || 'Mystery',
      flight: `SWT${row.id || row.booking_id}`,
      date: row.departure_date
        ? new Date(row.departure_date).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' })
        : 'TBD',
      seat: 'TBD',
      price: Number(row.total_amount || row.price || 0),
      destination_name: row.destination_name,
      destination_id: row.destination_id
    })

    const loadBookings = async () => {
      try {
        const response = await apiService.bookings.getAll()
        bookings.value = (Array.isArray(response.data) ? response.data : []).map(mapBooking)
      } catch (error) {
        store.commit('SHOW_NOTIFICATION', {
          message: apiHelpers.getErrorMessage(error),
          type: 'error'
        })
      }
    }

    onMounted(() => {
      loadBookings()
    })

    const viewBooking = (id) => {
      router.push(`/booking/${id}`)
    }

    const cancelBooking = async (id) => {
      if (confirm('Are you sure you want to cancel this booking?')) {
        try {
          await apiService.bookings.cancel(id)
          await loadBookings()
          store.commit('SHOW_NOTIFICATION', {
            message: `Booking #${id} deleted`,
            type: 'success'
          })
        } catch (error) {
          store.commit('SHOW_NOTIFICATION', {
            message: apiHelpers.getErrorMessage(error),
            type: 'error'
          })
        }
      }
    }

    return {
      bookings,
      viewBooking,
      cancelBooking
    }
  }
}
</script>

<style scoped>
.bookings-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.page-title {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 40px;
  text-align: center;
}

.page-title span {
  color: #FF6B6B;
  position: relative;
}

.page-title span::after {
  content: '';
  position: absolute;
  bottom: 5px;
  left: 0;
  width: 100%;
  height: 8px;
  background: rgba(255, 107, 107, 0.2);
  z-index: -1;
}

/* No Bookings */
.no-bookings {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
}

.empty-icon {
  color: #FF6B6B;
  margin-bottom: 20px;
}

.no-bookings h2 {
  color: #333;
  margin-bottom: 10px;
}

.no-bookings p {
  color: #666;
  margin-bottom: 30px;
}

/* Bookings List */
.bookings-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.booking-card {
  background: white;
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
}

.booking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px dashed #e0e0e0;
}

.booking-number {
  font-family: monospace;
  font-weight: 600;
  color: #666;
}

.booking-status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.booking-status.confirmed {
  background: #28A745;
  color: white;
}

/* Booking Route */
.booking-route {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.from, .to {
  text-align: center;
}

.from .code, .to .code {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
}

.from .city, .to .city {
  color: #666;
  font-size: 0.9rem;
}

.arrow {
  font-size: 1.5rem;
  color: #FF6B6B;
}

/* Booking Details */
.booking-details {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-bottom: 20px;
  padding: 15px 0;
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
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
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

.value.seat {
  color: #4A6FA5;
}

.value.price {
  color: #28A745;
}

/* Booking Actions */
.booking-actions {
  display: flex;
  gap: 15px;
}

.btn-view, .btn-cancel {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-view {
  background: #4A6FA5;
  color: white;
}

.btn-view:hover {
  background: #3A5A84;
}

.btn-cancel {
  background: #DC3545;
  color: white;
}

.btn-cancel:hover {
  background: #c82333;
}

.btn-primary {
  display: inline-block;
  padding: 12px 30px;
  background: #FF6B6B;
  color: white;
  text-decoration: none;
  border-radius: 30px;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-primary:hover {
  background: #FF5252;
  transform: translateY(-2px);
}

/* Dark Mode */
:root.dark-mode .page-title {
  color: #F5F9FF;
}

:root.dark-mode .no-bookings {
  background: #0B1E33;
  border: 1px solid #1A334D;
}

:root.dark-mode .no-bookings h2 {
  color: #F5F9FF;
}

:root.dark-mode .no-bookings p {
  color: #B0C4DE;
}

:root.dark-mode .booking-card {
  background: #0B1E33;
  border: 1px solid #1A334D;
}

:root.dark-mode .booking-number {
  color: #B0C4DE;
}

:root.dark-mode .booking-header {
  border-bottom-color: #1A334D;
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

:root.dark-mode .booking-details {
  border-color: #1A334D;
}

/* Responsive */
@media (max-width: 768px) {
  .booking-details {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .booking-actions {
    flex-direction: column;
  }
}
</style>
