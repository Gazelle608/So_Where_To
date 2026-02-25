// stores/user.store.js
import api from '@/services/api'

export default {
  namespaced: true,
  
  state: {
    profile: null,
    preferences: {
      airline: '',
      accommodation: 'hostel',
      maxBudget: 1500,
      newsletter: true,
      emailNotifications: true,
      smsAlerts: false,
      language: 'en',
      currency: 'ZAR'
    },
    blacklist: [],
    wishlist: [],
    paymentMethods: [],
    isLoading: false,
    error: null
  },

  getters: {
    profile: state => state.profile,
    fullName: state => {
      if (!state.profile) return ''
      return `${state.profile.firstName || ''} ${state.profile.lastName || ''}`.trim()
    },
    preferences: state => state.preferences,
    blacklist: state => state.blacklist,
    wishlist: state => state.wishlist,
    wishlistCount: state => state.wishlist.length,
    paymentMethods: state => state.paymentMethods,
    defaultPaymentMethod: state => state.paymentMethods.find(p => p.isDefault),
    isLoading: state => state.isLoading,
    error: state => state.error,
    
    // Check if destination is in wishlist
    isInWishlist: state => (destinationId) => {
      return state.wishlist.some(item => item.id === destinationId)
    },
    
    // Check if city is blacklisted
    isBlacklisted: state => (city) => {
      return state.blacklist.includes(city)
    }
  },

  mutations: {
    SET_PROFILE(state, profile) {
      state.profile = profile
    },
    UPDATE_PROFILE(state, updates) {
      state.profile = { ...state.profile, ...updates }
    },
    SET_PREFERENCES(state, preferences) {
      state.preferences = { ...state.preferences, ...preferences }
    },
    SET_BLACKLIST(state, blacklist) {
      state.blacklist = blacklist
    },
    ADD_TO_BLACKLIST(state, city) {
      if (!state.blacklist.includes(city)) {
        state.blacklist.push(city)
      }
    },
    REMOVE_FROM_BLACKLIST(state, city) {
      state.blacklist = state.blacklist.filter(c => c !== city)
    },
    SET_WISHLIST(state, wishlist) {
      state.wishlist = wishlist
    },
    ADD_TO_WISHLIST(state, item) {
      if (!state.wishlist.some(i => i.id === item.id)) {
        state.wishlist.push({
          ...item,
          addedAt: new Date().toISOString()
        })
      }
    },
    REMOVE_FROM_WISHLIST(state, itemId) {
      state.wishlist = state.wishlist.filter(item => item.id !== itemId)
    },
    CLEAR_WISHLIST(state) {
      state.wishlist = []
    },
    SET_PAYMENT_METHODS(state, methods) {
      state.paymentMethods = methods
    },
    ADD_PAYMENT_METHOD(state, method) {
      state.paymentMethods.push(method)
    },
    REMOVE_PAYMENT_METHOD(state, methodId) {
      state.paymentMethods = state.paymentMethods.filter(m => m.id !== methodId)
    },
    SET_DEFAULT_PAYMENT(state, methodId) {
      state.paymentMethods = state.paymentMethods.map(m => ({
        ...m,
        isDefault: m.id === methodId
      }))
    },
    SET_LOADING(state, status) {
      state.isLoading = status
    },
    SET_ERROR(state, error) {
      state.error = error
    }
  },

  actions: {
    // Fetch user profile
    async fetchProfile({ commit }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const profile = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '+27 12 345 6789',
          dateOfBirth: '1990-01-01',
          city: 'Johannesburg',
          country: 'South Africa',
          passportNumber: 'AB123456',
          passportExpiry: '2030-12-31',
          avatar: null,
          memberSince: '2026-01-15'
        }
        
        commit('SET_PROFILE', profile)
        return profile
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Update profile
    async updateProfile({ commit }, profileData) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 800))
        
        commit('UPDATE_PROFILE', profileData)
        
        return { success: true }
      } catch (error) {
        commit('SET_ERROR', error.message)
        return { success: false, error: error.message }
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Fetch preferences
    async fetchPreferences({ commit }) {
      try {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 300))
        
        const preferences = {
          airline: '',
          accommodation: 'hostel',
          maxBudget: 1500,
          newsletter: true,
          emailNotifications: true,
          smsAlerts: false,
          language: 'en',
          currency: 'ZAR'
        }
        
        commit('SET_PREFERENCES', preferences)
        return preferences
      } catch (error) {
        console.error('Failed to fetch preferences:', error)
        throw error
      }
    },

    // Update preferences
    async updatePreferences({ commit }, preferences) {
      try {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 400))
        
        commit('SET_PREFERENCES', preferences)
        
        return { success: true }
      } catch (error) {
        return { success: false, error: error.message }
      }
    },

    // Fetch blacklist
    async fetchBlacklist({ commit }) {
      try {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 200))
        
        const blacklist = ['Durban', 'Port Elizabeth']
        commit('SET_BLACKLIST', blacklist)
        return blacklist
      } catch (error) {
        console.error('Failed to fetch blacklist:', error)
        throw error
      }
    },

    // Add to blacklist
    async addToBlacklist({ commit, state }, city) {
      try {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 300))
        
        if (!state.blacklist.includes(city)) {
          commit('ADD_TO_BLACKLIST', city)
        }
        
        return { success: true }
      } catch (error) {
        return { success: false, error: error.message }
      }
    },

    // Remove from blacklist
    async removeFromBlacklist({ commit }, city) {
      try {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 200))
        
        commit('REMOVE_FROM_BLACKLIST', city)
        
        return { success: true }
      } catch (error) {
        return { success: false, error: error.message }
      }
    },

    // Update blacklist
    async updateBlacklist({ commit }, blacklist) {
      try {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 400))
        
        commit('SET_BLACKLIST', blacklist)
        
        return { success: true }
      } catch (error) {
        return { success: false, error: error.message }
      }
    },

    // Fetch wishlist
    async fetchWishlist({ commit }) {
      try {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const wishlist = [
          {
            id: 1,
            name: 'Tokyo',
            country: 'Japan',
            image: '/images/tokyo.jpg',
            price: 1299,
            days: 5,
            rating: 4.8,
            tags: ['Culture', 'Food'],
            addedAt: '2026-02-15T10:30:00Z'
          },
          {
            id: 2,
            name: 'Paris',
            country: 'France',
            image: '/images/paris.jpg',
            price: 999,
            days: 4,
            rating: 4.7,
            tags: ['Romance', 'Art'],
            addedAt: '2026-02-14T14:20:00Z'
          }
        ]
        
        commit('SET_WISHLIST', wishlist)
        return wishlist
      } catch (error) {
        console.error('Failed to fetch wishlist:', error)
        throw error
      }
    },

    // Add to wishlist
    async addToWishlist({ commit }, item) {
      try {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 300))
        
        commit('ADD_TO_WISHLIST', item)
        
        return { success: true }
      } catch (error) {
        return { success: false, error: error.message }
      }
    },

    // Remove from wishlist
    async removeFromWishlist({ commit }, itemId) {
      try {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 200))
        
        commit('REMOVE_FROM_WISHLIST', itemId)
        
        return { success: true }
      } catch (error) {
        return { success: false, error: error.message }
      }
    },

    // Clear wishlist
    async clearWishlist({ commit }) {
      try {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 300))
        
        commit('CLEAR_WISHLIST')
        
        return { success: true }
      } catch (error) {
        return { success: false, error: error.message }
      }
    },

    // Fetch payment methods
    async fetchPaymentMethods({ commit }) {
      try {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 400))
        
        const methods = [
          {
            id: 1,
            type: 'card',
            cardType: 'visa',
            last4: '4242',
            expiryMonth: 12,
            expiryYear: 2028,
            cardholderName: 'John Doe',
            isDefault: true
          },
          {
            id: 2,
            type: 'card',
            cardType: 'mastercard',
            last4: '8888',
            expiryMonth: 8,
            expiryYear: 2027,
            cardholderName: 'John Doe',
            isDefault: false
          }
        ]
        
        commit('SET_PAYMENT_METHODS', methods)
        return methods
      } catch (error) {
        console.error('Failed to fetch payment methods:', error)
        throw error
      }
    },

    // Add payment method
    async addPaymentMethod({ commit }, methodData) {
      try {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 800))
        
        const newMethod = {
          id: Date.now(),
          ...methodData,
          isDefault: false
        }
        
        commit('ADD_PAYMENT_METHOD', newMethod)
        
        return { success: true, method: newMethod }
      } catch (error) {
        return { success: false, error: error.message }
      }
    },

    // Remove payment method
    async removePaymentMethod({ commit, state }, methodId) {
      try {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 400))
        
        const method = state.paymentMethods.find(m => m.id === methodId)
        if (method?.isDefault) {
          throw new Error('Cannot delete default payment method')
        }
        
        commit('REMOVE_PAYMENT_METHOD', methodId)
        
        return { success: true }
      } catch (error) {
        return { success: false, error: error.message }
      }
    },

    // Set default payment method
    async setDefaultPayment({ commit }, methodId) {
      try {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 300))
        
        commit('SET_DEFAULT_PAYMENT', methodId)
        
        return { success: true }
      } catch (error) {
        return { success: false, error: error.message }
      }
    },

    // Upload avatar
    async uploadAvatar({ commit }, file) {
      commit('SET_LOADING', true)
      
      try {
        // Mock upload
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        const avatarUrl = URL.createObjectURL(file)
        commit('UPDATE_PROFILE', { avatar: avatarUrl })
        
        return { success: true, url: avatarUrl }
      } catch (error) {
        return { success: false, error: error.message }
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Clear all user data (logout)
    clearUserData({ commit }) {
      commit('SET_PROFILE', null)
      commit('SET_BLACKLIST', [])
      commit('SET_WISHLIST', [])
      commit('SET_PAYMENT_METHODS', [])
      commit('SET_PREFERENCES', {
        airline: '',
        accommodation: 'hostel',
        maxBudget: 1500,
        newsletter: true,
        emailNotifications: true,
        smsAlerts: false,
        language: 'en',
        currency: 'ZAR'
      })
    }
  }
}