// stores/spin.store.js
import api from '@/services/api'

export default {
  namespaced: true,
  
  state: {
    currentOffer: null,
    spinHistory: [],
    isLoading: false,
    error: null,
    stats: {
      totalSpins: 0,
      destinationsVisited: 0,
      moneySaved: 0
    }
  },

  getters: {
    currentOffer: state => state.currentOffer,
    hasOffer: state => !!state.currentOffer,
    spinHistory: state => state.spinHistory,
    recentSpins: state => state.spinHistory.slice(0, 5),
    isLoading: state => state.isLoading,
    error: state => state.error,
    spinStats: state => state.stats
  },

  mutations: {
    SET_CURRENT_OFFER(state, offer) {
      state.currentOffer = offer
    },
    CLEAR_OFFER(state) {
      state.currentOffer = null
    },
    ADD_TO_HISTORY(state, spin) {
      state.spinHistory.unshift({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...spin
      })
      
      // Keep only last 20 spins
      if (state.spinHistory.length > 20) {
        state.spinHistory = state.spinHistory.slice(0, 20)
      }
    },
    SET_LOADING(state, status) {
      state.isLoading = status
    },
    SET_ERROR(state, error) {
      state.error = error
    },
    UPDATE_STATS(state, stats) {
      state.stats = { ...state.stats, ...stats }
    },
    INCREMENT_SPINS(state) {
      state.stats.totalSpins++
    },
    CLEAR_HISTORY(state) {
      state.spinHistory = []
    }
  },

  actions: {
    // Spin the globe
    async spinGlobe({ commit, state, rootGetters }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        // Mock API call - replace with actual
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Get user's blacklist if authenticated
        const blacklist = rootGetters['auth/isAuthenticated'] 
          ? rootGetters['auth/currentUser']?.blacklist || []
          : []
        
        // Mock destinations pool
        const destinations = [
          {
            id: 1,
            name: 'Tokyo',
            country: 'Japan',
            region: 'Asia',
            image: '/images/tokyo.jpg',
            price: 1299,
            originalPrice: 1899,
            days: 5,
            airline: 'Emirates',
            hostel: 'Khaosan Tokyo',
            departure: '2026-04-15T10:30:00',
            return: '2026-04-22T18:45:00',
            tags: ['Culture', 'Food', 'Technology'],
            revealed: true,
            discount: 32
          },
          {
            id: 2,
            name: 'Paris',
            country: 'France',
            region: 'Europe',
            image: '/images/paris.jpg',
            price: 999,
            originalPrice: 1599,
            days: 4,
            airline: 'Air France',
            hostel: 'Generator Paris',
            departure: '2026-04-18T19:15:00',
            return: '2026-04-25T11:30:00',
            tags: ['Romance', 'Art', 'Food'],
            revealed: true,
            discount: 38
          },
          {
            id: 3,
            name: 'Cape Town',
            country: 'South Africa',
            region: 'Africa',
            image: '/images/cape-town.jpg',
            price: 799,
            originalPrice: 1299,
            days: 4,
            airline: 'SAA',
            hostel: 'Once in Cape Town',
            departure: '2026-04-10T08:30:00',
            return: '2026-04-17T17:45:00',
            tags: ['Beach', 'Mountain', 'Wine'],
            revealed: true,
            discount: 38
          },
          {
            id: 4,
            name: 'New York',
            country: 'USA',
            region: 'North America',
            image: '/images/nyc.jpg',
            price: 1199,
            originalPrice: 1799,
            days: 4,
            airline: 'Delta',
            hostel: 'HI NYC Hostel',
            departure: '2026-04-20T21:45:00',
            return: '2026-04-27T19:20:00',
            tags: ['City', 'Culture', 'Shopping'],
            revealed: true,
            discount: 33
          },
          {
            id: 5,
            name: 'Bangkok',
            country: 'Thailand',
            region: 'Asia',
            image: '/images/bangkok.jpg',
            price: 899,
            originalPrice: 1499,
            days: 5,
            airline: 'Thai Airways',
            hostel: 'Lub d Bangkok',
            departure: '2026-04-12T23:55:00',
            return: '2026-04-19T10:15:00',
            tags: ['Food', 'Culture', 'Nightlife'],
            revealed: true,
            discount: 40
          },
          // Mystery destinations
          {
            id: 6,
            region: 'Asia',
            image: '/images/mystery-asia.jpg',
            price: 899,
            days: 5,
            airline: 'Various',
            hostel: 'Mystery Hostel',
            departure: '2026-05-10T14:00:00',
            return: '2026-05-17T10:00:00',
            tags: ['Mystery', 'Adventure'],
            revealed: false,
            discount: 0
          },
          {
            id: 7,
            region: 'Europe',
            image: '/images/mystery-europe.jpg',
            price: 849,
            days: 5,
            airline: 'Various',
            hostel: 'Mystery Hostel',
            departure: '2026-05-20T09:30:00',
            return: '2026-05-27T16:00:00',
            tags: ['Mystery', 'History'],
            revealed: false,
            discount: 0
          }
        ]
        
        // Filter out blacklisted destinations
        const availableDestinations = destinations.filter(d => 
          !blacklist.includes(d.country) && !blacklist.includes(d.region)
        )
        
        // Random selection
        const randomIndex = Math.floor(Math.random() * availableDestinations.length)
        const offer = availableDestinations[randomIndex]
        
        // Add timestamp for countdown
        offer.offeredAt = new Date().toISOString()
        offer.expiresAt = new Date(Date.now() + 7 * 60 * 1000).toISOString() // 7 minutes
        
        commit('SET_CURRENT_OFFER', offer)
        commit('INCREMENT_SPINS')
        commit('ADD_TO_HISTORY', {
          destination: offer.revealed ? offer.name : `${offer.region} Mystery`,
          price: offer.price,
          accepted: null
        })
        
        return offer
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to spin globe'
        commit('SET_ERROR', message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Accept offer
    async acceptOffer({ commit, state, dispatch }) {
      if (!state.currentOffer) return
      
      const offer = { ...state.currentOffer }
      
      // Update history
      const lastSpin = state.spinHistory[0]
      if (lastSpin) {
        lastSpin.accepted = true
      }
      
      commit('CLEAR_OFFER')
      
      // Add to cart
      await dispatch('addToCart', offer, { root: true })
      
      return offer
    },

    // Decline offer
    declineOffer({ commit, state }) {
      if (!state.currentOffer) return
      
      // Update history
      const lastSpin = state.spinHistory[0]
      if (lastSpin) {
        lastSpin.accepted = false
      }
      
      commit('CLEAR_OFFER')
    },

    // Add to cart (used by acceptOffer)
    async addToCart({ rootGetters }, offer) {
      // This will be handled by the main store
      console.log('Adding to cart:', offer)
    },

    // Fetch spin stats
    async fetchSpinStats({ commit }) {
      commit('SET_LOADING', true)
      
      try {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 300))
        
        const stats = {
          totalSpins: 47,
          destinationsVisited: 12,
          moneySaved: 8450
        }
        
        commit('UPDATE_STATS', stats)
        
        return stats
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Clear offer (timeout)
    timeoutOffer({ commit }) {
      commit('CLEAR_OFFER')
    },

    // Clear spin history
    clearHistory({ commit }) {
      commit('CLEAR_HISTORY')
    }
  }
}