import { apiService, apiHelpers } from '@/services/api'

const toNumber = (value, fallback = 0) => {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

const normalizeDestination = (row) => ({
  id: row.destination_id ?? row.id,
  destination_id: row.destination_id ?? row.id,
  city: row.name || row.city || 'Unknown',
  name: row.name || row.city || 'Unknown',
  country: row.country || '',
  region: row.region || '',
  image: row.image_url || row.image || '',
  image_url: row.image_url || row.image || '',
  price: toNumber(row.price, 0),
  days: toNumber(row.days, 0),
  rating: toNumber(row.rating, 0),
  revealed: typeof row.revealed === 'undefined' ? true : Boolean(row.revealed),
  is_featured: typeof row.is_featured === 'undefined' ? false : Boolean(row.is_featured),
  tags: Array.isArray(row.tags) ? row.tags.filter(Boolean) : []
})

const normalizeCartItem = (row) => ({
  id: row.cart_item_id ?? row.id ?? row.destination_id,
  cart_item_id: row.cart_item_id ?? row.id ?? null,
  destination_id: row.destination_id ?? row.id ?? null,
  destination: row.name || row.destination || 'Mystery Destination',
  name: row.name || row.destination || 'Mystery Destination',
  image: row.image_url || row.image || '',
  image_url: row.image_url || row.image || '',
  region: row.region || '',
  country: row.country || '',
  quantity: toNumber(row.quantity, 1),
  price: toNumber(row.unit_price ?? row.unitPrice ?? row.price, 0),
  unit_price: toNumber(row.unit_price ?? row.unitPrice ?? row.price, 0),
  revealed: typeof row.revealed === 'undefined' ? true : Boolean(row.revealed),
  airline: row.airline || 'TBD',
  hostel: row.hostel || 'TBD',
  departure: row.departure || null,
  return: row.return || null
})

export default {
  state: {
    destinations: [],
    cartItems: [],
    isLoading: false,
    error: null
  },

  getters: {
    destinations: (state) => state.destinations,
    destinationsLoading: (state) => state.isLoading,
    destinationsError: (state) => state.error,
    cartItems: (state) => state.cartItems,
    cartCount: (state) => state.cartItems.reduce((sum, item) => sum + toNumber(item.quantity, 0), 0),
    cartTotal: (state) => state.cartItems.reduce((sum, item) => {
      return sum + toNumber(item.price, 0) * toNumber(item.quantity, 0)
    }, 0)
  },

  mutations: {
    SET_DESTINATIONS(state, destinations) {
      state.destinations = destinations
    },
    SET_CART_ITEMS(state, items) {
      state.cartItems = items
    },
    SET_CART_LOADING(state, value) {
      state.isLoading = value
    },
    SET_CART_ERROR(state, value) {
      state.error = value
    }
  },

  actions: {
    async fetchDestinations({ commit }, params = {}) {
      commit('SET_CART_LOADING', true)
      commit('SET_CART_ERROR', null)
      try {
        const response = await apiService.destinations.getAll(params)
        const data = Array.isArray(response.data) ? response.data : []
        commit('SET_DESTINATIONS', data.map(normalizeDestination))
      } catch (error) {
        commit('SET_CART_ERROR', apiHelpers.getErrorMessage(error))
      } finally {
        commit('SET_CART_LOADING', false)
      }
    },

    async fetchCart({ commit, rootGetters }) {
      if (!rootGetters['auth/isAuthenticated']) {
        commit('SET_CART_ITEMS', [])
        return
      }
      commit('SET_CART_LOADING', true)
      commit('SET_CART_ERROR', null)
      try {
        const response = await apiService.cart.get()
        const data = Array.isArray(response.data) ? response.data : []
        commit('SET_CART_ITEMS', data.map(normalizeCartItem))
      } catch (error) {
        commit('SET_CART_ERROR', apiHelpers.getErrorMessage(error))
      } finally {
        commit('SET_CART_LOADING', false)
      }
    },

    async addToCart({ dispatch, commit, rootGetters }, item) {
      if (!rootGetters['auth/isAuthenticated']) {
        commit('SET_CART_ERROR', 'Please log in to add items to cart')
        return { success: false, error: 'Please log in to add items to cart' }
      }

      const payload = {
        destination_id: item.destination_id ?? item.id,
        quantity: toNumber(item.quantity, 1),
        unit_price: toNumber(item.unit_price ?? item.price, 0)
      }

      if (!payload.destination_id || payload.unit_price <= 0) {
        commit('SET_CART_ERROR', 'Invalid cart item data')
        return { success: false, error: 'Invalid cart item data' }
      }

      try {
        await apiService.cart.add(payload)
        await dispatch('fetchCart')
        return { success: true }
      } catch (error) {
        const message = apiHelpers.getErrorMessage(error)
        commit('SET_CART_ERROR', message)
        return { success: false, error: message }
      }
    },

    async updateCartQuantity({ dispatch, commit, rootGetters }, { id, quantity }) {
      if (!rootGetters['auth/isAuthenticated']) return
      try {
        await apiService.cart.update(id, quantity)
        await dispatch('fetchCart')
      } catch (error) {
        commit('SET_CART_ERROR', apiHelpers.getErrorMessage(error))
      }
    },

    async removeFromCart({ dispatch, commit, rootGetters }, id) {
      if (!rootGetters['auth/isAuthenticated']) return
      try {
        await apiService.cart.remove(id)
        await dispatch('fetchCart')
      } catch (error) {
        commit('SET_CART_ERROR', apiHelpers.getErrorMessage(error))
      }
    },

    async clearCart({ commit, rootGetters }) {
      if (!rootGetters['auth/isAuthenticated']) {
        commit('SET_CART_ITEMS', [])
        return
      }
      try {
        await apiService.cart.clear()
      } catch {
        // Keep UI consistent even if API fails
      }
      commit('SET_CART_ITEMS', [])
    },

    async checkout({ dispatch, commit, rootGetters }, payload = {}) {
      if (!rootGetters['auth/isAuthenticated']) {
        commit('SET_CART_ERROR', 'Please log in to checkout')
        return { success: false }
      }
      try {
        const response = await apiService.cart.checkout(payload)
        await dispatch('fetchCart')
        return { success: true, data: response.data }
      } catch (error) {
        const message = apiHelpers.getErrorMessage(error)
        commit('SET_CART_ERROR', message)
        return { success: false, error: message }
      }
    }
  }
}
