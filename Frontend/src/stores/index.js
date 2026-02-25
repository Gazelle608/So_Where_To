// stores/index.js
import { createStore } from 'vuex'
import auth from './auth.store'
import cart from './cart.store'
import user from './user.store'

const store = createStore({
  modules: {
    auth,
    cart,
    user
  },
  
  state: {
    isDarkMode: localStorage.getItem('darkMode') === 'true' || false,
    notification: {
      show: false,
      message: '',
      type: 'info'
    }
  },

  mutations: {
    TOGGLE_THEME(state) {
      state.isDarkMode = !state.isDarkMode
      localStorage.setItem('darkMode', state.isDarkMode)
      if (state.isDarkMode) {
        document.documentElement.classList.add('dark-mode')
      } else {
        document.documentElement.classList.remove('dark-mode')
      }
    },
    
    SHOW_NOTIFICATION(state, { message, type = 'info' }) {
      state.notification = { show: true, message, type }
      setTimeout(() => {
        state.notification.show = false
      }, 3000)
    },
    
    HIDE_NOTIFICATION(state) {
      state.notification.show = false
    }
  },

  actions: {
    async init({ dispatch }) {
      await dispatch('auth/init')
      await dispatch('fetchDestinations')
      await dispatch('fetchCart')
    }
  },

  getters: {
    isDarkMode: state => state.isDarkMode,
    notification: state => state.notification
  }
})

export default store
