<template>
  <div class="profile-view">
    <div class="container">
      <h1 class="page-title">My <span>Profile</span></h1>
      
      <div class="profile-grid">
        <!-- Sidebar -->
        <div class="profile-sidebar">
          <div class="user-card">
            <div class="user-avatar">
              <span>{{ userInitials }}</span>
            </div>
            <h3 class="user-name">{{ userFullName }}</h3>
            <p class="user-email">{{ userEmail }}</p>
            <div class="user-stats">
              <div class="user-stat">
                <span class="stat-value">{{ stats.trips }}</span>
                <span class="stat-label">Trips</span>
              </div>
              <div class="user-stat">
                <span class="stat-value">{{ stats.reviews }}</span>
                <span class="stat-label">Reviews</span>
              </div>
              <div class="user-stat">
                <span class="stat-value">{{ stats.wishlist }}</span>
                <span class="stat-label">Wishlist</span>
              </div>
            </div>
          </div>

          <nav class="profile-nav">
            <button 
              class="nav-item" 
              :class="{ active: activeTab === 'details' }"
              @click="activeTab = 'details'"
            >
              <svg class="nav-icon" viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              <span>Personal Details</span>
            </button>
            
            <button 
              class="nav-item" 
              :class="{ active: activeTab === 'preferences' }"
              @click="activeTab = 'preferences'"
            >
              <svg class="nav-icon" viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94 0 .31.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.57 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
              </svg>
              <span>Preferences</span>
            </button>
            
            <button 
              class="nav-item" 
              :class="{ active: activeTab === 'blacklist' }"
              @click="activeTab = 'blacklist'"
            >
              <svg class="nav-icon" viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <span>Blacklist</span>
            </button>
            
            <button 
              class="nav-item" 
              :class="{ active: activeTab === 'security' }"
              @click="activeTab = 'security'"
            >
              <svg class="nav-icon" viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
              </svg>
              <span>Security</span>
            </button>
          </nav>
        </div>

        <!-- Main Content -->
        <div class="profile-content">
          <!-- Personal Details -->
          <div v-if="activeTab === 'details'" class="content-section">
            <h2 class="content-title">Personal Details</h2>
            <form @submit.prevent="saveDetails" class="details-form">
              <div class="form-row">
                <div class="form-group">
                  <label>First Name</label>
                  <input type="text" v-model="form.firstName" placeholder="John">
                </div>
                <div class="form-group">
                  <label>Last Name</label>
                  <input type="text" v-model="form.lastName" placeholder="Doe">
                </div>
              </div>

              <div class="form-group">
                <label>Email Address</label>
                <input type="email" v-model="form.email" placeholder="john@example.com" disabled>
                <small class="form-hint">Email cannot be changed</small>
              </div>

              <div class="form-group">
                <label>Phone Number</label>
                <input type="tel" v-model="form.phone" placeholder="+27 12 345 6789">
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>City</label>
                  <input type="text" v-model="form.city" placeholder="Cape Town">
                </div>
                <div class="form-group">
                  <label>Country</label>
                  <select v-model="form.country">
                    <option value="South Africa">South Africa</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Date of Birth</label>
                  <input type="date" v-model="form.dob">
                </div>
                <div class="form-group">
                  <label>Passport Number</label>
                  <input type="text" v-model="form.passport" placeholder="Passport number">
                </div>
              </div>

              <div class="form-actions">
                <button type="submit" class="btn-save">Save Changes</button>
                <button type="button" class="btn-cancel" @click="resetDetails">Cancel</button>
              </div>
            </form>
          </div>

          <!-- Preferences -->
          <div v-else-if="activeTab === 'preferences'" class="content-section">
            <h2 class="content-title">Travel Preferences</h2>
            <form @submit.prevent="savePreferences" class="preferences-form">
              <div class="form-group">
                <label>Preferred Airline</label>
                <select v-model="preferences.airline">
                  <option value="">No preference</option>
                  <option value="FlySafair">FlySafair</option>
                  <option value="Emirates">Emirates</option>
                  <option value="SAA">SAA</option>
                </select>
              </div>

              <div class="form-group">
                <label>Accommodation Type</label>
                <select v-model="preferences.accommodation">
                  <option value="hostel">Hostel (Shared)</option>
                  <option value="budget">Budget Hotel</option>
                  <option value="private">Private Room</option>
                </select>
              </div>

              <div class="form-group">
                <label>Maximum Budget (R)</label>
                <div class="range-input">
                  <input type="range" v-model.number="preferences.maxBudget" min="799" max="3000" step="100">
                  <span class="range-value">R{{ preferences.maxBudget }}</span>
                </div>
              </div>

              <div class="checkbox-group">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="preferences.newsletter">
                  <span>Email me mystery deals and offers</span>
                </label>

                <label class="checkbox-label">
                  <input type="checkbox" v-model="preferences.emailNotifications">
                  <span>Email me booking confirmations</span>
                </label>

                <label class="checkbox-label">
                  <input type="checkbox" v-model="preferences.smsAlerts">
                  <span>SMS alerts for flight changes</span>
                </label>
              </div>

              <button type="submit" class="btn-save">Save Preferences</button>
            </form>
          </div>

          <!-- Blacklist -->
          <div v-else-if="activeTab === 'blacklist'" class="content-section">
            <h2 class="content-title">Blacklist Preferences</h2>
            <p class="section-description">
              Select destinations you want to avoid. We'll never send you here.
            </p>

            <div class="blacklist-section">
              <h3>Currently Avoiding</h3>
              <div class="blacklist-tags">
                <div v-for="item in blacklist" :key="item" class="blacklist-tag">
                  <span>{{ item }}</span>
                  <button @click="removeFromBlacklist(item)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
                    </svg>
                  </button>
                </div>
              </div>

              <h3>Add to Blacklist</h3>
              <div class="search-box">
                <svg class="search-icon" viewBox="0 0 24 24" width="18" height="18">
                  <path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
                <input 
                  type="text" 
                  v-model="searchQuery" 
                  placeholder="Search destinations..."
                >
              </div>

              <div class="destinations-grid">
                <div 
                  v-for="dest in filteredDestinations" 
                  :key="dest.city"
                  class="destination-item"
                  @click="addToBlacklist(dest)"
                >
                  <div class="destination-image" :style="{ backgroundImage: `url(${dest.image})` }"></div>
                  <span>{{ dest.city }}, {{ dest.country }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Security -->
          <div v-else-if="activeTab === 'security'" class="content-section">
            <h2 class="content-title">Security Settings</h2>
            
            <div class="security-section">
              <h3>Change Password</h3>
              <form @submit.prevent="changePassword" class="password-form">
                <div class="form-group">
                  <label>Current Password</label>
                  <input type="password" v-model="password.current" placeholder="Enter current password">
                </div>

                <div class="form-group">
                  <label>New Password</label>
                  <input type="password" v-model="password.new" placeholder="Enter new password">
                </div>

                <div class="form-group">
                  <label>Confirm New Password</label>
                  <input type="password" v-model="password.confirm" placeholder="Confirm new password">
                </div>

                <button type="submit" class="btn-save">Update Password</button>
              </form>

              <div class="danger-zone">
                <h3>Danger Zone</h3>
                <p>Once you delete your account, there is no going back. Please be certain.</p>
                <button class="btn-danger">Delete Account</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'ProfileView',
  setup() {
    const store = useStore()
    const activeTab = ref('details')
    
    // User data
    const user = computed(() => store.state.auth?.user || {})
    const userInitials = computed(() => {
      if (user.value?.firstName) {
        return user.value.firstName.charAt(0).toUpperCase()
      }
      return user.value?.email?.charAt(0).toUpperCase() || 'U'
    })
    const userFullName = computed(() => {
      if (user.value?.firstName && user.value?.lastName) {
        return `${user.value.firstName} ${user.value.lastName}`
      }
      return user.value?.firstName || 'Adventurer'
    })
    const userEmail = computed(() => user.value?.email || 'adventurer@sowhereto.com')
    
    const stats = ref({
      trips: 12,
      reviews: 8,
      wishlist: 15
    })
    
    const profile = computed(() => store.getters['user/profile'] || {})
    const storedPreferences = computed(() => store.getters['user/preferences'] || {})
    const storedBlacklist = computed(() => store.getters['user/blacklist'] || [])

    // Form data
    const form = ref({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      city: '',
      country: 'South Africa',
      dob: '',
      passport: ''
    })
    
    const preferences = ref({
      airline: '',
      accommodation: 'hostel',
      maxBudget: 1500,
      newsletter: true,
      emailNotifications: true,
      smsAlerts: false
    })
    
    const password = ref({
      current: '',
      new: '',
      confirm: ''
    })
    
    // Blacklist
    const blacklist = computed(() => storedBlacklist.value)
    const searchQuery = ref('')
    
    const allDestinations = computed(() => (store.getters.destinations || []).map((dest) => ({
      id: dest.destination_id || dest.id,
      city: dest.name || dest.city,
      country: dest.country || '',
      image: dest.image_url || dest.image || ''
    })))
    
    const filteredDestinations = computed(() => {
      if (!searchQuery.value) return allDestinations.value
      const query = searchQuery.value.toLowerCase()
      return allDestinations.value.filter(d => 
        d.city.toLowerCase().includes(query) || 
        d.country.toLowerCase().includes(query)
      )
    })
    
    const saveDetails = async () => {
      const result = await store.dispatch('user/updateProfile', form.value)
      if (!result?.success) {
        store.commit('SHOW_NOTIFICATION', {
          message: result?.error || 'Failed to update profile',
          type: 'error'
        })
        return
      }
      store.commit('SHOW_NOTIFICATION', {
        message: 'Profile updated successfully',
        type: 'success'
      })
    }
    
    const resetDetails = () => {
      form.value = {
        firstName: profile.value.firstName || '',
        lastName: profile.value.lastName || '',
        email: profile.value.email || '',
        phone: profile.value.phone || '',
        city: profile.value.city || '',
        country: profile.value.country || 'South Africa',
        dob: profile.value.dateOfBirth || '',
        passport: profile.value.passportNumber || ''
      }
    }
    
    const savePreferences = async () => {
      const result = await store.dispatch('user/updatePreferences', preferences.value)
      if (!result?.success) {
        store.commit('SHOW_NOTIFICATION', {
          message: result?.error || 'Failed to save preferences',
          type: 'error'
        })
        return
      }
      store.commit('SHOW_NOTIFICATION', {
        message: 'Preferences saved',
        type: 'success'
      })
    }
    
    const changePassword = () => {
      if (password.value.new !== password.value.confirm) {
        store.commit('SHOW_NOTIFICATION', {
          message: 'Passwords do not match',
          type: 'error'
        })
        return
      }
      
      console.log('Changing password')
      store.commit('SHOW_NOTIFICATION', {
        message: 'Password updated successfully',
        type: 'success'
      })
      
      password.value = { current: '', new: '', confirm: '' }
    }
    
    const addToBlacklist = async (destination) => {
      const city = destination?.city
      if (!city) return
      const result = await store.dispatch('user/addToBlacklist', destination)
      if (!result?.success) {
        store.commit('SHOW_NOTIFICATION', {
          message: result?.error || `Failed to add ${city} to blacklist`,
          type: 'error'
        })
        return
      }
      store.commit('SHOW_NOTIFICATION', {
        message: `Added ${city} to blacklist`,
        type: 'success'
      })
    }
    
    const removeFromBlacklist = async (city) => {
      const result = await store.dispatch('user/removeFromBlacklist', city)
      if (!result?.success) {
        store.commit('SHOW_NOTIFICATION', {
          message: result?.error || `Failed to remove ${city} from blacklist`,
          type: 'error'
        })
        return
      }
      store.commit('SHOW_NOTIFICATION', {
        message: `Removed ${city} from blacklist`,
        type: 'success'
      })
    }
    
    onMounted(async () => {
      if (!allDestinations.value.length) {
        await store.dispatch('fetchDestinations')
      }
      await store.dispatch('user/bootstrap')
      form.value = {
        firstName: profile.value.firstName || '',
        lastName: profile.value.lastName || '',
        email: profile.value.email || user.value?.email || '',
        phone: profile.value.phone || '',
        city: profile.value.city || '',
        country: profile.value.country || 'South Africa',
        dob: profile.value.dateOfBirth || '',
        passport: profile.value.passportNumber || ''
      }
      preferences.value = {
        ...preferences.value,
        ...storedPreferences.value
      }
    })
    
    return {
      activeTab,
      userInitials,
      userFullName,
      userEmail,
      stats,
      form,
      preferences,
      password,
      blacklist,
      searchQuery,
      filteredDestinations,
      saveDetails,
      resetDetails,
      savePreferences,
      changePassword,
      addToBlacklist,
      removeFromBlacklist
    }
  }
}
</script>

<style scoped>
.profile-view {
  padding: 40px 0;
  min-height: calc(100vh - 200px);
  background: #f8f9fa;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-title {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
}

.page-title span {
  color: #FF6B6B;
  position: relative;
}

.page-title span::after {
  content: '';
  position: absolute;
  bottom: 5px;
  left: 0;
  width: 100%;
  height: 8px;
  background: rgba(255, 107, 107, 0.2);
  z-index: -1;
}

/* Grid Layout */
.profile-grid {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 30px;
}

/* Sidebar */
.profile-sidebar {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
  height: fit-content;
}

.user-card {
  padding: 30px;
  text-align: center;
  border-bottom: 1px solid #e0e0e0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.user-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #FFD93D;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 600;
  margin: 0 auto 15px;
  border: 3px solid white;
}

.user-name {
  font-size: 1.3rem;
  margin-bottom: 5px;
  font-weight: 600;
}

.user-email {
  font-size: 0.9rem;
  opacity: 0.9;
  margin-bottom: 20px;
}

.user-stats {
  display: flex;
  justify-content: center;
  gap: 20px;
  border-top: 1px solid rgba(255,255,255,0.2);
  padding-top: 20px;
}

.user-stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
}

.stat-label {
  font-size: 0.8rem;
  opacity: 0.8;
}

.profile-nav {
  padding: 15px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 15px;
  border: none;
  background: none;
  border-radius: 10px;
  color: #666;
  font-size: 1rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 5px;
}

.nav-item:hover {
  background: rgba(255, 107, 107, 0.1);
  color: #FF6B6B;
}

.nav-item.active {
  background: #FF6B6B;
  color: white;
}

.nav-icon {
  width: 20px;
  height: 20px;
  fill: currentColor;
}

/* Main Content */
.profile-content {
  background: white;
  border-radius: 15px;
  padding: 30px;
  border: 1px solid #e0e0e0;
}

.content-section {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.content-title {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
}

.section-description {
  color: #666;
  margin-bottom: 30px;
}

/* Forms */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #666;
  font-weight: 500;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #FF6B6B;
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1);
}

.form-group input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.form-hint {
  display: block;
  margin-top: 5px;
  color: #999;
  font-size: 0.8rem;
}

/* Range Input */
.range-input {
  display: flex;
  align-items: center;
  gap: 20px;
}

.range-input input {
  flex: 1;
  padding: 0;
  height: 8px;
}

.range-value {
  min-width: 70px;
  color: #FF6B6B;
  font-weight: 600;
}

/* Checkbox */
.checkbox-group {
  margin: 20px 0;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  cursor: pointer;
  color: #666;
}

.checkbox-label input {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

/* Form Actions */
.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}

.btn-save, .btn-cancel, .btn-danger {
  padding: 12px 30px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-save {
  background: #28A745;
  color: white;
}

.btn-save:hover {
  background: #218838;
  transform: translateY(-2px);
}

.btn-cancel {
  background: #f0f0f0;
  color: #666;
}

.btn-cancel:hover {
  background: #e0e0e0;
  transform: translateY(-2px);
}

.btn-danger {
  background: #DC3545;
  color: white;
}

.btn-danger:hover {
  background: #c82333;
  transform: translateY(-2px);
}

/* Blacklist */
.blacklist-section {
  margin-top: 20px;
}

.blacklist-section h3 {
  font-size: 1.1rem;
  color: #333;
  margin: 30px 0 15px;
}

.blacklist-section h3:first-of-type {
  margin-top: 0;
}

.blacklist-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 30px;
}

.blacklist-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 15px;
  background: #FF6B6B;
  color: white;
  border-radius: 50px;
  font-size: 0.95rem;
}

.blacklist-tag button {
  background: none;
  border: none;
  color: rgba(255,255,255,0.8);
  cursor: pointer;
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s;
}

.blacklist-tag button:hover {
  color: white;
}

.search-box {
  position: relative;
  margin-bottom: 20px;
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

.search-box input {
  width: 100%;
  padding: 12px 15px 12px 45px;
  border: 2px solid #e0e0e0;
  border-radius: 50px;
  font-size: 1rem;
}

.search-box input:focus {
  border-color: #FF6B6B;
  outline: none;
}

.destinations-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  max-height: 400px;
  overflow-y: auto;
  padding: 5px;
}

.destination-item {
  background: #f8f9fa;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.destination-item:hover {
  transform: translateY(-3px);
  border-color: #FF6B6B;
}

.destination-image {
  height: 80px;
  background-size: cover;
  background-position: center;
}

.destination-item span {
  display: block;
  padding: 8px;
  text-align: center;
  font-size: 0.9rem;
  color: #333;
}

/* Security */
.security-section {
  margin-top: 20px;
}

.security-section h3 {
  font-size: 1.2rem;
  color: #333;
  margin: 30px 0 20px;
}

.password-form {
  max-width: 400px;
}

.danger-zone {
  margin-top: 50px;
  padding: 20px;
  background: #fff5f5;
  border-radius: 10px;
  border: 1px solid #ffebeb;
}

.danger-zone h3 {
  color: #DC3545;
  margin-top: 0;
}

.danger-zone p {
  color: #666;
  margin-bottom: 20px;
}

/* Dark Mode */
:root.dark-mode .profile-view {
  background: #0B1E33;
}

:root.dark-mode .page-title {
  color: #F5F9FF;
}

:root.dark-mode .profile-sidebar,
:root.dark-mode .profile-content {
  background: #0B1E33;
  border-color: #1A334D;
}

:root.dark-mode .nav-item {
  color: #B0C4DE;
}

:root.dark-mode .nav-item:hover {
  background: rgba(0, 212, 255, 0.1);
  color: #00D4FF;
}

:root.dark-mode .nav-item.active {
  background: #00D4FF;
  color: #0B1E33;
}

:root.dark-mode .content-title {
  color: #F5F9FF;
  border-bottom-color: #1A334D;
}

:root.dark-mode .form-group label {
  color: #B0C4DE;
}

:root.dark-mode .form-group input,
:root.dark-mode .form-group select {
  background: #122B44;
  border-color: #1A334D;
  color: #F5F9FF;
}

:root.dark-mode .form-group input:focus,
:root.dark-mode .form-group select:focus {
  border-color: #00D4FF;
}

:root.dark-mode .checkbox-label {
  color: #B0C4DE;
}

:root.dark-mode .destination-item {
  background: #122B44;
}

:root.dark-mode .destination-item span {
  color: #F5F9FF;
}

:root.dark-mode .danger-zone {
  background: rgba(220, 53, 69, 0.1);
  border-color: rgba(220, 53, 69, 0.3);
}

/* Responsive */
@media (max-width: 968px) {
  .profile-grid {
    grid-template-columns: 1fr;
  }
  
  .profile-sidebar {
    max-width: 400px;
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
  
  .destinations-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn-save, .btn-cancel {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 2rem;
  }
  
  .destinations-grid {
    grid-template-columns: 1fr;
  }
  
  .user-stats {
    flex-wrap: wrap;
  }
}
</style>
