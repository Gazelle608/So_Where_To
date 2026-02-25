<template>
  <header class="app-header" :class="{ scrolled: isScrolled }">
    <div class="container">
      <div class="header-content">
        <!-- Logo -->
        <router-link to="/" class="logo">
          <!-- <img src="/images/logo.png" alt="So Where To?" class="logo-img"> -->
          <span class="logo-text">So Where To?</span>
        </router-link>

        <!-- Desktop Navigation -->
        <nav class="desktop-nav">
          <router-link to="/" class="nav-link" :class="{ active: isActive('/') }">
            Home
          </router-link>
          <router-link to="/how-it-works" class="nav-link" :class="{ active: isActive('/how-it-works') }">
            How It Works
          </router-link>
          <router-link to="/spin" class="nav-link" :class="{ active: isActive('/spin') }">
            Spin the Globe
          </router-link>
          <router-link to="/destinations" class="nav-link" :class="{ active: isActive('/destinations') }">
            Destinations
          </router-link>
          <router-link to="/contact" class="nav-link" :class="{ active: isActive('/contact') }">
            Contact
          </router-link>
        </nav>

        <!-- Right Side Actions -->
        <div class="header-actions">
          <!-- Show when logged in -->
          <template v-if="isAuthenticated">
            <!-- Cart -->
            <router-link to="/cart" class="icon-btn">
              <svg class="icon" viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
              <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
            </router-link>

            <!-- User Menu -->
            <div class="user-menu" ref="userMenu">
              <button class="user-menu-btn" @click="toggleUserMenu">
                <div class="user-avatar">
                  {{ userInitials }}
                </div>
                <span class="user-name">{{ userFullName }}</span>
                <svg class="dropdown-icon" :class="{ rotated: userMenuOpen }" viewBox="0 0 24 24" width="16" height="16">
                  <path fill="currentColor" d="M7 10l5 5 5-5z"/>
                </svg>
              </button>

              <!-- Dropdown Menu -->
              <div v-if="userMenuOpen" class="user-dropdown">
                <router-link to="/dashboard" class="dropdown-item" @click="userMenuOpen = false">
                  <svg class="dropdown-icon" viewBox="0 0 24 24" width="18" height="18">
                    <path fill="currentColor" d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                  </svg>
                  <span>Dashboard</span>
                </router-link>
                <router-link to="/profile" class="dropdown-item" @click="userMenuOpen = false">
                  <svg class="dropdown-icon" viewBox="0 0 24 24" width="18" height="18">
                    <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                  </svg>
                  <span>Profile</span>
                </router-link>
                <router-link to="/bookings" class="dropdown-item" @click="userMenuOpen = false">
                  <svg class="dropdown-icon" viewBox="0 0 24 24" width="18" height="18">
                    <path fill="currentColor" d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                  </svg>
                  <span>Bookings</span>
                </router-link>
                <div class="dropdown-divider"></div>
                <button class="dropdown-item" @click="logout">
                  <svg class="dropdown-icon" viewBox="0 0 24 24" width="18" height="18">
                    <path fill="currentColor" d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </template>

          <!-- Show when logged out -->
          <template v-else>
            <router-link to="/login" class="btn btn-outline">Login</router-link>
            <router-link to="/register" class="btn btn-primary">Sign Up</router-link>
          </template>

          <!-- Mobile Menu Toggle -->
          <button class="mobile-menu-toggle" @click="toggleMobileMenu">
            <svg class="menu-icon" viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <transition name="slide">
        <div v-if="mobileMenuOpen" class="mobile-nav">
          <router-link to="/" class="mobile-nav-link" @click="mobileMenuOpen = false">
            Home
          </router-link>
          <router-link to="/how-it-works" class="mobile-nav-link" @click="mobileMenuOpen = false">
            How It Works
          </router-link>
          <router-link to="/spin" class="mobile-nav-link" @click="mobileMenuOpen = false">
            Spin the Globe
          </router-link>
          <router-link to="/destinations" class="mobile-nav-link" @click="mobileMenuOpen = false">
            Destinations
          </router-link>
          <router-link to="/contact" class="mobile-nav-link" @click="mobileMenuOpen = false">
            Contact
          </router-link>
          <div class="mobile-nav-divider"></div>
          <template v-if="!isAuthenticated">
            <router-link to="/login" class="mobile-nav-link" @click="mobileMenuOpen = false">
              Login
            </router-link>
            <router-link to="/register" class="mobile-nav-link" @click="mobileMenuOpen = false">
              Sign Up
            </router-link>
          </template>
        </div>
      </transition>
    </div>
  </header>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
  name: 'AppHeader',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    
    const isScrolled = ref(false)
    const mobileMenuOpen = ref(false)
    const userMenuOpen = ref(false)
    const userMenu = ref(null)

    // Computed
    const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])
    const user = computed(() => store.state.auth.user || {})
    const userFullName = computed(() => {
      if (user.value.firstName && user.value.lastName) {
        return `${user.value.firstName} ${user.value.lastName}`
      }
      return user.value.firstName || 'User'
    })
    const userInitials = computed(() => {
      if (user.value.firstName) {
        return user.value.firstName.charAt(0).toUpperCase()
      }
      return 'U'
    })
    const cartCount = computed(() => 0) // Replace with actual cart count

    // Methods
    const handleScroll = () => {
      isScrolled.value = window.scrollY > 50
    }

    const toggleMobileMenu = () => {
      mobileMenuOpen.value = !mobileMenuOpen.value
    }

    const toggleUserMenu = () => {
      userMenuOpen.value = !userMenuOpen.value
    }

    const handleClickOutside = (event) => {
      if (userMenu.value && !userMenu.value.contains(event.target)) {
        userMenuOpen.value = false
      }
    }

    const logout = async () => {
      await store.dispatch('auth/logout')
      router.push('/')
      userMenuOpen.value = false
    }

    const isActive = (path) => {
      return route.path === path
    }

    onMounted(() => {
      window.addEventListener('scroll', handleScroll)
      document.addEventListener('click', handleClickOutside)
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('click', handleClickOutside)
    })

    return {
      isScrolled,
      mobileMenuOpen,
      userMenuOpen,
      userMenu,
      isAuthenticated,
      userFullName,
      userInitials,
      cartCount,
      toggleMobileMenu,
      toggleUserMenu,
      logout,
      isActive
    }
  }
}
</script>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: all 0.3s;
}

.app-header.scrolled {
  box-shadow: 0 5px 20px rgba(0,0,0,0.15);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}

.logo-img {
  height: 40px;
  width: auto;
}

.logo-text {
  font-size: 1.3rem;
  font-weight: 700;
  color: #333;
}

/* Desktop Navigation */
.desktop-nav {
  display: flex;
  gap: 30px;
}

@media (max-width: 768px) {
  .desktop-nav {
    display: none;
  }
}

.nav-link {
  color: #666;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
  font-size: 1rem;
}

.nav-link:hover {
  color: #FF6B6B;
}

.nav-link.active {
  color: #FF6B6B;
  font-weight: 600;
}

/* Header Actions */
.header-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* Icon Button */
.icon-btn {
  position: relative;
  color: #666;
  transition: color 0.3s;
  display: flex;
  align-items: center;
}

.icon-btn:hover {
  color: #FF6B6B;
}

.icon {
  width: 24px;
  height: 24px;
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #FF6B6B;
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  min-width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}

/* User Menu */
.user-menu {
  position: relative;
}

.user-menu-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 30px;
  transition: background 0.3s;
}

.user-menu-btn:hover {
  background: #f5f5f5;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #FF6B6B;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
}

.user-name {
  font-weight: 500;
  color: #333;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-icon {
  transition: transform 0.3s;
}

.dropdown-icon.rotated {
  transform: rotate(180deg);
}

/* User Dropdown */
.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 10px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.15);
  min-width: 200px;
  z-index: 100;
  overflow: hidden;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  color: #333;
  text-decoration: none;
  transition: background 0.3s;
  width: 100%;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 0.95rem;
  text-align: left;
}

.dropdown-item:hover {
  background: #f5f5f5;
  color: #FF6B6B;
}

.dropdown-item svg {
  color: #666;
}

.dropdown-item:hover svg {
  color: #FF6B6B;
}

.dropdown-divider {
  height: 1px;
  background: #e0e0e0;
  margin: 5px 0;
}

/* Buttons */
.btn {
  padding: 8px 20px;
  border-radius: 30px;
  font-size: 0.95rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s;
}

.btn-outline {
  border: 2px solid #FF6B6B;
  color: #FF6B6B;
  background: transparent;
}

.btn-outline:hover {
  background: #FF6B6B;
  color: white;
}

.btn-primary {
  background: #FF6B6B;
  color: white;
  border: 2px solid #FF6B6B;
}

.btn-primary:hover {
  background: #FF5252;
  border-color: #FF5252;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 107, 107, 0.3);
}

/* Mobile Menu Toggle */
.mobile-menu-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
}

@media (max-width: 768px) {
  .mobile-menu-toggle {
    display: block;
  }
}

.menu-icon {
  width: 24px;
  height: 24px;
  color: #333;
}

/* Mobile Navigation */
.mobile-nav {
  padding: 20px 0;
  border-top: 1px solid #e0e0e0;
}

.mobile-nav-link {
  display: block;
  padding: 15px 0;
  color: #333;
  text-decoration: none;
  font-size: 1.1rem;
  border-bottom: 1px solid #f0f0f0;
}

.mobile-nav-link:last-child {
  border-bottom: none;
}

.mobile-nav-divider {
  height: 1px;
  background: #e0e0e0;
  margin: 15px 0;
}

/* Transitions */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Dark Mode */
:root.dark-mode .app-header {
  background: #0B1E33;
  border-bottom: 1px solid #1A334D;
}

:root.dark-mode .logo-text {
  color: #F5F9FF;
}

:root.dark-mode .nav-link {
  color: #B0C4DE;
}

:root.dark-mode .nav-link:hover,
:root.dark-mode .nav-link.active {
  color: #00D4FF;
}

:root.dark-mode .user-menu-btn:hover {
  background: #1A334D;
}

:root.dark-mode .user-name {
  color: #F5F9FF;
}

:root.dark-mode .user-dropdown {
  background: #0B1E33;
  border: 1px solid #1A334D;
}

:root.dark-mode .dropdown-item {
  color: #F5F9FF;
}

:root.dark-mode .dropdown-item:hover {
  background: #1A334D;
  color: #00D4FF;
}

:root.dark-mode .dropdown-item svg {
  color: #B0C4DE;
}

:root.dark-mode .dropdown-item:hover svg {
  color: #00D4FF;
}

:root.dark-mode .dropdown-divider {
  background: #1A334D;
}

:root.dark-mode .menu-icon {
  color: #F5F9FF;
}

:root.dark-mode .mobile-nav {
  border-top-color: #1A334D;
}

:root.dark-mode .mobile-nav-link {
  color: #F5F9FF;
  border-bottom-color: #1A334D;
}

@media (max-width: 768px) {
  .user-name {
    display: none;
  }
}
</style>