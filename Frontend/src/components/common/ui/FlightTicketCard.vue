<template>
  <article class="ticket-card">
    <div class="ticket-image" :style="{ backgroundImage: `url(${imageUrl})` }">
      <span class="pill" :class="destination.revealed ? 'revealed' : 'mystery'">
        {{ destination.revealed ? 'Revealed' : 'Mystery' }}
      </span>
    </div>
    <div class="ticket-body">
      <h3 class="ticket-title">{{ destination.city || destination.name }}</h3>
      <p class="ticket-subtitle">
        {{ destination.country }}{{ destination.region ? ` - ${destination.region}` : '' }}
      </p>
      <div class="ticket-meta">
        <span>{{ destination.days || '-' }} days</span>
        <span v-if="destination.rating">Rating {{ destination.rating }}</span>
      </div>
      <div v-if="destination.tags && destination.tags.length" class="ticket-tags">
        <span v-for="tag in destination.tags.slice(0, 4)" :key="tag" class="tag-chip">{{ tag }}</span>
      </div>
      <div class="ticket-price">R{{ Number(destination.price || 0).toLocaleString() }}</div>
      <button class="btn btn-primary ticket-action" @click="$emit('book', destination)">
        Book Now
      </button>
    </div>
  </article>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'FlightTicketCard',
  emits: ['book'],
  props: {
    destination: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const imageUrl = computed(() => props.destination.image || props.destination.image_url || '/images/plane.jpg')
    return { imageUrl }
  }
}
</script>

<style scoped>
.ticket-card {
  border-radius: 16px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease;
}

.ticket-card:hover {
  transform: translateY(-4px);
}

.ticket-image {
  height: 180px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.pill {
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 6px 10px;
  border-radius: 999px;
  color: #fff;
}

.pill.revealed {
  background: #28a745;
}

.pill.mystery {
  background: #4a6fa5;
}

.ticket-body {
  padding: 16px;
}

.ticket-title {
  margin: 0 0 6px;
  color: #222;
}

.ticket-subtitle {
  margin: 0 0 10px;
  color: #666;
  font-size: 0.95rem;
}

.ticket-meta {
  display: flex;
  gap: 12px;
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 12px;
}

.ticket-price {
  color: #ff6b6b;
  font-weight: 800;
  font-size: 1.2rem;
}

.ticket-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.tag-chip {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 0.75rem;
  background: #f0f4fa;
  color: #3b5b88;
  font-weight: 600;
}

.ticket-action {
  margin-top: 12px;
  width: 100%;
}

.ticket-action:hover {
  transform: translateY(-2px);
}
</style>
