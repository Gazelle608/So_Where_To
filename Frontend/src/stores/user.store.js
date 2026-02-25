import { apiHelpers, apiService } from '@/services/api'

const DEFAULT_PREFERENCES = {
  airline: '',
  accommodation: 'hostel',
  maxBudget: 1500,
  newsletter: true,
  emailNotifications: true,
  smsAlerts: false,
  preferredRegions: []
}

const normalizeProfile = (authUser, profile) => {
  const fullName = authUser?.full_name || [authUser?.firstName, authUser?.lastName].filter(Boolean).join(' ')
  const [firstName = '', ...rest] = (fullName || '').trim().split(' ')
  return {
    firstName,
    lastName: rest.join(' '),
    email: authUser?.email || '',
    phone: profile?.phone || '',
    dateOfBirth: profile?.date_of_birth || '',
    city: profile?.city || '',
    country: profile?.country || '',
    avatar: profile?.avatar_url || '',
    passportNumber: '',
    passportExpiry: ''
  }
}

const normalizePreferences = (preferences) => ({
  ...DEFAULT_PREFERENCES,
  maxBudget: Number(preferences?.budget_max || DEFAULT_PREFERENCES.maxBudget),
  preferredRegions: Array.isArray(preferences?.preferred_regions) ? preferences.preferred_regions : []
})

export default {
  namespaced: true,

  state: {
    profile: null,
    preferences: { ...DEFAULT_PREFERENCES },
    blacklist: [],
    blacklistItems: [],
    isLoading: false,
    error: null
  },

  getters: {
    profile: (state) => state.profile,
    preferences: (state) => state.preferences,
    blacklist: (state) => state.blacklist,
    blacklistItems: (state) => state.blacklistItems,
    isLoading: (state) => state.isLoading,
    error: (state) => state.error
  },

  mutations: {
    SET_LOADING(state, value) {
      state.isLoading = value
    },
    SET_ERROR(state, value) {
      state.error = value
    },
    SET_PROFILE(state, profile) {
      state.profile = profile
    },
    SET_PREFERENCES(state, preferences) {
      state.preferences = { ...state.preferences, ...preferences }
    },
    SET_BLACKLIST_ITEMS(state, items) {
      state.blacklistItems = items
      state.blacklist = items.map((item) => item.name).filter(Boolean)
    },
    CLEAR_USER_DATA(state) {
      state.profile = null
      state.preferences = { ...DEFAULT_PREFERENCES }
      state.blacklist = []
      state.blacklistItems = []
      state.error = null
    }
  },

  actions: {
    async bootstrap({ dispatch, rootGetters }) {
      if (!rootGetters['auth/isAuthenticated']) return
      await Promise.all([
        dispatch('fetchProfile'),
        dispatch('fetchPreferences'),
        dispatch('fetchBlacklist')
      ])
    },

    async fetchProfile({ commit, rootGetters }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const authUser = rootGetters['auth/currentUser'] || {}
        const response = await apiService.user.getProfile()
        const profile = normalizeProfile(authUser, response.data || {})
        commit('SET_PROFILE', profile)
        return profile
      } catch (error) {
        const message = apiHelpers.getErrorMessage(error)
        commit('SET_ERROR', message)
        return null
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async updateProfile({ commit, state, dispatch }, form) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        await apiService.user.updateProfile({
          phone: form.phone || null,
          date_of_birth: form.dob || null,
          country: form.country || null,
          city: form.city || null,
          avatar_url: state.profile?.avatar || null
        })

        commit('SET_PROFILE', {
          ...(state.profile || {}),
          firstName: form.firstName || '',
          lastName: form.lastName || '',
          phone: form.phone || '',
          dateOfBirth: form.dob || '',
          city: form.city || '',
          country: form.country || ''
        })

        await dispatch('auth/updateProfile', { firstName: form.firstName, lastName: form.lastName }, { root: true })
        return { success: true }
      } catch (error) {
        const message = apiHelpers.getErrorMessage(error)
        commit('SET_ERROR', message)
        return { success: false, error: message }
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async fetchPreferences({ commit }) {
      commit('SET_ERROR', null)
      try {
        const response = await apiService.user.getPreferences()
        const preferences = normalizePreferences(response.data || {})
        commit('SET_PREFERENCES', preferences)
        return preferences
      } catch (error) {
        const message = apiHelpers.getErrorMessage(error)
        commit('SET_ERROR', message)
        return null
      }
    },

    async updatePreferences({ commit }, preferences) {
      commit('SET_ERROR', null)
      try {
        await apiService.user.updatePreferences({
          budget_min: 799,
          budget_max: preferences.maxBudget,
          preferred_duration_days: null,
          preferred_regions: preferences.preferredRegions || []
        })
        commit('SET_PREFERENCES', preferences)
        return { success: true }
      } catch (error) {
        const message = apiHelpers.getErrorMessage(error)
        commit('SET_ERROR', message)
        return { success: false, error: message }
      }
    },

    async fetchBlacklist({ commit }) {
      commit('SET_ERROR', null)
      try {
        const response = await apiService.user.getBlacklist()
        const items = Array.isArray(response.data) ? response.data : []
        commit('SET_BLACKLIST_ITEMS', items)
        return items
      } catch (error) {
        const message = apiHelpers.getErrorMessage(error)
        commit('SET_ERROR', message)
        return []
      }
    },

    async addToBlacklist({ dispatch }, destination) {
      const destinationId = destination?.destination_id ?? destination?.id
      if (!destinationId) return { success: false, error: 'Destination id is required' }
      try {
        await apiService.user.addToBlacklist({ destination_id: destinationId })
        await dispatch('fetchBlacklist')
        return { success: true }
      } catch (error) {
        return { success: false, error: apiHelpers.getErrorMessage(error) }
      }
    },

    async removeFromBlacklist({ state, dispatch }, cityName) {
      const item = state.blacklistItems.find((entry) => entry.name === cityName)
      if (!item?.destination_id) return { success: false, error: 'Blacklist entry not found' }
      try {
        await apiService.user.removeFromBlacklist(item.destination_id)
        await dispatch('fetchBlacklist')
        return { success: true }
      } catch (error) {
        return { success: false, error: apiHelpers.getErrorMessage(error) }
      }
    },

    clearUserData({ commit }) {
      commit('CLEAR_USER_DATA')
    }
  }
}
