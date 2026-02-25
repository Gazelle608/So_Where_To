// router/routes.js
import store from '@/stores'

// Public Views (Lazy loaded for better performance)
const HomeView = () => import('@/views/public/HomeView.vue')
const HowItWorksView = () => import('@/views/public/HowItWorksView.vue')
const DestinationsView = () => import('@/views/public/DestinationsView.vue')
const SpinView = () => import('@/views/public/SpinView.vue')
const LoginView = () => import('@/views/public/LoginView.vue')
const RegisterView = () => import('@/views/public/RegisterView.vue')
const NotFoundView = () => import('@/views/public/NotFoundView.vue')

// Protected Views (Lazy loaded)
const DashboardView = () => import('@/views/protected/DashboardView.vue')
const BookingsView = () => import('@/views/protected/BookingsView.vue')
const BookingDetailsView = () => import('@/views/protected/BookingDetailsView.vue')
const ProfileView = () => import('@/views/protected/ProfileView.vue')
const WishlistView = () => import('@/views/protected/WishlistView.vue')
const CartView = () => import('@/views/protected/CartView.vue')
const CheckoutView = () => import('@/views/protected/CheckoutView.vue')

// Static Pages
// const ContactView = () => import('@/views/static/ContactView.vue')
// const FAQView = () => import('@/views/static/FAQView.vue')
// const TermsView = () => import('@/views/static/TermsView.vue')
// const PrivacyView = () => import('@/views/static/PrivacyView.vue')
// const CookiesView = () => import('@/views/static/CookiesView.vue')

// Route configuration
export const routes = [
  // ===== PUBLIC ROUTES =====
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: 'So Where To? - Mystery Travel Adventures',
      description: 'Book mystery travel bundles worldwide. Flights + accommodation included. Destination revealed after purchase.',
      requiresAuth: false,
      layout: 'default'
    }
  },
  {
    path: '/how-it-works',
    name: 'how-it-works',
    component: HowItWorksView,
    meta: {
      title: 'How It Works - So Where To?',
      description: 'Learn how mystery travel works in three simple steps. Spin, book, reveal - your adventure awaits!',
      requiresAuth: false,
      layout: 'default'
    }
  },
  {
    path: '/destinations',
    name: 'destinations',
    component: DestinationsView,
    meta: {
      title: 'Destinations - So Where To?',
      description: 'Explore possible mystery destinations around the world. From Tokyo to Cape Town, the world is your mystery box.',
      requiresAuth: false,
      layout: 'default'
    }
  },
  {
    path: '/spin',
    name: 'spin',
    component: SpinView,
    meta: {
      title: 'Spin the Globe - So Where To?',
      description: 'Spin the globe and let fate decide your next adventure. Mystery destinations with flights and accommodation included.',
      requiresAuth: false,
      layout: 'default'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: {
      title: 'Login - So Where To?',
      description: 'Sign in to your account to manage bookings and spin the globe.',
      requiresAuth: false,
      guestOnly: true,
      layout: 'auth'
    }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: {
      title: 'Register - So Where To?',
      description: 'Create an account to start your mystery travel journey.',
      requiresAuth: false,
      guestOnly: true,
      layout: 'auth'
    }
  },
  // {
  //   path: '/forgot-password',
  //   name: 'forgot-password',
  //   component: () => import('@/views/public/ForgotPasswordView.vue'),
  //   meta: {
  //     title: 'Forgot Password - So Where To?',
  //     description: 'Reset your password',
  //     requiresAuth: false,
  //     guestOnly: true,
  //     layout: 'auth'
  //   }
  // },
  // {
  //   path: '/reset-password/:token',
  //   name: 'reset-password',
  //   component: () => import('@/views/public/ResetPasswordView.vue'),
  //   meta: {
  //     title: 'Reset Password - So Where To?',
  //     description: 'Set a new password',
  //     requiresAuth: false,
  //     guestOnly: true,
  //     layout: 'auth'
  //   }
  // },
  // {
  //   path: '/verify-email/:token',
  //   name: 'verify-email',
  //   component: () => import('@/views/public/VerifyEmailView.vue'),
  //   meta: {
  //     title: 'Verify Email - So Where To?',
  //     description: 'Verify your email address',
  //     requiresAuth: false,
  //     layout: 'auth'
  //   }
  // },

  // PROTECTED ROUTES (Auth Required)
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: {
      title: 'Dashboard - So Where To?',
      description: 'Your personal travel dashboard',
      requiresAuth: true,
      layout: 'default'
    }
  },
  {
    path: '/bookings',
    name: 'bookings',
    component: BookingsView,
    meta: {
      title: 'My Bookings - So Where To?',
      description: 'View and manage your mystery travel bookings',
      requiresAuth: true,
      layout: 'default'
    }
  },
  {
    path: '/booking/:id',
    name: 'booking-details',
    component: BookingDetailsView,
    meta: {
      title: 'Booking Details - So Where To?',
      description: 'View your booking details',
      requiresAuth: true,
      layout: 'default'
    },
    props: true
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: {
      title: 'My Profile - So Where To?',
      description: 'Manage your profile and preferences',
      requiresAuth: true,
      layout: 'default'
    }
  },
  {
    path: '/wishlist',
    name: 'wishlist',
    component: WishlistView,
    meta: {
      title: 'My Wishlist - So Where To?',
      description: 'Your saved destinations',
      requiresAuth: true,
      layout: 'default'
    }
  },
  {
    path: '/cart',
    name: 'cart',
    component: CartView,
    meta: {
      title: 'Shopping Cart - So Where To?',
      description: 'Review your mystery bookings',
      requiresAuth: true,
      layout: 'default'
    }
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: CheckoutView,
    meta: {
      title: 'Checkout - So Where To?',
      description: 'Complete your booking',
      requiresAuth: true,
      layout: 'checkout'
    }
  },
  // {
  //   path: '/checkout/success',
  //   name: 'checkout-success',
  //   component: () => import('@/views/protected/CheckoutSuccessView.vue'),
  //   meta: {
  //     title: 'Booking Confirmed! - So Where To?',
  //     description: 'Your mystery adventure is booked',
  //     requiresAuth: true,
  //     layout: 'default'
  //   }
  // },
  // {
  //   path: '/payment/:id',
  //   name: 'payment',
  //   component: () => import('@/views/protected/PaymentView.vue'),
  //   meta: {
  //     title: 'Payment - So Where To?',
  //     description: 'Complete your payment',
  //     requiresAuth: true,
  //     layout: 'checkout'
  //   }
  // },

  // STATIC PAGES
  // {
  //   path: '/contact',
  //   name: 'contact',
  //   component: ContactView,
  //   meta: {
  //     title: 'Contact Us - So Where To?',
  //     description: 'Get in touch with our support team',
  //     requiresAuth: false,
  //     layout: 'default'
  //   }
  // },
  // {
  //   path: '/faq',
  //   name: 'faq',
  //   component: FAQView,
  //   meta: {
  //     title: 'FAQ - So Where To?',
  //     description: 'Frequently asked questions about mystery travel',
  //     requiresAuth: false,
  //     layout: 'default'
  //   }
  // },
  // {
  //   path: '/terms',
  //   name: 'terms',
  //   component: TermsView,
  //   meta: {
  //     title: 'Terms of Service - So Where To?',
  //     description: 'Our terms and conditions',
  //     requiresAuth: false,
  //     layout: 'default'
  //   }
  // },
  // {
  //   path: '/privacy',
  //   name: 'privacy',
  //   component: PrivacyView,
  //   meta: {
  //     title: 'Privacy Policy - So Where To?',
  //     description: 'How we handle your data',
  //     requiresAuth: false,
  //     layout: 'default'
  //   }
  // },
  // {
  //   path: '/cookies',
  //   name: 'cookies',
  //   component: CookiesView,
  //   meta: {
  //     title: 'Cookie Policy - So Where To?',
  //     description: 'How we use cookies',
  //     requiresAuth: false,
  //     layout: 'default'
  //   }
  // },

  // REDIRECTS
  {
    path: '/support',
    redirect: '/contact'
  },
  {
    path: '/help',
    redirect: '/faq'
  },
  {
    path: '/my-account',
    redirect: '/profile'
  },
  {
    path: '/trips',
    redirect: '/bookings'
  },

  // 404 ROUTE (must be last)
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
    meta: {
      title: 'Page Not Found - So Where To?',
      description: 'The page you are looking for does not exist',
      requiresAuth: false,
      layout: 'default'
    }
  }
]

// Helper function to get route by name
export const getRouteByName = (name) => {
  return routes.find(route => route.name === name)
}

// Helper function to check if route exists
export const routeExists = (path) => {
  return routes.some(route => route.path === path)
}

// Group routes by meta properties
export const getRoutesByMeta = (key, value) => {
  return routes.filter(route => route.meta && route.meta[key] === value)
}

// Public routes (no auth required)
export const publicRoutes = getRoutesByMeta('requiresAuth', false)

// Protected routes (auth required)
export const protectedRoutes = getRoutesByMeta('requiresAuth', true)

// Guest only routes (login/register)
export const guestOnlyRoutes = getRoutesByMeta('guestOnly', true)

// Routes with specific layouts
export const getRoutesByLayout = (layout) => {
  return routes.filter(route => route.meta?.layout === layout)
}