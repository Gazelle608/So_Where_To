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

    <!-- Destinations Grid -->
    <div class="destinations-grid">
      <FlightTicketCard 
        v-for="dest in filteredDestinations" 
        :key="dest.id"
        :destination="dest"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import FlightTicketCard from '@/components/common/ui/FlightTicketCard.vue'

export default {
  name: 'DestinationsView',
  components: {
    FlightTicketCard
  },
  setup() {
    const activeFilter = ref('all')

    // All destinations with new prices
    const destinations = ref([
      // Revealed Destinations (R350 - R600)
      {
        id: 1,
        city: 'Cape Town',
        code: 'CPT',
        price: 450,
        date: '15 MAR 2026',
        gate: 'A12',
        seat: '23A',
        flight: 'SWT101',
        airline: 'SWT',
        revealed: true,
        type: 'revealed',
        image: '/images/cape-town.jpg'
      },
      {
        id: 2,
        city: 'Durban',
        code: 'DUR',
        price: 380,
        date: '20 MAR 2026',
        gate: 'B4',
        seat: '15C',
        flight: 'SWT102',
        airline: 'SWT',
        revealed: true,
        type: 'revealed',
        image: '/images/durban.jpg'
      },
      {
        id: 3,
        city: 'Johannesburg',
        code: 'JNB',
        price: 420,
        date: '25 MAR 2026',
        gate: 'C7',
        seat: '8F',
        flight: 'SWT103',
        airline: 'SWT',
        revealed: true,
        type: 'revealed',
        image: '/images/joburg.jpg'
      },
      {
        id: 4,
        city: 'Port Elizabeth',
        code: 'PLZ',
        price: 390,
        date: '28 MAR 2026',
        gate: 'A3',
        seat: '12D',
        flight: 'SWT104',
        airline: 'SWT',
        revealed: true,
        type: 'revealed',
        image: '/images/pe.jpg'
      },
      {
        id: 5,
        city: 'Bloemfontein',
        code: 'BFN',
        price: 350,
        date: '2 APR 2026',
        gate: 'B9',
        seat: '19B',
        flight: 'SWT105',
        airline: 'SWT',
        revealed: true,
        type: 'revealed',
        image: '/images/bloem.jpg'
      },
      
      // Mystery Destinations (R700 - R900)
      {
        id: 6,
        code: '???',
        price: 750,
        date: '5 APR 2026',
        gate: 'TBD',
        seat: 'TBD',
        flight: 'SWT201',
        revealed: false,
        type: 'mystery',
        region: 'Asia',
        image: '/images/mystery-asia.jpg'
      },
      {
        id: 7,
        code: '???',
        price: 820,
        date: '12 APR 2026',
        gate: 'TBD',
        seat: 'TBD',
        flight: 'SWT202',
        revealed: false,
        type: 'mystery',
        region: 'Europe',
        image: '/images/mystery-europe.jpg'
      },
      {
        id: 8,
        code: '???',
        price: 890,
        date: '19 APR 2026',
        gate: 'TBD',
        seat: 'TBD',
        flight: 'SWT203',
        revealed: false,
        type: 'mystery',
        region: 'Africa',
        image: '/images/mystery-africa.jpg'
      },
      {
        id: 9,
        code: '???',
        price: 780,
        date: '26 APR 2026',
        gate: 'TBD',
        seat: 'TBD',
        flight: 'SWT204',
        revealed: false,
        type: 'mystery',
        region: 'Americas',
        image: '/images/mystery-americas.jpg'
      },
      
      // Special Events (R850 - R950)
      {
        id: 10,
        city: 'Paris',
        code: 'CDG',
        price: 920,
        date: '14 FEB 2026',
        gate: 'D2',
        seat: '7A',
        flight: 'LOVE101',
        airline: 'SWT',
        revealed: true,
        type: 'events',
        event: 'Valentines Day Special',
        image: '/images/paris-valentine.jpg'
      },
      {
        id: 11,
        city: 'Venice',
        code: 'VCE',
        price: 890,
        date: '14 FEB 2026',
        gate: 'E5',
        seat: '12C',
        flight: 'LOVE102',
        airline: 'SWT',
        revealed: true,
        type: 'events',
        event: 'Valentines Day Special',
        image: '/images/venice.jpg'
      },
      {
        id: 12,
        code: '???',
        price: 850,
        date: '14 FEB 2026',
        gate: 'TBD',
        seat: 'TBD',
        flight: 'LOVE103',
        revealed: false,
        type: 'events',
        event: 'Mystery Valentines',
        region: 'Romantic Europe',
        image: '/images/mystery-romance.jpg'
      }
    ])

    const filteredDestinations = computed(() => {
      if (activeFilter.value === 'all') {
        return destinations.value
      }
      return destinations.value.filter(d => d.type === activeFilter.value)
    })

    return {
      activeFilter,
      filteredDestinations
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