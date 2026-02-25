<template>
  <div class="blacklist-manager">
    <div class="manager-header">
      <h3 class="manager-title">Blacklist Preferences</h3>
      <p class="manager-description">
        Select destinations you want to avoid. We'll never send you here.
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <LoadingSpinner size="small" message="Loading blacklist..." />
    </div>

    <div v-else>
      <!-- Current Blacklist -->
      <div v-if="blacklist.length > 0" class="current-blacklist">
        <h4 class="subsection-title">Currently Avoiding</h4>
        <div class="blacklist-tags">
          <transition-group name="tag" tag="div" class="tags-container">
            <div v-for="item in blacklist" :key="item" class="blacklist-tag">
              <span class="tag-name">{{ item }}</span>
              <button @click="removeFromBlacklist(item)" class="remove-tag" title="Remove">
                <span>✕</span>
              </button>
            </div>
          </transition-group>
        </div>
      </div>

      <!-- Add to Blacklist -->
      <div class="add-to-blacklist">
        <h4 class="subsection-title">Add to Blacklist</h4>
        
        <!-- Search -->
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search destinations..."
            @input="filterDestinations"
          >
        </div>

        <!-- Categories/Tabs -->
        <div class="region-tabs">
          <button 
            v-for="region in regions" 
            :key="region"
            class="region-tab"
            :class="{ active: selectedRegion === region }"
            @click="selectedRegion = region"
          >
            {{ region }}
          </button>
        </div>

        <!-- Destinations Grid -->
        <div class="destinations-grid">
          <div 
            v-for="dest in filteredDestinations" 
            :key="dest.city"
            class="destination-option"
            :class="{ 
              disabled: isBlacklisted(dest.city),
              selected: isSelected(dest.city)
            }"
            @click="toggleDestination(dest.city)"
          >
            <div class="destination-image" :style="{ backgroundImage: `url(${dest.image})` }">
              <div v-if="isBlacklisted(dest.city)" class="blacklist-overlay">
                <span class="overlay-icon">🚫</span>
              </div>
              <div v-else-if="isSelected(dest.city)" class="select-overlay">
                <span class="overlay-icon">✓</span>
              </div>
            </div>
            <div class="destination-info">
              <span class="destination-city">{{ dest.city }}</span>
              <span class="destination-country">{{ dest.country }}</span>
            </div>
          </div>
        </div>

        <!-- Selected Count -->
        <div v-if="selectedDestinations.length > 0" class="selected-count">
          <span>{{ selectedDestinations.length }} destination{{ selectedDestinations.length !== 1 ? 's' : '' }} selected</span>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <button 
            class="btn-add" 
            :disabled="selectedDestinations.length === 0 || adding"
            @click="addSelected"
          >
            <span v-if="adding" class="spinner-small"></span>
            <span v-else>Add Selected to Blacklist</span>
          </button>
          
          <button 
            v-if="blacklist.length > 0"
            class="btn-clear" 
            :disabled="clearing"
            @click="confirmClearAll"
          >
            <span v-if="clearing" class="spinner-small"></span>
            <span v-else>Clear All</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <transition name="fade">
      <div v-if="showConfirmModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-container">
          <h3 class="modal-title">Clear Blacklist</h3>
          <p class="modal-message">
            Are you sure you want to remove all destinations from your blacklist?
          </p>
          <div class="modal-actions">
            <button @click="clearAll" class="btn-confirm" :disabled="clearing">
              <span v-if="clearing" class="spinner-small"></span>
              <span v-else>Yes, Clear All</span>
            </button>
            <button @click="closeModal" class="btn-cancel">Cancel</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

export default {
  name: 'BlacklistManager',
  components: {
    LoadingSpinner
  },
  props: {
    blacklist: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update', 'add', 'remove', 'clear'],
  setup(props, { emit }) {
    // State
    const searchQuery = ref('')
    const selectedRegion = ref('All')
    const selectedDestinations = ref([])
    const adding = ref(false)
    const clearing = ref(false)
    const showConfirmModal = ref(false)

    // Available destinations
    const allDestinations = ref([
      { city: 'Tokyo', country: 'Japan', region: 'Asia', image: '/images/tokyo.jpg' },
      { city: 'Osaka', country: 'Japan', region: 'Asia', image: '/images/osaka.jpg' },
      { city: 'Seoul', country: 'South Korea', region: 'Asia', image: '/images/seoul.jpg' },
      { city: 'Beijing', country: 'China', region: 'Asia', image: '/images/beijing.jpg' },
      { city: 'Bangkok', country: 'Thailand', region: 'Asia', image: '/images/bangkok.jpg' },
      { city: 'Paris', country: 'France', region: 'Europe', image: '/images/paris.jpg' },
      { city: 'London', country: 'UK', region: 'Europe', image: '/images/london.jpg' },
      { city: 'Rome', country: 'Italy', region: 'Europe', image: '/images/rome.jpg' },
      { city: 'Barcelona', country: 'Spain', region: 'Europe', image: '/images/barcelona.jpg' },
      { city: 'Amsterdam', country: 'Netherlands', region: 'Europe', image: '/images/amsterdam.jpg' },
      { city: 'New York', country: 'USA', region: 'North America', image: '/images/nyc.jpg' },
      { city: 'Los Angeles', country: 'USA', region: 'North America', image: '/images/la.jpg' },
      { city: 'Chicago', country: 'USA', region: 'North America', image: '/images/chicago.jpg' },
      { city: 'Toronto', country: 'Canada', region: 'North America', image: '/images/toronto.jpg' },
      { city: 'Mexico City', country: 'Mexico', region: 'North America', image: '/images/mexico.jpg' },
      { city: 'Rio', country: 'Brazil', region: 'South America', image: '/images/rio.jpg' },
      { city: 'Buenos Aires', country: 'Argentina', region: 'South America', image: '/images/buenos-aires.jpg' },
      { city: 'Lima', country: 'Peru', region: 'South America', image: '/images/lima.jpg' },
      { city: 'Cape Town', country: 'South Africa', region: 'Africa', image: '/images/cape-town.jpg' },
      { city: 'Marrakech', country: 'Morocco', region: 'Africa', image: '/images/marrakech.jpg' },
      { city: 'Cairo', country: 'Egypt', region: 'Africa', image: '/images/cairo.jpg' },
      { city: 'Sydney', country: 'Australia', region: 'Oceania', image: '/images/sydney.jpg' },
      { city: 'Melbourne', country: 'Australia', region: 'Oceania', image: '/images/melbourne.jpg' },
      { city: 'Auckland', country: 'New Zealand', region: 'Oceania', image: '/images/auckland.jpg' },
      { city: 'Dubai', country: 'UAE', region: 'Middle East', image: '/images/dubai.jpg' },
      { city: 'Tel Aviv', country: 'Israel', region: 'Middle East', image: '/images/tel-aviv.jpg' },
      { city: 'Istanbul', country: 'Turkey', region: 'Middle East', image: '/images/istanbul.jpg' }
    ])

    // Regions
    const regions = ['All', 'Asia', 'Europe', 'North America', 'South America', 'Africa', 'Oceania', 'Middle East']

    // Computed
    const filteredDestinations = computed(() => {
      return allDestinations.value.filter(dest => {
        // Region filter
        if (selectedRegion.value !== 'All' && dest.region !== selectedRegion.value) {
          return false
        }
        
        // Search filter
        if (searchQuery.value) {
          const query = searchQuery.value.toLowerCase()
          return dest.city.toLowerCase().includes(query) || 
                 dest.country.toLowerCase().includes(query)
        }
        
        return true
      })
    })

    // Methods
    const isBlacklisted = (city) => {
      return props.blacklist.includes(city)
    }

    const isSelected = (city) => {
      return selectedDestinations.value.includes(city)
    }

    const toggleDestination = (city) => {
      if (isBlacklisted(city)) return
      
      const index = selectedDestinations.value.indexOf(city)
      if (index === -1) {
        selectedDestinations.value.push(city)
      } else {
        selectedDestinations.value.splice(index, 1)
      }
    }

    const removeFromBlacklist = (city) => {
      emit('remove', city)
    }

    const addSelected = async () => {
      if (selectedDestinations.value.length === 0) return
      
      adding.value = true
      await emit('add', selectedDestinations.value)
      selectedDestinations.value = []
      adding.value = false
    }

    const confirmClearAll = () => {
      showConfirmModal.value = true
    }

    const clearAll = async () => {
      clearing.value = true
      await emit('clear')
      clearing.value = false
      showConfirmModal.value = false
    }

    const closeModal = () => {
      showConfirmModal.value = false
    }

    const filterDestinations = () => {
      // Handled by computed property
    }

    onMounted(() => {
      // Any initialization
    })

    return {
      searchQuery,
      selectedRegion,
      selectedDestinations,
      adding,
      clearing,
      showConfirmModal,
      regions,
      filteredDestinations,
      isBlacklisted,
      isSelected,
      toggleDestination,
      removeFromBlacklist,
      addSelected,
      confirmClearAll,
      clearAll,
      closeModal,
      filterDestinations
    }
  }
}
</script>

<style scoped>
.blacklist-manager {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  border: 1px solid #e0e0e0;
}

.manager-header {
  margin-bottom: 25px;
}

.manager-title {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 8px;
}

.manager-description {
  color: #666;
  font-size: 0.95rem;
}

.subsection-title {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 15px;
}

/* Loading State */
.loading-state {
  padding: 40px;
  text-align: center;
}

/* Current Blacklist */
.current-blacklist {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.blacklist-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 15px;
  background: #FF6B6B;
  color: white;
  border-radius: 50px;
  font-size: 0.95rem;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.tag-name {
  font-weight: 500;
}

.remove-tag {
  background: rgba(255,255,255,0.2);
  border: none;
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.8rem;
}

.remove-tag:hover {
  background: rgba(255,255,255,0.4);
  transform: scale(1.1);
}

/* Tag Animation */
.tag-enter-active,
.tag-leave-active {
  transition: all 0.3s;
}

.tag-enter-from,
.tag-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.tag-leave-active {
  position: absolute;
}

/* Add to Blacklist */
.search-box {
  position: relative;
  margin-bottom: 20px;
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

.search-box input {
  width: 100%;
  padding: 12px 20px 12px 45px;
  border: 2px solid #e0e0e0;
  border-radius: 50px;
  font-size: 0.95rem;
  transition: all 0.3s;
}

.search-box input:focus {
  border-color: #FF6B6B;
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1);
}

/* Region Tabs */
.region-tabs {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.region-tab {
  padding: 8px 20px;
  background: #f0f0f0;
  border: none;
  border-radius: 50px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
}

.region-tab:hover {
  background: #e0e0e0;
}

.region-tab.active {
  background: #FF6B6B;
  color: white;
}

/* Destinations Grid */
.destinations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
  max-height: 400px;
  overflow-y: auto;
  padding: 5px;
}

.destination-option {
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
  position: relative;
}

.destination-option:hover:not(.disabled) {
  transform: translateY(-2px);
  border-color: #FF6B6B;
}

.destination-option.selected {
  border-color: #28A745;
}

.destination-option.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  filter: grayscale(1);
}

.destination-image {
  height: 100px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.blacklist-overlay,
.select-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(2px);
}

.blacklist-overlay .overlay-icon {
  font-size: 2rem;
  color: #FF6B6B;
}

.select-overlay .overlay-icon {
  font-size: 2rem;
  color: #28A745;
}

.destination-info {
  padding: 8px;
  background: #f8f9fa;
  text-align: center;
}

.destination-city {
  display: block;
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
  margin-bottom: 2px;
}

.destination-country {
  display: block;
  color: #666;
  font-size: 0.8rem;
}

/* Selected Count */
.selected-count {
  text-align: right;
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 15px;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 50px;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 15px;
}

.btn-add, .btn-clear {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-add {
  background: #28A745;
  color: white;
}

.btn-add:hover:not(:disabled) {
  background: #218838;
  transform: translateY(-2px);
}

.btn-add:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-clear {
  background: #DC3545;
  color: white;
}

.btn-clear:hover:not(:disabled) {
  background: #c82333;
  transform: translateY(-2px);
}

.btn-clear:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinner-small {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-container {
  background: white;
  border-radius: 15px;
  padding: 30px;
  max-width: 400px;
  width: 90%;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-title {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 10px;
}

.modal-message {
  color: #666;
  margin-bottom: 20px;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  gap: 15px;
}

.btn-confirm, .btn-cancel {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-confirm {
  background: #DC3545;
  color: white;
}

.btn-confirm:hover:not(:disabled) {
  background: #c82333;
}

.btn-cancel {
  background: #f0f0f0;
  color: #333;
}

.btn-cancel:hover {
  background: #e0e0e0;
}

/* Dark Mode */
:root.dark-mode .blacklist-manager {
  background: #0B1E33;
  border-color: #1A334D;
}

:root.dark-mode .manager-title,
:root.dark-mode .subsection-title {
  color: #F5F9FF;
}

:root.dark-mode .manager-description {
  color: #B0C4DE;
}

:root.dark-mode .current-blacklist {
  border-bottom-color: #1A334D;
}

:root.dark-mode .search-box input {
  background: #122B44;
  border-color: #1A334D;
  color: #F5F9FF;
}

:root.dark-mode .search-box input::placeholder {
  color: #B0C4DE;
}

:root.dark-mode .region-tab {
  background: #122B44;
  color: #B0C4DE;
}

:root.dark-mode .region-tab:hover {
  background: #1A334D;
}

:root.dark-mode .region-tab.active {
  background: #00D4FF;
  color: #0B1E33;
}

:root.dark-mode .destination-info {
  background: #122B44;
}

:root.dark-mode .destination-city {
  color: #F5F9FF;
}

:root.dark-mode .destination-country {
  color: #B0C4DE;
}

:root.dark-mode .selected-count {
  background: #122B44;
  color: #B0C4DE;
}

:root.dark-mode .modal-container {
  background: #0B1E33;
  border: 1px solid #00D4FF;
}

:root.dark-mode .modal-title {
  color: #F5F9FF;
}

:root.dark-mode .modal-message {
  color: #B0C4DE;
}

:root.dark-mode .btn-cancel {
  background: #122B44;
  color: #B0C4DE;
  border: 1px solid #1A334D;
}

:root.dark-mode .btn-cancel:hover {
  background: #1A334D;
}

/* Responsive */
@media (max-width: 768px) {
  .destinations-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .region-tabs {
    justify-content: center;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .destinations-grid {
    grid-template-columns: 1fr;
  }
  
  .blacklist-tag {
    width: 100%;
    justify-content: space-between;
  }
}
</style>