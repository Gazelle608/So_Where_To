<template>
  <div class="dashboard-stats">
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon-wrapper upcoming">
          <svg class="stat-icon" viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.upcoming }}</span>
          <span class="stat-label">Upcoming Trips</span>
        </div>
        <div class="stat-trend" v-if="stats.trend">
          <span :class="stats.trend.type">{{ stats.trend.value }}%</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-wrapper completed">
          <svg class="stat-icon" viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.completed }}</span>
          <span class="stat-label">Completed</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-wrapper wishlist">
          <svg class="stat-icon" viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.wishlist }}</span>
          <span class="stat-label">Wishlist</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-wrapper savings">
          <svg class="stat-icon" viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M11.5 1L8 7h7l-3.5-6zm0 22L8 17h7l-3.5 6zM16 8.5L10 12l6 3.5v-7zM8 8.5v7L14 12 8 8.5z"/>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-value">R{{ stats.savings.toLocaleString() }}</span>
          <span class="stat-label">Total Savings</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardStats',
  props: {
    stats: {
      type: Object,
      required: true,
      default: () => ({
        upcoming: 0,
        completed: 0,
        wishlist: 0,
        savings: 0,
        trend: null
      })
    }
  }
}
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #e0e0e0;
  transition: all 0.3s;
  position: relative;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(255, 107, 107, 0.1);
  border-color: #FF6B6B;
}

.stat-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon-wrapper.upcoming {
  background: rgba(255, 107, 107, 0.1);
  color: #FF6B6B;
}

.stat-icon-wrapper.completed {
  background: rgba(40, 167, 69, 0.1);
  color: #28A745;
}

.stat-icon-wrapper.wishlist {
  background: rgba(220, 53, 69, 0.1);
  color: #DC3545;
}

.stat-icon-wrapper.savings {
  background: rgba(0, 212, 255, 0.1);
  color: #00D4FF;
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
  top: 12px;
  right: 12px;
  font-size: 0.8rem;
  padding: 2px 8px;
  border-radius: 50px;
}

.stat-trend .up {
  color: #28A745;
  background: rgba(40, 167, 69, 0.1);
}

.stat-trend .down {
  color: #DC3545;
  background: rgba(220, 53, 69, 0.1);
}

/* Dark Mode */
:root.dark-mode .stat-card {
  background: #122B44;
  border-color: #1A334D;
}

:root.dark-mode .stat-card:hover {
  border-color: #00D4FF;
}

:root.dark-mode .stat-value {
  color: #F5F9FF;
}

:root.dark-mode .stat-label {
  color: #B0C4DE;
}

/* Responsive */
@media (max-width: 968px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>