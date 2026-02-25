// stores/bookings.store.js
import api from '@/services/api'

export default {
  namespaced: true,
  
  state: {
    bookings: [],
    currentBooking: null,
    isLoading: false,
    error: null,
    filters: {
      status: 'all',
      dateRange: null,
      search: ''
    },
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      hasMore: false
    }
  },

  getters: {
    allBookings: state => state.bookings,
    upcomingBookings: state => state.bookings.filter(b => 
      (b.status === 'confirmed' || b.status === 'pending') && 
      new Date(b.departure) > new Date()
    ),
    pastBookings: state => state.bookings.filter(b => 
      b.status === 'completed' || 
      (b.status === 'confirmed' && new Date(b.departure) < new Date())
    ),
    cancelledBookings: state => state.bookings.filter(b => b.status === 'cancelled'),
    currentBooking: state => state.currentBooking,
    isLoading: state => state.isLoading,
    error: state => state.error,
    pagination: state => state.pagination,
    
    // Filtered bookings based on current filters
    filteredBookings: (state, getters) => {
      let bookings = [...state.bookings]
      
      // Filter by status
      if (state.filters.status !== 'all') {
        bookings = bookings.filter(b => b.status === state.filters.status)
      }
      
      // Filter by search
      if (state.filters.search) {
        const search = state.filters.search.toLowerCase()
        bookings = bookings.filter(b => 
          b.bookingNumber?.toLowerCase().includes(search) ||
          b.destination?.toLowerCase().includes(search) ||
          b.country?.toLowerCase().includes(search) ||
          b.region?.toLowerCase().includes(search)
        )
      }
      
      return bookings
    }
  },

  mutations: {
    SET_BOOKINGS(state, { bookings, total }) {
      state.bookings = bookings
      state.pagination.total = total || bookings.length
    },
    ADD_BOOKINGS(state, { bookings, total }) {
      state.bookings = [...state.bookings, ...bookings]
      state.pagination.total = total || state.bookings.length
    },
    SET_CURRENT_BOOKING(state, booking) {
      state.currentBooking = booking
    },
    UPDATE_BOOKING(state, updatedBooking) {
      const index = state.bookings.findIndex(b => b.id === updatedBooking.id)
      if (index !== -1) {
        state.bookings[index] = { ...state.bookings[index], ...updatedBooking }
      }
      if (state.currentBooking?.id === updatedBooking.id) {
        state.currentBooking = { ...state.currentBooking, ...updatedBooking }
      }
    },
    REMOVE_BOOKING(state, bookingId) {
      state.bookings = state.bookings.filter(b => b.id !== bookingId)
      if (state.currentBooking?.id === bookingId) {
        state.currentBooking = null
      }
    },
    SET_LOADING(state, status) {
      state.isLoading = status
    },
    SET_ERROR(state, error) {
      state.error = error
    },
    SET_FILTER(state, { key, value }) {
      state.filters[key] = value
    },
    RESET_FILTERS(state) {
      state.filters = {
        status: 'all',
        dateRange: null,
        search: ''
      }
    },
    SET_PAGINATION(state, pagination) {
      state.pagination = { ...state.pagination, ...pagination }
    },
    RESET_PAGINATION(state) {
      state.pagination = {
        page: 1,
        limit: 10,
        total: 0,
        hasMore: false
      }
    },
    CLEAR_CURRENT_BOOKING(state) {
      state.currentBooking = null
    }
  },

  actions: {
    // Fetch all bookings
    async fetchBookings({ commit, state }, { page = 1, limit = 10, filters = {} } = {}) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        // Mock API call - replace with actual
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Mock data
        const mockBookings = [
          {
            id: 1,
            bookingNumber: 'SWT123456',
            destination: 'Tokyo',
            country: 'Japan',
            region: 'Asia',
            image: '/images/tokyo.jpg',
            status: 'confirmed',
            revealed: true,
            departure: '2026-04-15T10:30:00',
            return: '2026-04-22T18:45:00',
            airline: 'Emirates',
            flightNumber: 'EK 1234',
            accommodation: 'Khaosan Tokyo Hostel',
            totalPrice: 1299,
            bookedDate: '2026-02-01T14:30:00Z',
            tags: ['Culture', 'Food', 'City']
          },
          {
            id: 2,
            bookingNumber: 'SWT789012',
            region: 'Asia',
            image: '/images/mystery-asia.jpg',
            status: 'confirmed',
            revealed: false,
            departure: '2026-05-20T14:15:00',
            return: '2026-05-27T09:30:00',
            airline: 'Singapore Airlines',
            accommodation: 'Mystery Hostel',
            totalPrice: 899,
            bookedDate: '2026-02-10T09:15:00Z',
            tags: ['Mystery', 'Adventure']
          },
          {
            id: 3,
            bookingNumber: 'SWT345678',
            destination: 'Cape Town',
            country: 'South Africa',
            region: 'Africa',
            image: '/images/cape-town.jpg',
            status: 'completed',
            revealed: true,
            departure: '2026-01-10T08:00:00',
            return: '2026-01-17T20:15:00',
            airline: 'SAA',
            flightNumber: 'SA 123',
            accommodation: 'Once in Cape Town',
            totalPrice: 799,
            bookedDate: '2025-12-15T11:45:00Z',
            tags: ['Beach', 'Mountain', 'Wine']
          },
          {
            id: 4,
            bookingNumber: 'SWT901234',
            destination: 'Paris',
            country: 'France',
            region: 'Europe',
            image: '/images/paris.jpg',
            status: 'cancelled',
            revealed: true,
            departure: '2026-03-05T12:30:00',
            return: '2026-03-12T16:45:00',
            airline: 'Air France',
            flightNumber: 'AF 1234',
            accommodation: 'Generator Paris',
            totalPrice: 999,
            bookedDate: '2026-01-20T16:20:00Z',
            tags: ['Romance', 'Art', 'Food']
          }
        ]
        
        // Filter by status if provided
        let bookings = [...mockBookings]
        if (filters.status && filters.status !== 'all') {
          bookings = bookings.filter(b => b.status === filters.status)
        }
        
        // Search
        if (filters.search) {
          const search = filters.search.toLowerCase()
          bookings = bookings.filter(b => 
            b.bookingNumber.toLowerCase().includes(search) ||
            (b.destination && b.destination.toLowerCase().includes(search)) ||
            (b.country && b.country.toLowerCase().includes(search))
          )
        }
        
        // Paginate
        const start = (page - 1) * limit
        const paginatedBookings = bookings.slice(start, start + limit)
        
        commit('SET_BOOKINGS', { 
          bookings: paginatedBookings, 
          total: bookings.length 
        })
        commit('SET_PAGINATION', { 
          page, 
          limit, 
          hasMore: start + limit < bookings.length 
        })
        
        return paginatedBookings
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to fetch bookings'
        commit('SET_ERROR', message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Fetch single booking
    async fetchBooking({ commit }, bookingId) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        // Mock API call - replace with actual
        await new Promise(resolve => setTimeout(resolve, 600))
        
        // Mock data
        const booking = {
          id: parseInt(bookingId),
          bookingNumber: 'SWT123456',
          destination: 'Tokyo',
          country: 'Japan',
          region: 'Asia',
          image: '/images/tokyo.jpg',
          status: 'confirmed',
          revealed: true,
          revealDate: '2026-04-13T00:00:00',
          departure: '2026-04-15T10:30:00',
          arrival: '2026-04-15T20:45:00',
          return: '2026-04-22T18:45:00',
          airline: 'Emirates',
          flightNumber: 'EK 1234',
          accommodation: 'Khaosan Tokyo Hostel',
          accommodationType: 'Shared Dorm',
          accommodationAddress: '2-1-1 Asakusa, Taito-ku, Tokyo',
          checkIn: '2026-04-15T15:00:00',
          checkOut: '2026-04-22T11:00:00',
          basePrice: 1249,
          bookingFee: 50,
          totalPrice: 1299,
          paymentMethod: 'Credit Card',
          paymentDate: '2026-02-01',
          bookedDate: '2026-02-01T14:30:00Z',
          duration: '11h 15m',
          passengers: [
            { name: 'John Doe', passport: 'AB123456', dob: '1990-01-01' }
          ],
          tags: ['Culture', 'Food', 'City']
        }
        
        commit('SET_CURRENT_BOOKING', booking)
        return booking
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to fetch booking'
        commit('SET_ERROR', message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Create booking
    async createBooking({ commit }, bookingData) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        const newBooking = {
          id: Date.now(),
          bookingNumber: 'SWT' + Math.random().toString(36).substr(2, 6).toUpperCase(),
          ...bookingData,
          bookedDate: new Date().toISOString(),
          status: 'pending'
        }
        
        commit('UPDATE_BOOKING', newBooking)
        
        return { success: true, booking: newBooking }
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to create booking'
        commit('SET_ERROR', message)
        return { success: false, error: message }
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Update booking
    async updateBooking({ commit }, { id, ...updates }) {
      commit('SET_LOADING', true)
      
      try {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 600))
        
        commit('UPDATE_BOOKING', { id, ...updates })
        
        return { success: true }
      } catch (error) {
        return { success: false, error: error.message }
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Cancel booking
    async cancelBooking({ commit }, bookingId) {
      commit('SET_LOADING', true)
      
      try {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 800))
        
        commit('UPDATE_BOOKING', { 
          id: bookingId, 
          status: 'cancelled' 
        })
        
        return { success: true }
      } catch (error) {
        return { success: false, error: error.message }
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Rebook cancelled booking
    async rebookBooking({ commit }, bookingId) {
      commit('SET_LOADING', true)
      
      try {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 800))
        
        commit('UPDATE_BOOKING', { 
          id: bookingId, 
          status: 'pending',
          bookedDate: new Date().toISOString()
        })
        
        return { success: true }
      } catch (error) {
        return { success: false, error: error.message }
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Download itinerary
    async downloadItinerary({ state }, bookingId) {
      const booking = state.bookings.find(b => b.id === bookingId) || state.currentBooking
      
      if (!booking) {
        throw new Error('Booking not found')
      }
      
      // Generate PDF or file
      console.log('Generating itinerary for:', booking.bookingNumber)
      
      return { success: true }
    },

    // Set filter
    setFilter({ commit }, { key, value }) {
      commit('SET_FILTER', { key, value })
    },

    // Reset filters
    resetFilters({ commit }) {
      commit('RESET_FILTERS')
    },

    // Clear current booking
    clearCurrentBooking({ commit }) {
      commit('CLEAR_CURRENT_BOOKING')
    },

    // Load more bookings (pagination)
    async loadMore({ commit, state, dispatch }) {
      if (!state.pagination.hasMore || state.isLoading) return
      
      const nextPage = state.pagination.page + 1
      await dispatch('fetchBookings', { 
        page: nextPage, 
        limit: state.pagination.limit,
        filters: state.filters
      })
    }
  }
}