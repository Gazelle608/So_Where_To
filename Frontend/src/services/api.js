// services/api.js
import axios from 'axios'

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Request interceptor - adds auth token to every request
api.interceptors.request.use(
  (config) => {
    // Get token from storage (check both localStorage and sessionStorage)
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Log requests in development
    if (import.meta.env.DEV) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, config)
    }
    
    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor - handles errors and token expiration
api.interceptors.response.use(
  (response) => {
    // Log responses in development
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data)
    }
    return response
  },
  async (error) => {
    const originalRequest = error.config
    
    // Log errors in development
    if (import.meta.env.DEV) {
      console.error('❌ Response Error:', {
        url: originalRequest?.url,
        method: originalRequest?.method,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      })
    }
    
    // Handle 401 Unauthorized (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem('refreshToken')
        if (refreshToken) {
          const response = await api.post('/auth/refresh', { refreshToken })
          const { token } = response.data
          
          // Update token in storage
          localStorage.setItem('token', token)
          
          // Update authorization header
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
          originalRequest.headers.Authorization = `Bearer ${token}`
          
          // Retry original request
          return api(originalRequest)
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)
        // Clear auth and redirect to login
        clearAuthAndRedirect()
      }
    }
    
    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      // User doesn't have permission
      window.dispatchEvent(new CustomEvent('app:error', { 
        detail: { type: 'forbidden', message: 'You don\'t have permission to perform this action' }
      }))
    }
    
    // Handle 404 Not Found
    if (error.response?.status === 404) {
      window.dispatchEvent(new CustomEvent('app:error', {
        detail: { type: 'not-found', message: 'Resource not found' }
      }))
    }
    
    // Handle 422 Validation Error
    if (error.response?.status === 422) {
      // Return validation errors to component
      return Promise.reject({
        ...error,
        validationErrors: error.response.data.errors || {}
      })
    }
    
    // Handle 429 Too Many Requests
    if (error.response?.status === 429) {
      window.dispatchEvent(new CustomEvent('app:error', {
        detail: { 
          type: 'rate-limit', 
          message: 'Too many requests. Please try again later.' 
        }
      }))
    }
    
    // Handle 500 Internal Server Error
    if (error.response?.status >= 500) {
      window.dispatchEvent(new CustomEvent('app:error', {
        detail: { 
          type: 'server-error', 
          message: 'Server error. Please try again later.' 
        }
      }))
    }
    
    // Handle network errors
    if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
      window.dispatchEvent(new CustomEvent('app:error', {
        detail: { 
          type: 'network', 
          message: 'Network error. Please check your connection.' 
        }
      }))
    }
    
    return Promise.reject(error)
  }
)

// Helper function to clear auth and redirect
function clearAuthAndRedirect() {
  localStorage.removeItem('token')
  localStorage.removeItem('refreshToken')
  sessionStorage.removeItem('token')
  delete api.defaults.headers.common['Authorization']
  
  // Only redirect if not already on login page
  if (!window.location.pathname.includes('/login')) {
    window.location.href = '/login?session=expired'
  }
}

// API service methods
export const apiService = {
  // Auth endpoints
  auth: {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    logout: () => api.post('/auth/logout'),
    refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
    verifyEmail: (token) => api.post('/auth/verify-email', { token }),
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
    resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
    me: () => api.get('/auth/me'),
    updateProfile: (data) => api.put('/auth/profile', data),
    changePassword: (data) => api.put('/auth/change-password', data)
  },
  
  // User endpoints
  user: {
    getProfile: () => api.get('/user/profile'),
    updateProfile: (data) => api.put('/user/profile', data),
    getPreferences: () => api.get('/user/preferences'),
    updatePreferences: (data) => api.put('/user/preferences', data),
    getBlacklist: () => api.get('/user/blacklist'),
    updateBlacklist: (data) => api.put('/user/blacklist', data),
    getWishlist: () => api.get('/user/wishlist'),
    addToWishlist: (itemId) => api.post('/user/wishlist', { itemId }),
    removeFromWishlist: (itemId) => api.delete(`/user/wishlist/${itemId}`),
    getPaymentMethods: () => api.get('/user/payment-methods'),
    addPaymentMethod: (data) => api.post('/user/payment-methods', data),
    deletePaymentMethod: (methodId) => api.delete(`/user/payment-methods/${methodId}`),
    setDefaultPayment: (methodId) => api.put(`/user/payment-methods/${methodId}/default`),
    uploadAvatar: (formData) => api.post('/user/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  
  // Bookings endpoints
  bookings: {
    getAll: (params) => api.get('/bookings', { params }),
    getOne: (id) => api.get(`/bookings/${id}`),
    create: (data) => api.post('/bookings', data),
    update: (id, data) => api.put(`/bookings/${id}`, data),
    cancel: (id) => api.post(`/bookings/${id}/cancel`),
    rebook: (id) => api.post(`/bookings/${id}/rebook`),
    getItinerary: (id) => api.get(`/bookings/${id}/itinerary`, { responseType: 'blob' })
  },
  
  // Destinations endpoints
  destinations: {
    getAll: (params) => api.get('/destinations', { params }),
    getOne: (id) => api.get(`/destinations/${id}`),
    getFeatured: () => api.get('/destinations/featured'),
    getByRegion: (region) => api.get(`/destinations/region/${region}`),
    search: (query) => api.get('/destinations/search', { params: { q: query } })
  },
  
  // Spin/Offers endpoints
  spin: {
    spin: (params) => api.post('/spin', params),
    accept: (offerId) => api.post(`/spin/${offerId}/accept`),
    decline: (offerId) => api.post(`/spin/${offerId}/decline`),
    getHistory: () => api.get('/spin/history'),
    getStats: () => api.get('/spin/stats')
  },
  
  // Cart endpoints
  cart: {
    get: () => api.get('/cart'),
    add: (item) => api.post('/cart/items', item),
    update: (itemId, quantity) => api.put(`/cart/items/${itemId}`, { quantity }),
    remove: (itemId) => api.delete(`/cart/items/${itemId}`),
    clear: () => api.delete('/cart'),
    checkout: (data) => api.post('/cart/checkout', data)
  },
  
  // Payment endpoints
  payment: {
    process: (data) => api.post('/payment/process', data),
    verify: (paymentId) => api.get(`/payment/verify/${paymentId}`),
    getMethods: () => api.get('/payment/methods')
  },
  
  // Support endpoints
  support: {
    contact: (data) => api.post('/support/contact', data),
    getFAQs: () => api.get('/support/faqs'),
    getHelpTopics: () => api.get('/support/topics')
  },
  
  // Content endpoints
  content: {
    getHowItWorks: () => api.get('/content/how-it-works'),
    getTestimonials: () => api.get('/content/testimonials'),
    getBlogPosts: (params) => api.get('/content/blog', { params }),
    getBlogPost: (slug) => api.get(`/content/blog/${slug}`)
  },
  
  // Admin endpoints (if needed)
  admin: {
    getDashboard: () => api.get('/admin/dashboard'),
    getUsers: (params) => api.get('/admin/users', { params }),
    updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
    getBookings: (params) => api.get('/admin/bookings', { params }),
    getStats: () => api.get('/admin/stats')
  }
}

// Helper methods for common operations
export const apiHelpers = {
  // Check if response is successful
  isSuccess: (response) => response.status >= 200 && response.status < 300,
  
  // Extract error message from response
  getErrorMessage: (error) => {
    return error.response?.data?.message || 
           error.response?.data?.error ||
           error.message ||
           'An unexpected error occurred'
  },
  
  // Get validation errors
  getValidationErrors: (error) => {
    return error.response?.data?.errors || {}
  },
  
  // Format query params
  buildQueryString: (params) => {
    return Object.keys(params)
      .filter(key => params[key] !== null && params[key] !== undefined && params[key] !== '')
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&')
  }
}

// Export default axios instance
export default api