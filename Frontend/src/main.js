// main.js
import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './stores'

// Import global components - UPDATED PATHS
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const app = createApp(App)

// Register global components
app.component('LoadingSpinner', LoadingSpinner)

app.use(store)
app.use(router)

app.mount('#app')