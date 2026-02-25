<template>
  <div class="booking-list">
    <!-- Header with Filters -->
    <div class="list-header">
      <h2 class="list-title">My Bookings</h2>
      
      <div class="list-filters">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search bookings..."
            @input="handleSearch"
          >
        </div>
        
        <select v-model="statusFilter" class="filter-select" @change="handleFilterChange">
          <option value="all">All Bookings</option>
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
          <option value="cancelled">Cancelled</option>
        </select>
        
        <select v-model="sortBy" class="filter-select" @change="handleSortChange">
          <option value="date-desc">Most Recent</option>
          <option value="date-asc">Oldest First</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="price-asc">Price: Low to High</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <LoadingSpinner message="Loading your bookings..." />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <span class="error-icon">⚠️</span>
      <h3>Oops! Something went wrong</h3>
      <p>{{ error }}</p>
      <button @click="$emit('retry')" class="retry-btn">Try Again</button>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredBookings.length === 0" class="empty-state">
      <div class="empty-icon">🧳</div>
      <h3>No bookings found</h3>
      <p v-if="searchQuery">No results match your search criteria</p>
      <p v-else-if="statusFilter !== 'all'">No {{ statusFilter }} bookings to show</p>
      <p v-else>Ready to start your first adventure?</p>
      
      <div class="empty-actions">
        <router-link to="/spin" class="btn-primary">
          <span class="btn-icon">🎲</span>
          Spin the Globe
        </router-link>
        <button v-if="searchQuery" @click="clearSearch" class="btn-secondary">
          Clear Search
        </button>
      </div>
    </div>

    <!-- Bookings Grid -->
    <div v-else class="bookings-grid">
      <transition-group name="list" tag="div" class="grid-container">
        <BookingCard
          v-for="booking in paginatedBookings"
          :key="booking.id"
          :booking="booking"
          @view="handleView"
          @cancel="handleCancel"
          @rebook="handleRebook"
          @review="handleReview"
        />
      </transition-group>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination">
        <button 
          class="page-btn" 
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
        >
          ←
        </button>
        
        <button 
          v-for="page in displayedPages" 
          :key="page"
          class="page-btn"
          :class="{ active: page === currentPage }"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
        
        <button 
          class="page-btn" 
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
        >
          →
        </button>
      </div>

      <!-- Results Summary -->
      <div class="results-summary">
        Showing {{ startIndex + 1 }}-{{ endIndex }} of {{ filteredBookings.length }} bookings
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import BookingCard from './BookingCard.vue'

export default {
  name: 'BookingList',
  components: {
    LoadingSpinner,
    BookingCard
  },
  props: {
    bookings: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: ''
    },
    itemsPerPage: {
      type: Number,
      default: 6
    }
  },
  emits: ['view', 'cancel', 'rebook', 'review', 'retry', 'filter-change'],
  setup(props, { emit }) {
    // Filters
    const searchQuery = ref('')
    const statusFilter = ref('all')
    const sortBy = ref('date-desc')
    const currentPage = ref(1)

    // Computed filtered and sorted bookings
    const filteredBookings = computed(() => {
      let filtered = [...props.bookings]

      // Search filter
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(b => 
          b.bookingNumber?.toLowerCase().includes(query) ||
          (b.destination && b.destination.toLowerCase().includes(query)) ||
          (b.country && b.country.toLowerCase().includes(query))
        )
      }

      // Status filter
      if (statusFilter.value !== 'all') {
        filtered = filtered.filter(b => {
          if (statusFilter.value === 'upcoming') {
            return b.status === 'confirmed' || b.status === 'pending'
          } else if (statusFilter.value === 'past') {
            return b.status === 'completed'
          } else {
            return b.status === statusFilter.value
          }
        })
      }

      // Sort
      filtered.sort((a, b) => {
        switch (sortBy.value) {
          case 'date-desc':
            return new Date(b.departure) - new Date(a.departure)
          case 'date-asc':
            return new Date(a.departure) - new Date(b.departure)
          case 'price-desc':
            return b.totalPrice - a.totalPrice
          case 'price-asc':
            return a.totalPrice - b.totalPrice
          default:
            return 0
        }
      })

      return filtered
    })

    // Pagination
    const totalPages = computed(() => 
      Math.ceil(filteredBookings.value.length / props.itemsPerPage)
    )

    const paginatedBookings = computed(() => {
      const start = (currentPage.value - 1) * props.itemsPerPage
      const end = start + props.itemsPerPage
      return filteredBookings.value.slice(start, end)
    })

    const startIndex = computed(() => 
      (currentPage.value - 1) * props.itemsPerPage
    )

    const endIndex = computed(() => 
      Math.min(startIndex.value + props.itemsPerPage, filteredBookings.value.length)
    )

    // Display pages for pagination
    const displayedPages = computed(() => {
      const delta = 2
      const range = []
      const rangeWithDots = []
      let l

      for (let i = 1; i <= totalPages.value; i++) {
        if (i === 1 || i === totalPages.value || (i >= currentPage.value - delta && i <= currentPage.value + delta)) {
          range.push(i)
        }
      }

      range.forEach((i) => {
        if (l) {
          if (i - l === 2) {
            rangeWithDots.push(l + 1)
          } else if (i - l !== 1) {
            rangeWithDots.push('...')
          }
        }
        rangeWithDots.push(i)
        l = i
      })

      return rangeWithDots
    })

    // Methods
    const handleSearch = () => {
      currentPage.value = 1
      emit('filter-change', { search: searchQuery.value })
    }

    const handleFilterChange = () => {
      currentPage.value = 1
      emit('filter-change', { 
        status: statusFilter.value,
        sort: sortBy.value 
      })
    }

    const handleSortChange = () => {
      currentPage.value = 1
      emit('filter-change', { sort: sortBy.value })
    }

    const clearSearch = () => {
      searchQuery.value = ''
      currentPage.value = 1
    }

    const goToPage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }

    const handleView = (id) => emit('view', id)
    const handleCancel = (id) => emit('cancel', id)
    const handleRebook = (id) => emit('rebook', id)
    const handleReview = (id) => emit('review', id)

    // Watch for changes in filtered bookings to reset pagination
    watch([searchQuery, statusFilter, sortBy], () => {
      currentPage.value = 1
    })

    return {
      searchQuery,
      statusFilter,
      sortBy,
      currentPage,
      filteredBookings,
      paginatedBookings,
      totalPages,
      startIndex,
      endIndex,
      displayedPages,
      handleSearch,
      handleFilterChange,
      handleSortChange,
      clearSearch,
      goToPage,
      handleView,
      handleCancel,
      handleRebook,
      handleReview
    }
  }
}
</script>

<style scoped>
.booking-list {
  width: 100%;
}

/* Header */
.list-header {
  margin-bottom: 30px;
}

.list-title {
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;
}

.list-filters {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 250px;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

.search-box input {
  width: 100%;
  padding: 10px 15px 10px 40px;
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

.filter-select {
  padding: 10px 25px;
  border: 2px solid #e0e0e0;
  border-radius: 50px;
  background: white;
  cursor: pointer;
  font-size: 0.95rem;
  min-width: 150px;
}

.filter-select:focus {
  outline: none;
  border-color: #FF6B6B;
}

/* Loading State */
.loading-state {
  padding: 60px 20px;
  text-align: center;
}

/* Error State */
.error-state {
  text-align: center;
  padding: 60px 20px;
  background: #f8f9fa;
  border-radius: 15px;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.error-state h3 {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 10px;
}

.error-state p {
  color: #666;
  margin-bottom: 20px;
}

.retry-btn {
  padding: 10px 30px;
  background: #FF6B6B;
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s;
}

.retry-btn:hover {
  background: #FF5252;
  transform: translateY(-2px);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: #f8f9fa;
  border-radius: 15px;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 10px;
}

.empty-state p {
  color: #666;
  margin-bottom: 30px;
}

.empty-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.btn-primary, .btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 25px;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
}

.btn-primary {
  background: #FF6B6B;
  color: white;
  border: none;
}

.btn-primary:hover {
  background: #FF5252;
  transform: translateY(-2px);
}

.btn-secondary {
  background: white;
  border: 2px solid #FF6B6B;
  color: #FF6B6B;
}

.btn-secondary:hover {
  background: #FF6B6B;
  color: white;
  transform: translateY(-2px);
}

/* Bookings Grid */
.bookings-grid {
  margin-top: 20px;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

/* List Animation */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.list-leave-active {
  position: absolute;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  gap: 5px;
  margin: 30px 0 15px;
}

.page-btn {
  min-width: 40px;
  height: 40px;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
}

.page-btn:hover:not(:disabled) {
  border-color: #FF6B6B;
  color: #FF6B6B;
}

.page-btn.active {
  background: #FF6B6B;
  border-color: #FF6B6B;
  color: white;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Results Summary */
.results-summary {
  text-align: center;
  color: #666;
  font-size: 0.9rem;
}

/* Dark Mode */
:root.dark-mode .list-title {
  color: #F5F9FF;
}

:root.dark-mode .search-box input,
:root.dark-mode .filter-select {
  background: #0B1E33;
  border-color: #1A334D;
  color: #F5F9FF;
}

:root.dark-mode .search-box input::placeholder {
  color: #B0C4DE;
}

:root.dark-mode .error-state,
:root.dark-mode .empty-state {
  background: #122B44;
}

:root.dark-mode .error-state h3,
:root.dark-mode .empty-state h3 {
  color: #F5F9FF;
}

:root.dark-mode .error-state p,
:root.dark-mode .empty-state p {
  color: #B0C4DE;
}

:root.dark-mode .page-btn {
  background: #0B1E33;
  border-color: #1A334D;
  color: #F5F9FF;
}

:root.dark-mode .page-btn:hover:not(:disabled) {
  border-color: #00D4FF;
  color: #00D4FF;
}

:root.dark-mode .page-btn.active {
  background: #00D4FF;
  border-color: #00D4FF;
  color: #0B1E33;
}

:root.dark-mode .results-summary {
  color: #B0C4DE;
}

/* Responsive */
@media (max-width: 768px) {
  .list-filters {
    flex-direction: column;
  }
  
  .search-box {
    width: 100%;
  }
  
  .filter-select {
    width: 100%;
  }
  
  .grid-container {
    grid-template-columns: 1fr;
  }
  
  .empty-actions {
    flex-direction: column;
  }
  
  .pagination {
    flex-wrap: wrap;
  }
}
</style>