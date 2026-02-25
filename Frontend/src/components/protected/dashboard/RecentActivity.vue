<template>
  <div class="recent-activity">
    <div class="activity-header">
      <h3 class="activity-title">Recent Activity</h3>
      <button v-if="activities.length > 0" @click="$emit('view-all')" class="view-all-btn">
        View All
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <LoadingSpinner size="small" message="Loading activity..." />
    </div>

    <!-- Empty State -->
    <div v-else-if="activities.length === 0" class="empty-state">
      <div class="empty-icon">📋</div>
      <p>No recent activity</p>
    </div>

    <!-- Activity Timeline -->
    <div v-else class="timeline">
      <div v-for="(activity, index) in activities" :key="index" class="timeline-item">
        <div class="timeline-icon" :class="activity.type">
          <span>{{ activity.icon }}</span>
        </div>
        
        <div class="timeline-content">
          <div class="activity-text">
            <strong>{{ activity.text }}</strong>
          </div>
          <div class="activity-time">{{ formatTime(activity.timestamp) }}</div>
        </div>

        <div v-if="activity.action" class="timeline-action">
          <button @click="handleAction(activity)" class="action-btn">
            {{ activity.action }}
          </button>
        </div>
      </div>
    </div>

    <!-- View All Link (Mobile) -->
    <div v-if="activities.length > 3" class="mobile-view-all">
      <button @click="$emit('view-all')" class="view-all-link">
        View All Activity →
      </button>
    </div>
  </div>
</template>

<script>
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

export default {
  name: 'RecentActivity',
  components: {
    LoadingSpinner
  },
  props: {
    activities: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['view-all', 'action'],
  setup(props, { emit }) {
    const formatTime = (timestamp) => {
      const date = new Date(timestamp)
      const now = new Date()
      const diffMs = now - date
      const diffMins = Math.floor(diffMs / (1000 * 60))
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

      if (diffMins < 1) return 'Just now'
      if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`
      if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`
      if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`
      
      return date.toLocaleDateString('en-ZA', {
        day: 'numeric',
        month: 'short'
      })
    }

    const handleAction = (activity) => {
      emit('action', activity)
    }

    return {
      formatTime,
      handleAction
    }
  }
}
</script>

<style scoped>
.recent-activity {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  border: 1px solid #e0e0e0;
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.activity-title {
  font-size: 1.2rem;
  color: #333;
  margin: 0;
}

.view-all-btn {
  background: none;
  border: none;
  color: #FF6B6B;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 50px;
  transition: all 0.3s;
}

.view-all-btn:hover {
  background: rgba(255, 107, 107, 0.1);
}

/* Loading State */
.loading-state {
  padding: 40px 20px;
  text-align: center;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.empty-icon {
  font-size: 2.5rem;
  margin-bottom: 10px;
  opacity: 0.5;
}

.empty-state p {
  font-size: 0.95rem;
}

/* Timeline */
.timeline {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.timeline-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 10px;
  border-radius: 10px;
  transition: background 0.3s;
}

.timeline-item:hover {
  background: #f8f9fa;
}

.timeline-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.timeline-icon.spin {
  background: #FF6B6B;
  color: white;
}

.timeline-icon.wishlist {
  background: #DC3545;
  color: white;
}

.timeline-icon.booking {
  background: #28A745;
  color: white;
}

.timeline-icon.trip {
  background: #4A6FA5;
  color: white;
}

.timeline-icon.review {
  background: #FFC107;
  color: #333;
}

.timeline-content {
  flex: 1;
}

.activity-text {
  color: #333;
  margin-bottom: 5px;
  font-size: 0.95rem;
}

.activity-time {
  color: #999;
  font-size: 0.8rem;
}

.timeline-action {
  flex-shrink: 0;
}

.action-btn {
  padding: 5px 15px;
  background: none;
  border: 1px solid #FF6B6B;
  color: #FF6B6B;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.8rem;
}

.action-btn:hover {
  background: #FF6B6B;
  color: white;
}

/* Mobile View All */
.mobile-view-all {
  display: none;
  text-align: center;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #e0e0e0;
}

.view-all-link {
  background: none;
  border: none;
  color: #FF6B6B;
  font-size: 0.95rem;
  cursor: pointer;
  padding: 8px 20px;
  border-radius: 50px;
  transition: all 0.3s;
  width: 100%;
}

.view-all-link:hover {
  background: rgba(255, 107, 107, 0.1);
}

/* Dark Mode */
:root.dark-mode .recent-activity {
  background: #0B1E33;
  border-color: #1A334D;
}

:root.dark-mode .activity-title {
  color: #F5F9FF;
}

:root.dark-mode .timeline-item:hover {
  background: #122B44;
}

:root.dark-mode .activity-text {
  color: #F5F9FF;
}

:root.dark-mode .activity-time {
  color: #B0C4DE;
}

:root.dark-mode .empty-state {
  color: #B0C4DE;
}

:root.dark-mode .mobile-view-all {
  border-top-color: #1A334D;
}

/* Responsive */
@media (max-width: 768px) {
  .timeline-item {
    flex-wrap: wrap;
  }
  
  .timeline-action {
    width: 100%;
    margin-left: 55px;
  }
  
  .action-btn {
    width: 100%;
  }
  
  .mobile-view-all {
    display: block;
  }
  
  .view-all-btn {
    display: none;
  }
}

@media (max-width: 480px) {
  .timeline-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .timeline-action {
    margin-left: 0;
  }
}
</style>