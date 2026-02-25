// stores/auth.store.js
export default {
  namespaced: true,
  
  state: {
    user: null,
    token: localStorage.getItem('token') || null,
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
    CLEAR_AUTH(state) {
      state.user = null
      state.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  },

  actions: {
    // Initialize auth on app start
    async init({ commit, dispatch }) {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')
      
      if (token && user) {
        commit('SET_TOKEN', token)
        commit('SET_USER', JSON.parse(user))
      }
    },

    // Register new user
    async register({ commit }, userData) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        // Check if user already exists in localStorage
        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]')
        const userExists = existingUsers.some(u => u.email === userData.email)
        
        if (userExists) {
          throw new Error('User with this email already exists')
        }

        // Create new user
        const newUser = {
          id: Date.now().toString(),
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phone: userData.phone || '',
          city: userData.city || '',
          createdAt: new Date().toISOString()
        }

        // Save to "database" (localStorage)
        existingUsers.push({
          ...newUser,
          password: userData.password // In real app, this would be hashed
        })
        localStorage.setItem('users', JSON.stringify(existingUsers))

        // Auto login after registration (optional - you can remove this if you want manual login)
        commit('SET_USER', newUser)
        commit('SET_TOKEN', 'temp-token-' + Date.now()) // In real app, this would be JWT
        
        return { success: true, user: newUser }
      } catch (error) {
        commit('SET_ERROR', error.message)
        return { success: false, error: error.message }
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Login user
    async login({ commit }, credentials) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        // Get users from "database"
        const users = JSON.parse(localStorage.getItem('users') || '[]')
        
        // Find user
        const user = users.find(u => 
          u.email === credentials.email && u.password === credentials.password
        )
        
        if (!user) {
          throw new Error('Invalid email or password')
        }

        // Remove password from user object before storing
        const { password, ...userWithoutPassword } = user

        // Set auth state
        commit('SET_USER', userWithoutPassword)
        commit('SET_TOKEN', 'auth-token-' + Date.now()) // In real app, this would be JWT
        
        return { success: true, user: userWithoutPassword }
      } catch (error) {
        commit('SET_ERROR', error.message)
        return { success: false, error: error.message }
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Logout user
    async logout({ commit }) {
      commit('CLEAR_AUTH')
      return { success: true }
    },

    // Update user profile
    async updateProfile({ commit, state }, profileData) {
      commit('SET_LOADING', true)
      
      try {
        const users = JSON.parse(localStorage.getItem('users') || '[]')
        const userIndex = users.findIndex(u => u.id === state.user.id)
        
        if (userIndex === -1) {
          throw new Error('User not found')
        }

        // Update user
        const updatedUser = { ...users[userIndex], ...profileData }
        users[userIndex] = updatedUser
        localStorage.setItem('users', JSON.stringify(users))

        // Update current user (remove password)
        const { password, ...userWithoutPassword } = updatedUser
        commit('SET_USER', userWithoutPassword)
        
        return { success: true }
      } catch (error) {
        commit('SET_ERROR', error.message)
        return { success: false, error: error.message }
      } finally {
        commit('SET_LOADING', false)
      }
    }
  }
}