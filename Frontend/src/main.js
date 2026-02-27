// main.js
import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './stores'

// Import global components
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const initApp = async () => {
  const app = createApp(App)

  // Register global components
  app.component('LoadingSpinner', LoadingSpinner)

  app.use(store)
  app.use(router)

  try {
    // We dispatch the init but wait for it inside this function 
    // to ensure the app mounts only when the DOM and Store are ready.
    await store.dispatch('init')
  } catch (error) {
    console.error("Store initialization failed:", error)
  }

  app.mount('#app')
}

initApp()