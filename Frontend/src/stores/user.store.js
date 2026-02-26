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
    filter: [],
    filterItems: [],
    isLoading: false,
    error: null
  },

  getters: {
    profile: (state) => state.profile,
    preferences: (state) => state.preferences,
    filter: (state) => state.filter,
    filterItems: (state) => state.filterItems,
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
    SET_FILTER_ITEMS(state, items) {
      state.filterItems = items
      state.filter = items.map((item) => item.name).filter(Boolean)
    },
    CLEAR_USER_DATA(state) {
      state.profile = null
      state.preferences = { ...DEFAULT_PREFERENCES }
      state.filter = []
      state.filterItems = []
      state.error = null
    }
  },

  actions: {
    async bootstrap({ dispatch, rootGetters }) {
      if (!rootGetters['auth/isAuthenticated']) return
      await Promise.all([
        dispatch('fetchProfile'),
        dispatch('fetchPreferences'),
        dispatch('fetchFilters')
      ])
    },

    async fetchFilters({ commit }) {
      commit('SET_ERROR', null)
      try {
        const response = await apiService.user.getFilters()
        const items = Array.isArray(response.data) ? response.data : []
        commit('SET_FILTER_ITEMS', items)
        return items
      } catch (error) {
        const message = apiHelpers.getErrorMessage(error)
        commit('SET_ERROR', message)
        return []
      }
    },

    async addFilter({ dispatch }, destination) {
      const destinationId = destination?.destination_id ?? destination?.id
      if (!destinationId)
        return { success: false, error: 'Destination id is required' }

      try {
        await apiService.user.addFilter({ destination_id: destinationId })
        await dispatch('fetchFilters')
        return { success: true }
      } catch (error) {
        return { success: false, error: apiHelpers.getErrorMessage(error) }
      }
    },

    async removeFilter({ state, dispatch }, cityName) {
      const item = state.filterItems.find(
        (entry) => entry.name === cityName
      )

      if (!item?.destination_id)
        return { success: false, error: 'Filter entry not found' }

      try {
        await apiService.user.removeFilter(item.destination_id)
        await dispatch('fetchFilters')
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