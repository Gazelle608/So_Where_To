import { createRouter, createWebHistory } from 'vue-router'
import store from '@/stores'

// Public Views
import HomeView from '@/views/public/HomeView.vue'
import HowItWorksView from '@/views/public/HowItWorksView.vue'
import DestinationsView from '@/views/public/DestinationsView.vue'
import SpinView from '@/views/public/SpinView.vue'
import ContactView from '@/views/public/ContactView.vue'
import LoginView from '@/views/public/LoginView.vue'
import RegisterView from '@/views/public/RegisterView.vue'
import CheckoutView from '@/views/public/CheckoutView.vue'

// Protected Views
import DashboardView from '@/views/protected/DashboardView.vue'
import ProfileView from '@/views/protected/ProfileView.vue'
import BookingsView from '@/views/protected/BookingsView.vue'
import BookingDetailsView from '@/views/protected/BookingDetailsView.vue'
import WishlistView from '@/views/protected/WishlistView.vue'
import CartView from '@/views/protected/CartView.vue'

const routes = [
  // ===== PUBLIC ROUTES =====
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/how-it-works',
    name: 'how-it-works',
    component: HowItWorksView
  },
  {
    path: '/destinations',
    name: 'destinations',
    component: DestinationsView
  },
  {
    path: '/spin',
    name: 'spin',
    component: SpinView
  },
  {
    path: '/contact',
    name: 'contact',
    component: ContactView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { guestOnly: true }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: { guestOnly: true }
  },

  // ===== PROTECTED ROUTES =====
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: { requiresAuth: true }
  },
  {
    path: '/bookings',
    name: 'bookings',
    component: BookingsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/booking/:id',
    name: 'booking-details',
    component: BookingDetailsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/wishlist',
    name: 'wishlist',
    component: WishlistView,
    meta: { requiresAuth: true }
  },
  {
    path: '/cart',
    name: 'cart',
    component: CartView,
    meta: { requiresAuth: true }
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: CheckoutView,
    meta: { requiresAuth: true }
  },

  // 404 - MUST BE LAST
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/public/NotFoundView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters['auth/isAuthenticated']
  
  // Check if route requires auth
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  }
  // Check if route is for guests only
  else if (to.meta.guestOnly && isAuthenticated) {
    next({ name: 'dashboard' })
  }
  else {
    next()
  }
})

export default router
