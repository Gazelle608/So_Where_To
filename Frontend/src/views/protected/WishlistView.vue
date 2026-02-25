<template>
  <div class="wishlist-view">
    <!-- Header Section -->
    <div class="wishlist-header">
      <h1 class="page-title">My <span>Wishlist</span></h1>
      <p class="page-subtitle">Save your dream destinations for later</p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-container">
      <div class="spinner"></div>
      <p>Loading your wishlist...</p>
    </div>

    <div v-else>
      <!-- Empty Wishlist -->
      <div v-if="wishlistItems.length === 0" class="empty-wishlist">
        <div class="empty-icon">❤️</div>
        <h2>Your wishlist is empty</h2>
        <p>Start exploring destinations and save your favorites for later!</p>
        <div class="empty-actions">
          <router-link to="/spin" class="btn btn-primary">
            <span class="btn-icon">🎲</span>
            Spin the Globe
          </router-link>
          <router-link to="/destinations" class="btn btn-outline">
            <span class="btn-icon">🌍</span>
            Browse Destinations
          </router-link>
        </div>
      </div>

      <!-- Wishlist Grid -->
      <div v-else class="wishlist-container">
        <!-- Wishlist Stats -->
        <div class="wishlist-stats">
          <div class="stat-card">
            <span class="stat-value">{{ wishlistItems.length }}</span>
            <span class="stat-label">Saved Destinations</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">R{{ totalValue.toLocaleString() }}</span>
            <span class="stat-label">Total Value</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">{{ uniqueRegions }}</span>
            <span class="stat-label">Regions</span>
          </div>
        </div>

        <!-- Wishlist Controls -->
        <div class="wishlist-controls">
          <div class="view-toggle">
            <button 
              class="toggle-btn" 
              :class="{ active: viewMode === 'grid' }"
              @click="viewMode = 'grid'"
            >
              <span class="toggle-icon">📱</span>
              Grid
            </button>
            <button 
              class="toggle-btn" 
              :class="{ active: viewMode === 'list' }"
              @click="viewMode = 'list'"
            >
              <span class="toggle-icon">📋</span>
              List
            </button>
          </div>

          <div class="sort-control">
            <select v-model="sortBy" class="sort-select">
              <option value="date-desc">Recently Added</option>
              <option value="date-asc">Oldest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
          </div>

          <button @click="clearWishlist" class="clear-btn" v-if="wishlistItems.length > 0">
            <span class="clear-icon">🗑️</span>
            Clear All
          </button>
        </div>

        <!-- Wishlist Items - Grid View -->
        <div v-if="viewMode === 'grid'" class="wishlist-grid">
          <div 
            v-for="item in sortedItems" 
            :key="item.id" 
            class="wishlist-card"
            :class="{ 'mystery': !item.revealed }"
          >
            <div class="card-image" :style="{ backgroundImage: `url(${item.image})` }">
              <div v-if="!item.revealed" class="mystery-overlay">
                <span class="mystery-icon">❓</span>
              </div>
              <button class="remove-btn" @click.stop="removeFromWishlist(item.id)">
                <span>✕</span>
              </button>
              <div class="card-badge" v-if="item.discount">
                -{{ item.discount }}%
              </div>
            </div>

            <div class="card-content">
              <div class="card-header">
                <h3 class="card-title">{{ item.revealed ? item.name : 'Mystery Destination' }}</h3>
                <p v-if="item.revealed" class="card-country">{{ item.country }}</p>
                <p v-else class="card-region">{{ item.region }} Mystery</p>
              </div>

              <div class="card-details">
                <div class="detail-row">
                  <span class="detail-icon">💰</span>
                  <span class="detail-text">
                    <span class="price">R{{ item.price.toLocaleString() }}</span>
                    <span v-if="item.originalPrice" class="original-price">
                      R{{ item.originalPrice.toLocaleString() }}
                    </span>
                  </span>
                </div>
                <div class="detail-row">
                  <span class="detail-icon">✈️</span>
                  <span>{{ item.days }} days</span>
                </div>
                <div class="detail-row" v-if="item.rating">
                  <span class="detail-icon">⭐</span>
                  <span>{{ item.rating }} ({{ item.reviews }}+)</span>
                </div>
              </div>

              <div class="card-tags">
                <span v-for="tag in item.tags" :key="tag" class="tag">
                  {{ tag }}
                </span>
              </div>

              <div class="card-footer">
                <button @click="addToCart(item)" class="btn-add">
                  <span class="btn-icon">🛒</span>
                  Add to Cart
                </button>
                <button @click="viewDetails(item)" class="btn-view">
                  <span class="btn-icon">👁️</span>
                  View
                </button>
              </div>

              <div class="date-added">
                Added {{ formatDate(item.addedDate) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Wishlist Items - List View -->
        <div v-if="viewMode === 'list'" class="wishlist-list">
          <div 
            v-for="item in sortedItems" 
            :key="item.id" 
            class="wishlist-list-item"
            :class="{ 'mystery': !item.revealed }"
          >
            <div class="list-image" :style="{ backgroundImage: `url(${item.image})` }">
              <div v-if="!item.revealed" class="mystery-overlay">
                <span class="mystery-icon">❓</span>
              </div>
            </div>

            <div class="list-content">
              <div class="list-header">
                <div>
                  <h3 class="list-title">{{ item.revealed ? item.name : 'Mystery Destination' }}</h3>
                  <p class="list-subtitle">
                    {{ item.revealed ? item.country : `${item.region} Mystery` }}
                  </p>
                </div>
                <button class="list-remove" @click="removeFromWishlist(item.id)">
                  <span>✕</span>
                </button>
              </div>

              <div class="list-details">
                <div class="list-detail-item">
                  <span class="detail-icon">💰</span>
                  <span>
                    R{{ item.price.toLocaleString() }}
                    <span v-if="item.originalPrice" class="original-price">
                      R{{ item.originalPrice.toLocaleString() }}
                    </span>
                  </span>
                </div>
                <div class="list-detail-item">
                  <span class="detail-icon">✈️</span>
                  <span>{{ item.days }} days</span>
                </div>
                <div class="list-detail-item" v-if="item.rating">
                  <span class="detail-icon">⭐</span>
                  <span>{{ item.rating }}</span>
                </div>
                <div class="list-detail-item">
                  <span class="detail-icon">📅</span>
                  <span>Added {{ formatDate(item.addedDate) }}</span>
                </div>
              </div>

              <div class="list-tags">
                <span v-for="tag in item.tags" :key="tag" class="tag">
                  {{ tag }}
                </span>
              </div>

              <div class="list-actions">
                <button @click="addToCart(item)" class="btn-add">
                  <span class="btn-icon">🛒</span>
                  Add to Cart
                </button>
                <button @click="viewDetails(item)" class="btn-view">
                  <span class="btn-icon">👁️</span>
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Share Wishlist -->
        <div class="share-wishlist">
          <h3>Share Your Wishlist</h3>
          <div class="share-buttons">
            <button class="share-btn email" @click="shareViaEmail">
              <span class="share-icon">📧</span>
              Email
            </button>
            <button class="share-btn facebook" @click="shareOnFacebook">
              <span class="share-icon">📘</span>
              Facebook
            </button>
            <button class="share-btn twitter" @click="shareOnTwitter">
              <span class="share-icon">🐦</span>
              Twitter
            </button>
            <button class="share-btn copy" @click="copyWishlistLink">
              <span class="share-icon">🔗</span>
              Copy Link
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Recommendations -->
    <div v-if="wishlistItems.length > 0" class="recommendations">
      <h2 class="section-title">You Might Also <span>Like</span></h2>
      <div class="recommendations-grid">
        <div v-for="rec in recommendations" :key="rec.id" class="recommendation-card">
          <div class="rec-image" :style="{ backgroundImage: `url(${rec.image})` }">
            <button class="rec-wishlist" @click="addToWishlist(rec)">
              <span class="wishlist-icon">❤️</span>
            </button>
          </div>
          <div class="rec-content">
            <h4>{{ rec.name }}</h4>
            <p>{{ rec.country }}</p>
            <span class="rec-price">R{{ rec.price.toLocaleString() }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
  name: 'WishlistView',
  setup() {
    const router = useRouter()
    const store = useStore()
    
    // State
    const isLoading = ref(false)
    const viewMode = ref('grid') // 'grid' or 'list'
    const sortBy = ref('date-desc')
    
    // Mock wishlist data - replace with actual store data
    const wishlistItems = ref([
      {
        id: 1,
        name: 'Tokyo',
        country: 'Japan',
        region: 'Asia',
        image: '/images/tokyo.jpg',
        price: 1299,
        originalPrice: 1899,
        discount: 32,
        days: 5,
        rating: 4.8,
        reviews: 234,
        tags: ['Culture', 'Food', 'Technology'],
        revealed: true,
        addedDate: '2026-02-15'
      },
      {
        id: 2,
        name: 'Paris',
        country: 'France',
        region: 'Europe',
        image: '/images/paris.jpg',
        price: 999,
        originalPrice: 1599,
        discount: 38,
        days: 4,
        rating: 4.7,
        reviews: 189,
        tags: ['Romance', 'Art', 'Food'],
        revealed: true,
        addedDate: '2026-02-14'
      },
      {
        id: 3,
        name: 'Mystery Asia',
        region: 'Asia',
        image: '/images/mystery-asia.jpg',
        price: 899,
        days: 5,
        tags: ['Mystery', 'Adventure'],
        revealed: false,
        addedDate: '2026-02-13'
      },
      {
        id: 4,
        name: 'Cape Town',
        country: 'South Africa',
        region: 'Africa',
        image: '/images/cape-town.jpg',
        price: 799,
        originalPrice: 1299,
        discount: 38,
        days: 4,
        rating: 4.9,
        reviews: 312,
        tags: ['Beach', 'Mountain', 'Wine'],
        revealed: true,
        addedDate: '2026-02-12'
      },
      {
        id: 5,
        name: 'New York',
        country: 'USA',
        region: 'North America',
        image: '/images/nyc.jpg',
        price: 1199,
        originalPrice: 1799,
        discount: 33,
        days: 4,
        rating: 4.8,
        reviews: 456,
        tags: ['City', 'Culture', 'Shopping'],
        revealed: true,
        addedDate: '2026-02-11'
      },
      {
        id: 6,
        name: 'Mystery Europe',
        region: 'Europe',
        image: '/images/mystery-europe.jpg',
        price: 849,
        days: 5,
        tags: ['Mystery', 'History'],
        revealed: false,
        addedDate: '2026-02-10'
      }
    ])
    
    // Mock recommendations
    const recommendations = ref([
      {
        id: 101,
        name: 'Bangkok',
        country: 'Thailand',
        image: '/images/bangkok.jpg',
        price: 899
      },
      {
        id: 102,
        name: 'Rio',
        country: 'Brazil',
        image: '/images/rio.jpg',
        price: 1099
      },
      {
        id: 103,
        name: 'Sydney',
        country: 'Australia',
        image: '/images/sydney.jpg',
        price: 1499
      },
      {
        id: 104,
        name: 'Dubai',
        country: 'UAE',
        image: '/images/dubai.jpg',
        price: 1299
      }
    ])
    
    // Computed
    const totalValue = computed(() => {
      return wishlistItems.value.reduce((sum, item) => sum + item.price, 0)
    })
    
    const uniqueRegions = computed(() => {
      const regions = new Set(wishlistItems.value.map(item => item.region))
      return regions.size
    })
    
    const sortedItems = computed(() => {
      const items = [...wishlistItems.value]
      
      switch (sortBy.value) {
        case 'date-desc':
          return items.sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate))
        case 'date-asc':
          return items.sort((a, b) => new Date(a.addedDate) - new Date(b.addedDate))
        case 'price-asc':
          return items.sort((a, b) => a.price - b.price)
        case 'price-desc':
          return items.sort((a, b) => b.price - a.price)
        case 'name-asc':
          return items.sort((a, b) => {
            const nameA = a.revealed ? a.name : 'Mystery'
            const nameB = b.revealed ? b.name : 'Mystery'
            return nameA.localeCompare(nameB)
          })
        case 'name-desc':
          return items.sort((a, b) => {
            const nameA = a.revealed ? a.name : 'Mystery'
            const nameB = b.revealed ? b.name : 'Mystery'
            return nameB.localeCompare(nameA)
          })
        default:
          return items
      }
    })
    
    // Methods
    const formatDate = (dateString) => {
      const date = new Date(dateString)
      const now = new Date()
      const diffTime = Math.abs(now - date)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 1) return 'yesterday'
      if (diffDays < 7) return `${diffDays} days ago`
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
      return date.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })
    }
    
    const removeFromWishlist = (id) => {
      wishlistItems.value = wishlistItems.value.filter(item => item.id !== id)
      store.commit('SHOW_NOTIFICATION', {
        message: 'Removed from wishlist',
        type: 'success'
      })
    }
    
    const clearWishlist = () => {
      if (confirm('Are you sure you want to clear your entire wishlist?')) {
        wishlistItems.value = []
        store.commit('SHOW_NOTIFICATION', {
          message: 'Wishlist cleared',
          type: 'info'
        })
      }
    }
    
    const addToCart = (item) => {
      store.commit('SHOW_NOTIFICATION', {
        message: `Added to cart: ${item.revealed ? item.name : 'Mystery Destination'}`,
        type: 'success'
      })
      // Dispatch to cart store
      // store.dispatch('cart/addItem', item)
    }
    
    const addToWishlist = (item) => {
      if (!wishlistItems.value.find(i => i.id === item.id)) {
        wishlistItems.value.push({
          ...item,
          addedDate: new Date().toISOString().split('T')[0]
        })
        store.commit('SHOW_NOTIFICATION', {
          message: `Added to wishlist: ${item.name}`,
          type: 'success'
        })
      }
    }
    
    const viewDetails = (item) => {
      if (item.revealed) {
        router.push(`/destination/${item.id}`)
      } else {
        router.push('/spin')
      }
    }
    
    const shareViaEmail = () => {
      const items = wishlistItems.value.map(i => 
        `- ${i.revealed ? i.name : 'Mystery Destination'} (R${i.price})`
      ).join('\n')
      
      const subject = 'My So Where To? Wishlist'
      const body = `Check out my mystery travel wishlist:\n\n${items}\n\nView more at sowhereto.com`
      
      window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    }
    
    const shareOnFacebook = () => {
      window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(window.location.href))
    }
    
    const shareOnTwitter = () => {
      const text = `Check out my mystery travel wishlist on So Where To? 🌍✈️`
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`)
    }
    
    const copyWishlistLink = () => {
      navigator.clipboard.writeText(window.location.href)
      store.commit('SHOW_NOTIFICATION', {
        message: 'Link copied to clipboard!',
        type: 'success'
      })
    }
    
    // Lifecycle
    onMounted(() => {
      isLoading.value = false
    })
    
    return {
      isLoading,
      wishlistItems,
      recommendations,
      viewMode,
      sortBy,
      totalValue,
      uniqueRegions,
      sortedItems,
      formatDate,
      removeFromWishlist,
      clearWishlist,
      addToCart,
      addToWishlist,
      viewDetails,
      shareViaEmail,
      shareOnFacebook,
      shareOnTwitter,
      copyWishlistLink
    }
  }
}
</script>

<style scoped>
.wishlist-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* Header */
.wishlist-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  font-size: 3rem;
  color: #333333;
  margin-bottom: 10px;
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

.page-subtitle {
  color: #666666;
  font-size: 1.1rem;
}

/* Loading State */
.loading-container {
  text-align: center;
  padding: 80px 20px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e0e0e0;
  border-top-color: #FF6B6B;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Empty Wishlist */
.empty-wishlist {
  text-align: center;
  padding: 80px 20px;
  background: #f9f9f9;
  border-radius: 20px;
  max-width: 500px;
  margin: 0 auto;
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 20px;
  animation: heartbeat 1.5s ease-in-out infinite;
}

@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.empty-wishlist h2 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 15px;
}

.empty-wishlist p {
  color: #666;
  margin-bottom: 30px;
}

.empty-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

/* Wishlist Stats */
.wishlist-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 25px;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  border: 1px solid #e0e0e0;
}

.stat-value {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: #FF6B6B;
  margin-bottom: 5px;
}

.stat-label {
  color: #666;
  font-size: 0.95rem;
}

/* Wishlist Controls */
.wishlist-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 15px;
}

.view-toggle {
  display: flex;
  gap: 5px;
  background: #f0f0f0;
  padding: 5px;
  border-radius: 50px;
}

.toggle-btn {
  padding: 8px 20px;
  border: none;
  border-radius: 50px;
  background: transparent;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
}

.toggle-btn.active {
  background: #FF6B6B;
  color: white;
}

.toggle-icon {
  font-size: 1.1rem;
}

.sort-select {
  padding: 10px 20px;
  border: 2px solid #e0e0e0;
  border-radius: 50px;
  background: white;
  cursor: pointer;
  font-size: 0.95rem;
  min-width: 200px;
}

.sort-select:focus {
  outline: none;
  border-color: #FF6B6B;
}

.clear-btn {
  padding: 10px 20px;
  background: #DC3545;
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
}

.clear-btn:hover {
  background: #c82333;
  transform: translateY(-2px);
}

/* Wishlist Grid */
.wishlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 50px;
}

.wishlist-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  transition: all 0.3s;
  position: relative;
  border: 1px solid #e0e0e0;
}

.wishlist-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(255, 107, 107, 0.15);
  border-color: #FF6B6B;
}

.wishlist-card.mystery {
  border: 2px solid #00D4FF;
}

.card-image {
  height: 200px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.mystery-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
}

.mystery-icon {
  font-size: 3rem;
  color: white;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.remove-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(0,0,0,0.5);
  border: none;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  z-index: 2;
}

.remove-btn:hover {
  background: #DC3545;
  transform: rotate(90deg);
}

.card-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: #28A745;
  color: white;
  padding: 5px 10px;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
  z-index: 2;
}

.card-content {
  padding: 20px;
}

.card-header {
  margin-bottom: 15px;
}

.card-title {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 5px;
}

.card-country, .card-region {
  color: #FF6B6B;
  font-size: 0.9rem;
  font-weight: 500;
}

.card-details {
  margin-bottom: 15px;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
  color: #666;
  font-size: 0.95rem;
}

.detail-icon {
  width: 20px;
  color: #FF6B6B;
}

.price {
  font-weight: 700;
  color: #28A745;
}

.original-price {
  margin-left: 8px;
  text-decoration: line-through;
  color: #999;
  font-size: 0.85rem;
}

.card-tags {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  margin-bottom: 15px;
}

.tag {
  background: #f0f0f0;
  color: #666;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
}

.card-footer {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.btn-add, .btn-view {
  flex: 1;
  padding: 8px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-size: 0.9rem;
}

.btn-add {
  background: #28A745;
  color: white;
}

.btn-add:hover {
  background: #218838;
  transform: translateY(-2px);
}

.btn-view {
  background: #4A6FA5;
  color: white;
}

.btn-view:hover {
  background: #3A5A84;
  transform: translateY(-2px);
}

.date-added {
  font-size: 0.8rem;
  color: #999;
  text-align: right;
}

/* List View */
.wishlist-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 50px;
}

.wishlist-list-item {
  display: flex;
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  border: 1px solid #e0e0e0;
}

.wishlist-list-item:hover {
  border-color: #FF6B6B;
}

.wishlist-list-item.mystery {
  border: 2px solid #00D4FF;
}

.list-image {
  width: 200px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.list-content {
  flex: 1;
  padding: 20px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.list-title {
  font-size: 1.4rem;
  color: #333;
  margin-bottom: 5px;
}

.list-subtitle {
  color: #FF6B6B;
  font-weight: 500;
}

.list-remove {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #f0f0f0;
  border: none;
  color: #999;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.list-remove:hover {
  background: #DC3545;
  color: white;
  transform: rotate(90deg);
}

.list-details {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.list-detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
}

.list-tags {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  margin-bottom: 15px;
}

.list-actions {
  display: flex;
  gap: 15px;
}

/* Share Wishlist */
.share-wishlist {
  text-align: center;
  padding: 40px;
  background: #f9f9f9;
  border-radius: 20px;
  margin-top: 30px;
}

.share-wishlist h3 {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 20px;
}

.share-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.share-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 25px;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.95rem;
}

.share-btn.email {
  background: #6C757D;
  color: white;
}

.share-btn.email:hover {
  background: #5a6268;
  transform: translateY(-2px);
}

.share-btn.facebook {
  background: #4267B2;
  color: white;
}

.share-btn.facebook:hover {
  background: #365899;
  transform: translateY(-2px);
}

.share-btn.twitter {
  background: #1DA1F2;
  color: white;
}

.share-btn.twitter:hover {
  background: #1a91da;
  transform: translateY(-2px);
}

.share-btn.copy {
  background: #28A745;
  color: white;
}

.share-btn.copy:hover {
  background: #218838;
  transform: translateY(-2px);
}

/* Recommendations */
.recommendations {
  margin-top: 60px;
}

.section-title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 30px;
  color: #333;
}

.section-title span {
  color: #FF6B6B;
  position: relative;
}

.section-title span::after {
  content: '';
  position: absolute;
  bottom: 5px;
  left: 0;
  width: 100%;
  height: 6px;
  background: rgba(255, 107, 107, 0.2);
  z-index: -1;
}

.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.recommendation-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  transition: transform 0.3s;
  cursor: pointer;
}

.recommendation-card:hover {
  transform: translateY(-5px);
}

.rec-image {
  height: 150px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.rec-wishlist {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.rec-wishlist:hover {
  background: #FF6B6B;
  color: white;
  transform: scale(1.1);
}

.rec-content {
  padding: 15px;
  text-align: center;
}

.rec-content h4 {
  font-size: 1rem;
  color: #333;
  margin-bottom: 3px;
}

.rec-content p {
  color: #999;
  font-size: 0.85rem;
  margin-bottom: 8px;
}

.rec-price {
  font-weight: 700;
  color: #28A745;
}

/* Dark Mode */
:root.dark-mode .page-title {
  color: #F5F9FF;
}

:root.dark-mode .page-subtitle {
  color: #B0C4DE;
}

:root.dark-mode .empty-wishlist {
  background: #122B44;
}

:root.dark-mode .empty-wishlist h2 {
  color: #F5F9FF;
}

:root.dark-mode .stat-card {
  background: #0B1E33;
  border-color: #1A334D;
}

:root.dark-mode .stat-label {
  color: #B0C4DE;
}

:root.dark-mode .view-toggle {
  background: #122B44;
}

:root.dark-mode .toggle-btn {
  color: #B0C4DE;
}

:root.dark-mode .toggle-btn.active {
  background: #00D4FF;
  color: #0B1E33;
}

:root.dark-mode .sort-select {
  background: #0B1E33;
  border-color: #1A334D;
  color: #F5F9FF;
}

:root.dark-mode .wishlist-card {
  background: #0B1E33;
  border-color: #1A334D;
}

:root.dark-mode .card-title {
  color: #F5F9FF;
}

:root.dark-mode .detail-row {
  color: #B0C4DE;
}

:root.dark-mode .tag {
  background: #122B44;
  color: #B0C4DE;
  border: 1px solid #1A334D;
}

:root.dark-mode .share-wishlist {
  background: #122B44;
}

:root.dark-mode .share-wishlist h3 {
  color: #F5F9FF;
}

:root.dark-mode .recommendation-card {
  background: #0B1E33;
  border: 1px solid #1A334D;
}

:root.dark-mode .rec-content h4 {
  color: #F5F9FF;
}

:root.dark-mode .wishlist-list-item {
  background: #0B1E33;
  border-color: #1A334D;
}

:root.dark-mode .list-title {
  color: #F5F9FF;
}

:root.dark-mode .list-detail-item {
  color: #B0C4DE;
}

/* Responsive */
@media (max-width: 768px) {
  .wishlist-header h1 {
    font-size: 2.5rem;
  }
  
  .wishlist-stats {
    grid-template-columns: 1fr;
  }
  
  .wishlist-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .view-toggle {
    width: 100%;
  }
  
  .toggle-btn {
    flex: 1;
    justify-content: center;
  }
  
  .sort-select {
    width: 100%;
  }
  
  .clear-btn {
    width: 100%;
    justify-content: center;
  }
  
  .empty-actions {
    flex-direction: column;
  }
  
  .wishlist-list-item {
    flex-direction: column;
  }
  
  .list-image {
    width: 100%;
    height: 150px;
  }
  
  .list-details {
    flex-direction: column;
    gap: 8px;
  }
  
  .list-actions {
    flex-direction: column;
  }
  
  .share-buttons {
    flex-direction: column;
  }
  
  .share-btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .wishlist-header h1 {
    font-size: 2rem;
  }
  
  .wishlist-grid {
    grid-template-columns: 1fr;
  }
  
  .card-footer {
    flex-direction: column;
  }
  
  .btn-add, .btn-view {
    width: 100%;
  }
  
  .recommendations-grid {
    grid-template-columns: 1fr;
  }
}
</style>