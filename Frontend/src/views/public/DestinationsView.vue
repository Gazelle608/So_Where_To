<template>
  <div class="destinations-view">
    <!-- Header -->
    <section class="destinations-header">
      <h1>Explore <span>Destinations</span></h1>
      <p>Discover your next adventure</p>
    </section>

    <!-- Filter Tabs -->
    <div class="filter-tabs">
      <button 
        class="filter-tab" 
        :class="{ active: activeFilter === 'all' }"
        @click="activeFilter = 'all'"
      >
        All
      </button>
      <button 
        class="filter-tab" 
        :class="{ active: activeFilter === 'revealed' }"
        @click="activeFilter = 'revealed'"
      >
        Revealed
      </button>
      <button 
        class="filter-tab" 
        :class="{ active: activeFilter === 'mystery' }"
        @click="activeFilter = 'mystery'"
      >
        Mystery
      </button>
      <button 
        class="filter-tab" 
        :class="{ active: activeFilter === 'events' }"
        @click="activeFilter = 'events'"
      >
        Special Events
      </button>
    </div>

    <div v-if="isLoading" class="loading">Loading destinations...</div>
    <div v-else-if="filteredDestinations.length === 0" class="loading">No destinations found.</div>

    <!-- Destinations Grid -->
    <div v-else class="destinations-grid">
      <FlightTicketCard 
        v-for="dest in filteredDestinations" 
        :key="dest.id"
        :destination="dest"
        @book="bookDestination"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import FlightTicketCard from '@/components/common/ui/FlightTicketCard.vue'

export default {
  name: 'DestinationsView',
  components: {
    FlightTicketCard
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const activeFilter = ref('all')

    const destinations = computed(() => store.getters.destinations || [])
    const isLoading = computed(() => store.getters.destinationsLoading)

    const filteredDestinations = computed(() => {
      if (!destinations.value.length) return []

      if (activeFilter.value === 'all') {
        return destinations.value
      }
      if (activeFilter.value === 'revealed') {
        return destinations.value.filter((d) => d.revealed)
      }
      if (activeFilter.value === 'mystery') {
        return destinations.value.filter((d) => !d.revealed)
      }
      if (activeFilter.value === 'events') {
        return destinations.value.filter((d) => d.is_featured)
      }
      return destinations.value
    })

    onMounted(async () => {
      await store.dispatch('fetchDestinations')
    })

    const bookDestination = async (destination) => {
      if (!store.getters['auth/isAuthenticated']) {
        router.push({ name: 'login', query: { redirect: '/destinations' } })
        return
      }

      try {
        const result = await store.dispatch('addToCart', {
          destination_id: destination.destination_id || destination.id,
          quantity: 1,
          unit_price: destination.price
        })

        if (!result?.success) {
          throw new Error(result?.error || 'Failed to add destination to cart')
        }

        store.commit('SHOW_NOTIFICATION', {
          message: `${destination.name || destination.city} added to your cart`,
          type: 'success'
        })

        router.push('/cart')
      } catch (error) {
        store.commit('SHOW_NOTIFICATION', {
          message: error?.message || 'Failed to add destination to cart',
          type: 'error'
        })
      }
    }

    return {
      activeFilter,
      isLoading,
      filteredDestinations,
      bookDestination
    }
  }
}
</script>

<style scoped>
.destinations-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.destinations-header {
  text-align: center;
  margin-bottom: 40px;
}

.destinations-header h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 10px;
}

.destinations-header h1 span {
  color: #FF6B6B;
  position: relative;
}

.destinations-header h1 span::after {
  content: '';
  position: absolute;
  bottom: 5px;
  left: 0;
  width: 100%;
  height: 8px;
  background: rgba(255, 107, 107, 0.2);
  z-index: -1;
}

.destinations-header p {
  color: #666;
  font-size: 1.1rem;
}

/* Filter Tabs */
.filter-tabs {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.filter-tab {
  padding: 10px 25px;
  background: #f0f0f0;
  border: none;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-tab:hover {
  background: #e0e0e0;
}

.filter-tab.active {
  background: #FF6B6B;
  color: white;
}

/* Destinations Grid */
.destinations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
}

.loading {
  text-align: center;
  color: #666;
  font-size: 1.1rem;
  margin-top: 20px;
}

/* Dark Mode */
:root.dark-mode .destinations-header h1 {
  color: #F5F9FF;
}

:root.dark-mode .destinations-header p {
  color: #B0C4DE;
}

:root.dark-mode .filter-tab {
  background: #122B44;
  color: #B0C4DE;
}

:root.dark-mode .filter-tab:hover {
  background: #1A334D;
}

:root.dark-mode .filter-tab.active {
  background: #00D4FF;
  color: #0B1E33;
}

/* Responsive */
@media (max-width: 768px) {
  .destinations-header h1 {
    font-size: 2rem;
  }
  
  .destinations-grid {
    grid-template-columns: 1fr;
  }
}
</style>
