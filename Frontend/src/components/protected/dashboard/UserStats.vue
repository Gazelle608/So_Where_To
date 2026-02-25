<template>
  <div class="user-stats">
    <!-- Main Stats Grid -->
    <div class="stats-grid">
      <div v-for="stat in stats" :key="stat.label" class="stat-card">
        <div class="stat-icon" :style="{ background: stat.color + '20' }">
          <span :style="{ color: stat.color }">{{ stat.icon }}</span>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stat.value }}</span>
          <span class="stat-label">{{ stat.label }}</span>
        </div>
        <div v-if="stat.trend" class="stat-trend" :class="stat.trend.type">
          <span class="trend-icon">{{ stat.trend.type === 'up' ? '↑' : '↓' }}</span>
          <span class="trend-value">{{ stat.trend.value }}</span>
        </div>
      </div>
    </div>

    <!-- Detailed Stats -->
    <div class="detailed-stats">
      <!-- Booking Stats -->
      <div class="stat-section">
        <h4 class="section-title">Booking Statistics</h4>
        <div class="stat-bars">
          <div class="stat-bar-item">
            <div class="bar-label">
              <span>Completed Trips</span>
              <span class="bar-value">{{ bookingStats.completed }}</span>
            </div>
            <div class="progress-bar">
              <div 
                class="progress-fill" 
                :style="{ width: (bookingStats.completed / bookingStats.total * 100) + '%' }"
                style="background: #28A745"
              ></div>
            </div>
          </div>
          
          <div class="stat-bar-item">
            <div class="bar-label">
              <span>Upcoming Trips</span>
              <span class="bar-value">{{ bookingStats.upcoming }}</span>
            </div>
            <div class="progress-bar">
              <div 
                class="progress-fill" 
                :style="{ width: (bookingStats.upcoming / bookingStats.total * 100) + '%' }"
                style="background: #FFC107"
              ></div>
            </div>
          </div>
          
          <div class="stat-bar-item">
            <div class="bar-label">
              <span>Cancelled</span>
              <span class="bar-value">{{ bookingStats.cancelled }}</span>
            </div>
            <div class="progress-bar">
              <div 
                class="progress-fill" 
                :style="{ width: (bookingStats.cancelled / bookingStats.total * 100) + '%' }"
                style="background: #DC3545"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Spending Stats -->
      <div class="stat-section">
        <h4 class="section-title">Spending Overview</h4>
        <div class="spending-stats">
          <div class="spending-item">
            <span class="spending-label">Total Spent</span>
            <span class="spending-value">R{{ formatNumber(spendingStats.total) }}</span>
          </div>
          <div class="spending-item">
            <span class="spending-label">Average per Trip</span>
            <span class="spending-value">R{{ formatNumber(spendingStats.average) }}</span>
          </div>
          <div class="spending-item">
            <span class="spending-label">Money Saved</span>
            <span class="spending-value saved">R{{ formatNumber(spendingStats.saved) }}</span>
          </div>
        </div>
      </div>

      <!-- Destination Stats -->
      <div class="stat-section">
        <h4 class="section-title">Top Destinations</h4>
        <div class="destination-list">
          <div v-for="dest in topDestinations" :key="dest.name" class="destination-item">
            <span class="destination-name">{{ dest.name }}</span>
            <span class="destination-count">{{ dest.count }} trips</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Refresh Button -->
    <button v-if="refreshing" class="refresh-btn" :class="{ loading: isLoading }" @click="$emit('refresh')">
      <span class="refresh-icon">↻</span>
      <span>Refresh Stats</span>
    </button>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'UserStats',
  props: {
    stats: {
      type: Array,
      required: true
    },
    bookings: {
      type: Array,
      default: () => []
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    refreshing: {
      type: Boolean,
      default: true
    }
  },
  emits: ['refresh'],
  setup(props) {
    // Calculate booking stats
    const bookingStats = computed(() => {
      const total = props.bookings.length
      const completed = props.bookings.filter(b => b.status === 'completed').length
      const upcoming = props.bookings.filter(b => 
        b.status === 'confirmed' && new Date(b.departure) > new Date()
      ).length
      const cancelled = props.bookings.filter(b => b.status === 'cancelled').length

      return { total, completed, upcoming, cancelled }
    })

    // Calculate spending stats
    const spendingStats = computed(() => {
      const completed = props.bookings.filter(b => b.status === 'completed')
      const total = completed.reduce((sum, b) => sum + (b.totalPrice || 0), 0)
      const average = completed.length ? total / completed.length : 0
      const saved = completed.reduce((sum, b) => {
        return sum + ((b.originalPrice || b.totalPrice) - b.totalPrice)
      }, 0)

      return { total, average, saved }
    })

    // Get top destinations
    const topDestinations = computed(() => {
      const destCount = {}
      props.bookings.forEach(b => {
        if (b.destination) {
          destCount[b.destination] = (destCount[b.destination] || 0) + 1
        }
      })

      return Object.entries(destCount)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
    })

    const formatNumber = (num) => {
      return Math.round(num).toLocaleString()
    }

    return {
      bookingStats,
      spendingStats,
      topDestinations,
      formatNumber
    }
  }
}
</script>

<style scoped>
.user-stats {
  width: 100%;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  gap: 15px;
  position: relative;
  border: 1px solid #e0e0e0;
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  border-color: #FF6B6B;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-info {
  flex: 1;
}

.stat-value {
  display: block;
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
  line-height: 1.2;
}

.stat-label {
  color: #666;
  font-size: 0.85rem;
}

.stat-trend {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 0.8rem;
  padding: 3px 8px;
  border-radius: 50px;
}

.stat-trend.up {
  background: rgba(40, 167, 69, 0.1);
  color: #28A745;
}

.stat-trend.down {
  background: rgba(220, 53, 69, 0.1);
  color: #DC3545;
}

/* Detailed Stats */
.detailed-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.stat-section {
  background: white;
  padding: 20px;
  border-radius: 15px;
  border: 1px solid #e0e0e0;
}

.section-title {
  font-size: 1rem;
  color: #333;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
}

/* Stat Bars */
.stat-bars {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.stat-bar-item {
  width: 100%;
}

.bar-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 0.85rem;
  color: #666;
}

.bar-value {
  font-weight: 600;
  color: #333;
}

.progress-bar {
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  transition: width 0.3s;
}

/* Spending Stats */
.spending-stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.spending-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.spending-label {
  color: #666;
  font-size: 0.9rem;
}

.spending-value {
  font-weight: 600;
  color: #333;
}

.spending-value.saved {
  color: #28A745;
}

/* Destination List */
.destination-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.destination-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px dashed #e0e0e0;
}

.destination-item:last-child {
  border-bottom: none;
}

.destination-name {
  color: #333;
  font-weight: 500;
}

.destination-count {
  color: #666;
  font-size: 0.85rem;
  background: #f0f0f0;
  padding: 2px 8px;
  border-radius: 50px;
}

/* Refresh Button */
.refresh-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px;
  background: none;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  color: #666;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s;
}

.refresh-btn:hover {
  border-color: #FF6B6B;
  color: #FF6B6B;
}

.refresh-btn.loading {
  opacity: 0.7;
  cursor: not-allowed;
}

.refresh-icon {
  font-size: 1.2rem;
  transition: transform 0.5s;
}

.refresh-btn:hover .refresh-icon {
  transform: rotate(180deg);
}

.refresh-btn.loading .refresh-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Dark Mode */
:root.dark-mode .stat-card,
:root.dark-mode .stat-section {
  background: #0B1E33;
  border-color: #1A334D;
}

:root.dark-mode .stat-value {
  color: #F5F9FF;
}

:root.dark-mode .stat-label {
  color: #B0C4DE;
}

:root.dark-mode .section-title {
  color: #F5F9FF;
  border-bottom-color: #1A334D;
}

:root.dark-mode .bar-label {
  color: #B0C4DE;
}

:root.dark-mode .bar-value {
  color: #F5F9FF;
}

:root.dark-mode .spending-label {
  color: #B0C4DE;
}

:root.dark-mode .spending-value {
  color: #F5F9FF;
}

:root.dark-mode .destination-name {
  color: #F5F9FF;
}

:root.dark-mode .destination-count {
  background: #122B44;
  color: #B0C4DE;
}

:root.dark-mode .refresh-btn {
  border-color: #1A334D;
  color: #B0C4DE;
}

:root.dark-mode .refresh-btn:hover {
  border-color: #00D4FF;
  color: #00D4FF;
}

/* Responsive */
@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .detailed-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .detailed-stats {
    grid-template-columns: 1fr;
  }
  
  .stat-card {
    padding: 15px;
  }
  
  .stat-value {
    font-size: 1.5rem;
  }
  
  .stat-icon {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
}
</style>