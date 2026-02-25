<template>
  <div class="dashboard-activities">
    <div class="section-header">
      <h3 class="section-title">Recent Activity</h3>
      <router-link to="/activities" class="view-all">View All</router-link>
    </div>

    <div v-if="activities.length === 0" class="empty-state">
      <svg class="empty-icon" viewBox="0 0 24 24" width="48" height="48">
        <path fill="currentColor" d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 4c2.76 0 5 2.24 5 5s-2.24 5-5 5-5-2.24-5-5 2.24-5 5-5z"/>
      </svg>
      <p>No recent activity</p>
    </div>

    <div v-else class="activities-list">
      <div v-for="(activity, index) in activities" :key="index" class="activity-item">
        <div class="activity-icon" :class="activity.type">
          <svg v-if="activity.type === 'booking'" viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
          </svg>
          <svg v-else-if="activity.type === 'wishlist'" viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <svg v-else-if="activity.type === 'spin'" viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
          </svg>
        </div>
        <div class="activity-content">
          <p class="activity-text">{{ activity.text }}</p>
          <span class="activity-time">{{ activity.time }}</span>
        </div>
        <button v-if="activity.action" class="activity-action">{{ activity.action }}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardActivities',
  props: {
    activities: {
      type: Array,
      required: true,
      default: () => []
    }
  }
}
</script>

<style scoped>
.dashboard-activities {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #e0e0e0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 1.2rem;
  color: #333;
  margin: 0;
}

.view-all {
  color: #FF6B6B;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
}

.view-all:hover {
  text-decoration: underline;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.empty-icon {
  color: #e0e0e0;
  margin-bottom: 12px;
}

.activities-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.3s;
}

.activity-item:hover {
  background: #f8f9fa;
}

.activity-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-icon.booking {
  background: rgba(255, 107, 107, 0.1);
  color: #FF6B6B;
}

.activity-icon.wishlist {
  background: rgba(220, 53, 69, 0.1);
  color: #DC3545;
}

.activity-icon.spin {
  background: rgba(0, 212, 255, 0.1);
  color: #00D4FF;
}

.activity-content {
  flex: 1;
}

.activity-text {
  color: #333;
  font-size: 0.95rem;
  margin-bottom: 2px;
}

.activity-time {
  color: #999;
  font-size: 0.8rem;
}

.activity-action {
  padding: 4px 12px;
  background: none;
  border: 1px solid #FF6B6B;
  color: #FF6B6B;
  border-radius: 50px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s;
  flex-shrink: 0;
}

.activity-action:hover {
  background: #FF6B6B;
  color: white;
}

/* Dark Mode */
:root.dark-mode .dashboard-activities {
  background: #122B44;
  border-color: #1A334D;
}

:root.dark-mode .section-title {
  color: #F5F9FF;
}

:root.dark-mode .activity-item:hover {
  background: #0B1E33;
}

:root.dark-mode .activity-text {
  color: #F5F9FF;
}
</style>