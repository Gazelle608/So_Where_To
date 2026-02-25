// stores/auth.store.js
import { apiService, apiHelpers } from '@/services/api'

const parseStoredUser = () => {
  try {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const normalizeUser = (user) => {
  if (!user) return null

  const fullName = user.full_name || [user.firstName, user.lastName].filter(Boolean).join(' ').trim()
  const parts = fullName ? fullName.split(' ') : []

  return {
    id: user.id ?? user.user_id ?? null,
    email: user.email || '',
    full_name: fullName || '',
    firstName: user.firstName || parts[0] || '',
    lastName: user.lastName || parts.slice(1).join(' ') || ''
  }
}

export default {
  namespaced: true,
  
  state: {
    user: parseStoredUser(),
    token: localStorage.getItem('token') || null,
    lastActivityAt: Date.now(),
    isLoading: false,
    error: null
  },

  getters: {
    isAuthenticated: state => !!state.token && !!state.user,
    currentUser: state => state.user,
    userInitials: state => {
      if (!state.user) return ''
      if (state.user.firstName) {
        return state.user.firstName.charAt(0).toUpperCase()
      }
      return ''
    },
    authError: state => state.error,
    isLoading: state => state.isLoading
  },

  mutations: {
    SET_USER(state, user) {
      state.user = user
      if (user) {
        localStorage.setItem('user', JSON.stringify(user))
      } else {
        localStorage.removeItem('user')
      }
    },
    SET_TOKEN(state, token) {
      state.token = token
      if (token) {
        localStorage.setItem('token', token)
      } else {
        localStorage.removeItem('token')
      }
    },
    SET_LOADING(state, status) {
      state.isLoading = status
    },
    SET_ERROR(state, error) {
      state.error = error
    },
    SET_LAST_ACTIVITY(state, timestamp) {
      state.lastActivityAt = timestamp
    },
    CLEAR_AUTH(state) {
      state.user = null
      state.token = null
      state.lastActivityAt = Date.now()
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  },

  actions: {
    // Initialize auth on app start
    async init({ commit, dispatch }) {
      const token = localStorage.getItem('token')
      const user = parseStoredUser()
      
      if (token && user) {
        commit('SET_TOKEN', token)
        commit('SET_USER', user)
      }

      if (token) {
        try {
          const response = await apiService.auth.me()
          const normalizedUser = normalizeUser(response.data)
          commit('SET_USER', normalizedUser)
          commit('SET_LAST_ACTIVITY', Date.now())
          await dispatch('fetchCart', null, { root: true })
          await dispatch('user/bootstrap', null, { root: true })
        } catch {
          commit('CLEAR_AUTH')
          await dispatch('clearCart', null, { root: true })
          await dispatch('user/clearUserData', null, { root: true })
        }
      }
    },

    // Register new user
    async register({ commit }, userData) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        const payload = {
          full_name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
          email: userData.email,
          password: userData.password
        }
        await apiService.auth.register(payload)
        return { success: true }
      } catch (error) {
        const message = apiHelpers.getErrorMessage(error)
        commit('SET_ERROR', message)
        return { success: false, error: message }
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Login user
    async login({ commit, dispatch }, credentials) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        const response = await apiService.auth.login(credentials)
        const token = response.data?.token
        const user = normalizeUser(response.data?.user)

        if (!token || !user) {
          throw new Error('Invalid login response from server')
        }

        commit('SET_TOKEN', token)
        commit('SET_USER', user)
        commit('SET_LAST_ACTIVITY', Date.now())
        await dispatch('fetchCart', null, { root: true })
        await dispatch('user/bootstrap', null, { root: true })
        
        return { success: true, user }
      } catch (error) {
        const message = apiHelpers.getErrorMessage(error)
        commit('SET_ERROR', message)
        return { success: false, error: message }
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Logout user
    async logout({ commit, dispatch }) {
      commit('CLEAR_AUTH')
      await dispatch('clearCart', null, { root: true })
      await dispatch('user/clearUserData', null, { root: true })
      return { success: true }
    },

    // Update user profile
    async updateProfile({ commit, state }, profileData) {
      commit('SET_LOADING', true)
      
      try {
        if (!state.user) {
          throw new Error('User not authenticated')
        }

        const updatedUser = normalizeUser({ ...state.user, ...profileData })
        commit('SET_USER', updatedUser)
        
        return { success: true }
      } catch (error) {
        const message = apiHelpers.getErrorMessage(error)
        commit('SET_ERROR', message)
        return { success: false, error: message }
      } finally {
        commit('SET_LOADING', false)
      }
    },

    updateActivity({ commit }) {
      commit('SET_LAST_ACTIVITY', Date.now())
    },

    async checkIdle({ state, dispatch }) {
      const IDLE_TIMEOUT_MS = 2 * 60 * 60 * 1000
      if (Date.now() - state.lastActivityAt > IDLE_TIMEOUT_MS) {
        await dispatch('logout')
      }
    }
  }
}
