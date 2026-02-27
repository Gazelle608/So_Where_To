<template>
  <div class="destinations-view">
    <!-- Header -->
    <section class="destinations-header">
      <h1>Explore <span>Destinations</span></h1>
      <p>Discover your next adventure from 55+ locations worldwide</p>
    </section>

    <!-- Filter Tabs -->
    <div class="filter-tabs">
      <button 
        class="filter-tab" 
        :class="{ active: activeFilter === 'all' }"
        @click="activeFilter = 'all'"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="currentColor"/>
        </svg>
        All
      </button>
      <button 
        class="filter-tab" 
        :class="{ active: activeFilter === 'revealed' }"
        @click="activeFilter = 'revealed'"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
        </svg>
        Revealed
      </button>
      <button 
        class="filter-tab" 
        :class="{ active: activeFilter === 'mystery' }"
        @click="activeFilter = 'mystery'"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
        </svg>
        Mystery
      </button>
    </div>

    <div v-if="isLoading" class="loading">
      <div class="spinner"></div>
      <p>Loading destinations...</p>
    </div>
    
    <div v-else-if="filteredDestinations.length === 0" class="no-results">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#999"/>
      </svg>
      <h3>No destinations found</h3>
      <p>Try adjusting your filters</p>
    </div>

    <!-- Destinations Grid -->
    <div v-else class="destinations-grid">
      <FlightTicketCard 
        v-for="dest in filteredDestinations" 
        :key="dest.id"
        :destination="dest"
        @book="bookDestination"
      />
    </div>

    <!-- Results Count -->
    <div v-if="filteredDestinations.length > 0" class="results-count">
      Showing {{ filteredDestinations.length }} of {{ destinations.length }} destinations
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import FlightTicketCard from '@/components/common/ui/FlightTicketCard.vue'

export default {
  name: 'DestinationsView',
  components: {
    FlightTicketCard
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const activeFilter = ref('all')

    // ALL 55 DESTINATIONS - Now with revealed/mystery flags
    const allDestinations = [
      // Asia - Revealed
      { id: 1, name: 'Tokyo', city: 'Tokyo', country: 'Japan', region: 'Asia', lat: 35.6762, lng: 139.6503, price: 1299, days: 5, rating: 4.8, tags: ['Culture', 'Food', 'Technology'], revealed: true, code: 'HND', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 2, name: 'Kyoto', city: 'Kyoto', country: 'Japan', region: 'Asia', lat: 35.0116, lng: 135.7681, price: 1199, days: 5, rating: 4.7, tags: ['Temples', 'Culture', 'Gardens'], revealed: true, code: 'UKY', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 3, name: 'Osaka', city: 'Osaka', country: 'Japan', region: 'Asia', lat: 34.6937, lng: 135.5023, price: 1099, days: 4, rating: 4.6, tags: ['Food', 'Castles', 'Nightlife'], revealed: true, code: 'KIX', image: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 4, name: 'Seoul', city: 'Seoul', country: 'South Korea', region: 'Asia', lat: 37.5665, lng: 126.9780, price: 1199, days: 5, rating: 4.7, tags: ['K-Pop', 'Food', 'Technology'], revealed: true, code: 'ICN', image: 'https://images.unsplash.com/photo-1532649097480-b67d52743b69?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { id: 5, name: 'Busan', city: 'Busan', country: 'South Korea', region: 'Asia', lat: 35.1796, lng: 129.0756, price: 1099, days: 4, rating: 4.5, tags: ['Beach', 'Temples', 'Seafood'], revealed: true, code: 'PUS', image: 'https://plus.unsplash.com/premium_photo-1661886360250-87b18410aefd?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { id: 6, name: 'Beijing', city: 'Beijing', country: 'China', region: 'Asia', lat: 39.9042, lng: 116.4074, price: 1099, days: 5, rating: 4.6, tags: ['History', 'Great Wall', 'Culture'], revealed: true, code: 'PEK', image: 'https://plus.unsplash.com/premium_photo-1723433351351-0f6cd5d21537?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { id: 7, name: 'Shanghai', city: 'Shanghai', country: 'China', region: 'Asia', lat: 31.2304, lng: 121.4737, price: 1199, days: 5, rating: 4.7, tags: ['Modern', 'Shopping', 'Food'], revealed: true, code: 'PVG', image: 'https://images.unsplash.com/photo-1752662742861-fb76c71576d7?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { id: 8, name: 'Hong Kong', city: 'Hong Kong', country: 'China', region: 'Asia', lat: 22.3193, lng: 114.1694, price: 1299, days: 5, rating: 4.8, tags: ['Skyline', 'Food', 'Shopping'], revealed: true, code: 'HKG', image: 'https://plus.unsplash.com/premium_photo-1661887292499-cbaefdb169ce?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { id: 9, name: 'Bangkok', city: 'Bangkok', country: 'Thailand', region: 'Asia', lat: 13.7563, lng: 100.5018, price: 899, days: 5, rating: 4.6, tags: ['Temples', 'Food', 'Markets'], revealed: true, code: 'BKK', image: 'https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmFuZ2tvayUyMGNpdHl8ZW58MHx8MHx8fDA%3D' },
      { id: 10, name: 'Chiang Mai', city: 'Chiang Mai', country: 'Thailand', region: 'Asia', lat: 18.7883, lng: 98.9853, price: 849, days: 4, rating: 4.7, tags: ['Mountains', 'Temples', 'Culture'], revealed: true, code: 'CNX', image: 'https://plus.unsplash.com/premium_photo-1661929242720-140374d97c94?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { id: 11, name: 'Phuket', city: 'Phuket', country: 'Thailand', region: 'Asia', lat: 7.8804, lng: 98.3923, price: 899, days: 5, rating: 4.5, tags: ['Beach', 'Islands', 'Nightlife'], revealed: true, code: 'HKT', image: 'https://images.unsplash.com/photo-1534008897995-27a23e859048?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { id: 12, name: 'Singapore', city: 'Singapore', country: 'Singapore', region: 'Asia', lat: 1.3521, lng: 103.8198, price: 1199, days: 4, rating: 4.8, tags: ['Modern', 'Food', 'Gardens'], revealed: true, code: 'SIN', image: 'https://images.unsplash.com/photo-1620033263019-f2ec2c738a60?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { id: 13, name: 'Kuala Lumpur', city: 'Kuala Lumpur', country: 'Malaysia', region: 'Asia', lat: 3.1390, lng: 101.6869, price: 949, days: 4, rating: 4.5, tags: ['Petronas', 'Food', 'Culture'], revealed: true, code: 'KUL', image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=1164&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { id: 14, name: 'Hanoi', city: 'Hanoi', country: 'Vietnam', region: 'Asia', lat: 21.0285, lng: 105.8542, price: 849, days: 5, rating: 4.6, tags: ['History', 'Food', 'Old Quarter'], revealed: true, code: 'HAN', image: 'https://images.unsplash.com/photo-1553851919-596510268b99?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { id: 15, name: 'Ho Chi Minh City', city: 'Ho Chi Minh City', country: 'Vietnam', region: 'Asia', lat: 10.8231, lng: 106.6297, price: 849, days: 4, rating: 4.5, tags: ['Markets', 'History', 'Food'], revealed: true, code: 'SGN', image: 'https://images.unsplash.com/photo-1536086845112-89de23aa4772?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      
      // Europe - Revealed
      { id: 16, name: 'Paris', city: 'Paris', country: 'France', region: 'Europe', lat: 48.8566, lng: 2.3522, price: 999, days: 4, rating: 4.7, tags: ['Romance', 'Art', 'Food'], revealed: true, code: 'CDG', image: 'https://images.unsplash.com/photo-1679231926688-ef9cdab5ed2f?q=80&w=1391&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { id: 17, name: 'London', city: 'London', country: 'UK', region: 'Europe', lat: 51.5074, lng: -0.1278, price: 1099, days: 5, rating: 4.7, tags: ['History', 'Royal', 'Theatre'], revealed: true, code: 'LHR', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bG9uZG9ufGVufDB8fDB8fHww' },
      { id: 18, name: 'Rome', city: 'Rome', country: 'Italy', region: 'Europe', lat: 41.9028, lng: 12.4964, price: 949, days: 4, rating: 4.8, tags: ['History', 'Food', 'Art'], revealed: true, code: 'FCO', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1096&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { id: 19, name: 'Venice', city: 'Venice', country: 'Italy', region: 'Europe', lat: 45.4408, lng: 12.3155, price: 999, days: 4, rating: 4.7, tags: ['Canals', 'Romance', 'Art'], revealed: true, code: 'VCE', image: 'https://plus.unsplash.com/premium_photo-1661963047742-dabc5a735357?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dmVuaWNlfGVufDB8fDB8fHww' },
      { id: 20, name: 'Florence', city: 'Florence', country: 'Italy', region: 'Europe', lat: 43.7696, lng: 11.2558, price: 949, days: 4, rating: 4.8, tags: ['Renaissance', 'Art', 'Food'], revealed: true, code: 'FLR', image: 'https://images.unsplash.com/photo-1476362174823-3a23f4aa6d76?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { id: 21, name: 'Barcelona', city: 'Barcelona', country: 'Spain', region: 'Europe', lat: 41.3851, lng: 2.1734, price: 899, days: 4, rating: 4.7, tags: ['Gaudi', 'Beach', 'Food'], revealed: true, code: 'BCN', image: 'https://images.unsplash.com/photo-1630219694734-fe47ab76b15e?q=80&w=1052&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { id: 22, name: 'Madrid', city: 'Madrid', country: 'Spain', region: 'Europe', lat: 40.4168, lng: -3.7038, price: 899, days: 4, rating: 4.6, tags: ['Art', 'Food', 'Nightlife'], revealed: true, code: 'MAD', image: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { id: 23, name: 'Amsterdam', city: 'Amsterdam', country: 'Netherlands', region: 'Europe', lat: 52.3676, lng: 4.9041, price: 949, days: 4, rating: 4.7, tags: ['Canals', 'Museums', 'Cycling'], revealed: true, code: 'AMS', image: 'https://images.unsplash.com/photo-1580996378027-23040f16f157?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { id: 24, name: 'Berlin', city: 'Berlin', country: 'Germany', region: 'Europe', lat: 52.5200, lng: 13.4050, price: 899, days: 4, rating: 4.6, tags: ['History', 'Art', 'Nightlife'], revealed: true, code: 'BER', image: 'https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { id: 25, name: 'Munich', city: 'Munich', country: 'Germany', region: 'Europe', lat: 48.1351, lng: 11.5820, price: 899, days: 4, rating: 4.6, tags: ['Beer', 'Castles', 'Culture'], revealed: true, code: 'MUC', image: 'https://images.unsplash.com/photo-1649609765902-254a227dc960?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8TXVuaWNoJTIwZ2VybWFueXxlbnwwfHwwfHx8MA%3D%3D' },
      { id: 26, name: 'Vienna', city: 'Vienna', country: 'Austria', region: 'Europe', lat: 48.2082, lng: 16.3738, price: 949, days: 4, rating: 4.7, tags: ['Music', 'Palaces', 'Coffee'], revealed: true, code: 'VIE', image: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { id: 27, name: 'Prague', city: 'Prague', country: 'Czech Republic', region: 'Europe', lat: 50.0755, lng: 14.4378, price: 849, days: 4, rating: 4.7, tags: ['Castle', 'Beer', 'History'], revealed: true, code: 'PRG', image: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { id: 28, name: 'Budapest', city: 'Budapest', country: 'Hungary', region: 'Europe', lat: 47.4979, lng: 19.0402, price: 849, days: 4, rating: 4.6, tags: ['Thermal', 'Danube', 'History'], revealed: true, code: 'BUD', image: 'https://plus.unsplash.com/premium_photo-1680721310335-b3518986f488?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { id: 29, name: 'Lisbon', city: 'Lisbon', country: 'Portugal', region: 'Europe', lat: 38.7223, lng: -9.1393, price: 849, days: 4, rating: 4.7, tags: ['Trams', 'Food', 'Hills'], revealed: true, code: 'LIS', image: 'https://images.unsplash.com/photo-1525207934214-58e69a8f8a3e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { id: 30, name: 'Dublin', city: 'Dublin', country: 'Ireland', region: 'Europe', lat: 53.3498, lng: -6.2603, price: 899, days: 4, rating: 4.6, tags: ['Pub', 'Literature', 'History'], revealed: true, code: 'DUB', image: 'https://images.unsplash.com/photo-1634499282463-274002e296a9?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      
      // Africa - Revealed
      { id: 31, name: 'Cape Town', city: 'Cape Town', country: 'South Africa', region: 'Africa', lat: -33.9249, lng: 18.4241, price: 799, days: 4, rating: 4.9, tags: ['Table Mountain', 'Beach', 'Wine'], revealed: true, code: 'CPT', image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { id: 32, name: 'Johannesburg', city: 'Johannesburg', country: 'South Africa', region: 'Africa', lat: -26.2041, lng: 28.0473, price: 749, days: 4, rating: 4.5, tags: ['City', 'Culture', 'History'], revealed: true, code: 'JNB', image: 'https://images.unsplash.com/photo-1577948000111-9c970dfe3743?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { id: 33, name: 'Durban', city: 'Durban', country: 'South Africa', region: 'Africa', lat: -29.8587, lng: 31.0218, price: 749, days: 4, rating: 4.5, tags: ['Beach', 'Indian Food', 'Warm'], revealed: true, code: 'DUR', image: 'https://images.unsplash.com/photo-1591585379482-e3505bb5afbe?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { id: 34, name: 'Marrakech', city: 'Marrakech', country: 'Morocco', region: 'Africa', lat: 31.6295, lng: -7.9811, price: 899, days: 5, rating: 4.7, tags: ['Souk', 'Medina', 'Desert'], revealed: true, code: 'RAK', image: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { id: 35, name: 'Cairo', city: 'Cairo', country: 'Egypt', region: 'Africa', lat: 30.0444, lng: 31.2357, price: 949, days: 5, rating: 4.6, tags: ['Pyramids', 'Nile', 'History'], revealed: true, code: 'CAI', image: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Q2Fpcm98ZW58MHx8MHx8fDA%3D' },
      { id: 36, name: 'Nairobi', city: 'Nairobi', country: 'Kenya', region: 'Africa', lat: -1.2921, lng: 36.8219, price: 999, days: 6, rating: 4.6, tags: ['Safari', 'Wildlife', 'Culture'], revealed: true, code: 'NBO', image: 'https://images.unsplash.com/photo-1611348524140-53c9a25263d6?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { id: 37, name: 'Zanzibar', city: 'Zanzibar', country: 'Tanzania', region: 'Africa', lat: -6.1659, lng: 39.2026, price: 1099, days: 6, rating: 4.8, tags: ['Beach', 'Spice', 'History'], revealed: true, code: 'ZNZ', image: 'https://images.unsplash.com/photo-1575999502951-4ab25b5ca889?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8WmFuemliYXJ8ZW58MHx8MHx8fDA%3D' },
      { id: 38, name: 'Victoria Falls', city: 'Victoria Falls', country: 'Zimbabwe', region: 'Africa', lat: -17.9243, lng: 25.8569, price: 999, days: 5, rating: 4.9, tags: ['Waterfall', 'Adventure', 'Nature'], revealed: true, code: 'VFA', image: 'https://images.unsplash.com/photo-1618811308896-d279d72fdf4d?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { id: 39, name: 'Mauritius', city: 'Mauritius', country: 'Mauritius', region: 'Africa', lat: -20.3484, lng: 57.5522, price: 1199, days: 7, rating: 4.8, tags: ['Beach', 'Luxury', 'Lagoon'], revealed: true, code: 'MRU', image: 'https://images.unsplash.com/photo-1513415277900-a62401e19be4?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { id: 40, name: 'Seychelles', city: 'Seychelles', country: 'Seychelles', region: 'Africa', lat: -4.6796, lng: 55.4920, price: 1299, days: 7, rating: 4.9, tags: ['Beach', 'Islands', 'Nature'], revealed: true, code: 'SEZ', image: 'https://images.unsplash.com/photo-1553829176-61484f865ac3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8U2V5Y2hlbGxlc3xlbnwwfHwwfHx8MA%3D%3D' },
      
      // Americas - Revealed
      { id: 41, name: 'New York', city: 'New York', country: 'USA', region: 'Americas', lat: 40.7128, lng: -74.0060, price: 1199, days: 4, rating: 4.8, tags: ['City', 'Culture', 'Shopping'], revealed: true, code: 'JFK', image: 'https://plus.unsplash.com/premium_photo-1661954654458-c673671d4a08?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bmV3JTIweW9yayUyMGNpdHl8ZW58MHx8MHx8fDA%3D' },
      { id: 42, name: 'Los Angeles', city: 'Los Angeles', country: 'USA', region: 'Americas', lat: 34.0522, lng: -118.2437, price: 1199, days: 4, rating: 4.6, tags: ['Hollywood', 'Beach', 'Entertainment'], revealed: true, code: 'LAX', image: 'https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bG9zJTIwYW5nZWxlc3xlbnwwfHwwfHx8MA%3D%3D' },
      { id: 43, name: 'San Francisco', city: 'San Francisco', country: 'USA', region: 'Americas', lat: 37.7749, lng: -122.4194, price: 1199, days: 4, rating: 4.7, tags: ['Golden Gate', 'Tech', 'Hills'], revealed: true, code: 'SFO', image: 'https://plus.unsplash.com/premium_photo-1673002094407-a72547fa791a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2FuJTIwZnJhbmNpc2NvfGVufDB8fDB8fHww' },
      { id: 44, name: 'Chicago', city: 'Chicago', country: 'USA', region: 'Americas', lat: 41.8781, lng: -87.6298, price: 1099, days: 4, rating: 4.6, tags: ['Architecture', 'Food', 'Lake'], revealed: true, code: 'ORD', image: 'https://images.unsplash.com/photo-1597933534024-debb6104af15?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y2hpY2Fnb3xlbnwwfHwwfHx8MA%3D%3D' },
      { id: 45, name: 'Miami', city: 'Miami', country: 'USA', region: 'Americas', lat: 25.7617, lng: -80.1918, price: 1099, days: 4, rating: 4.6, tags: ['Beach', 'Nightlife', 'Art Deco'], revealed: true, code: 'MIA', image: 'https://plus.unsplash.com/premium_photo-1697730215093-baeae8060bfe?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWlhbWl8ZW58MHx8MHx8fDA%3D' },
      { id: 46, name: 'Cancun', city: 'Cancun', country: 'Mexico', region: 'Americas', lat: 21.1619, lng: -86.8515, price: 999, days: 5, rating: 4.7, tags: ['Beach', 'Resort', 'Mayan'], revealed: true, code: 'CUN', image: 'https://images.unsplash.com/photo-1711220465753-2450b31ea318?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y2FuY3VuJTIwbWV4aWNvfGVufDB8fDB8fHww' },
      { id: 47, name: 'Mexico City', city: 'Mexico City', country: 'Mexico', region: 'Americas', lat: 19.4326, lng: -99.1332, price: 949, days: 4, rating: 4.6, tags: ['History', 'Food', 'Culture'], revealed: true, code: 'MEX', image: 'https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWV4aWNvJTIwY2l0eXxlbnwwfHwwfHx8MA%3D%3D' },
      { id: 48, name: 'Rio de Janeiro', city: 'Rio', country: 'Brazil', region: 'Americas', lat: -22.9068, lng: -43.1729, price: 1099, days: 6, rating: 4.8, tags: ['Christ', 'Carnival', 'Beach'], revealed: true, code: 'GIG', image: 'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cmlvJTIwZGUlMjBqYW5laXJvfGVufDB8fDB8fHww' },
      { id: 49, name: 'Buenos Aires', city: 'Buenos Aires', country: 'Argentina', region: 'Americas', lat: -34.6037, lng: -58.3816, price: 999, days: 5, rating: 4.7, tags: ['Tango', 'Food', 'European'], revealed: true, code: 'EZE', image: 'https://plus.unsplash.com/premium_photo-1697729901052-fe8900e24993?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8QnVlbm9zJTIwQWlyZXN8ZW58MHx8MHx8fDA%3D' },
      { id: 50, name: 'Lima', city: 'Lima', country: 'Peru', region: 'Americas', lat: -12.0464, lng: -77.0428, price: 949, days: 5, rating: 4.6, tags: ['Food', 'History', 'Coast'], revealed: true, code: 'LIM', image: 'https://images.unsplash.com/photo-1577587230708-187fdbef4d91?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGltYXxlbnwwfHwwfHx8MA%3D%3D' },
      
      // Oceania - Revealed
      { id: 51, name: 'Sydney', city: 'Sydney', country: 'Australia', region: 'Oceania', lat: -33.8688, lng: 151.2093, price: 1499, days: 7, rating: 4.8, tags: ['Opera', 'Harbour', 'Beach'], revealed: true, code: 'SYD', image: 'https://images.unsplash.com/photo-1528072164453-f4e8ef0d475a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3lkbmV5fGVufDB8fDB8fHww' },
      { id: 52, name: 'Melbourne', city: 'Melbourne', country: 'Australia', region: 'Oceania', lat: -37.8136, lng: 144.9631, price: 1399, days: 6, rating: 4.7, tags: ['Coffee', 'Art', 'Sport'], revealed: true, code: 'MEL', image: 'https://plus.unsplash.com/premium_photo-1742457643727-88c1256fa378?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWVsYm91cm5lJTIwY2l0eXxlbnwwfHwwfHx8MA%3D%3D' },
      { id: 53, name: 'Auckland', city: 'Auckland', country: 'New Zealand', region: 'Oceania', lat: -36.8485, lng: 174.7633, price: 1399, days: 6, rating: 4.7, tags: ['Harbour', 'Islands', 'Adventure'], revealed: true, code: 'AKL', image: 'https://plus.unsplash.com/premium_photo-1682449558329-b04c01db4d42?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8QXVja2xhbmR8ZW58MHx8MHx8fDA%3D' },
      { id: 54, name: 'Queenstown', city: 'Queenstown', country: 'New Zealand', region: 'Oceania', lat: -45.0312, lng: 168.6626, price: 1499, days: 6, rating: 4.9, tags: ['Adventure', 'Scenery', 'Ski'], revealed: true, code: 'ZQN', image: 'https://images.unsplash.com/photo-1600466403153-50193d187dde?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8UXVlZW5zdG93bnxlbnwwfHwwfHx8MA%3D%3D' },
      { id: 55, name: 'Fiji', city: 'Fiji', country: 'Fiji', region: 'Oceania', lat: -17.7134, lng: 178.0650, price: 1399, days: 7, rating: 4.8, tags: ['Islands', 'Beach', 'Diving'], revealed: true, code: 'NAN', image: 'https://images.unsplash.com/photo-1655719647300-5142977bfa79?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZmlqaSUyMGlzbGFuZHxlbnwwfHwwfHx8MA%3D%3D' },
      
      // MYSTERY DESTINATIONS
      { id: 56, region: 'Asia', price: 750, days: 5, tags: ['Mystery', 'Adventure', 'Culture'], revealed: false, name: 'Mystery Asia', lat: 25.0, lng: 105.0, image: 'https://plus.unsplash.com/premium_photo-1661878434394-7f7e3d032b2a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YXNpYXxlbnwwfHwwfHx8MA%3D%3D' },
      { id: 57, region: 'Europe', price: 720, days: 4, tags: ['Mystery', 'History', 'Food'], revealed: false, name: 'Mystery Europe', lat: 50.0, lng: 10.0, image: 'https://plus.unsplash.com/premium_photo-1661964149725-fbf14eabd38c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Z3JlZWNlfGVufDB8fDB8fHww' },
      { id: 58, region: 'Africa', price: 680, days: 5, tags: ['Mystery', 'Safari', 'Adventure'], revealed: false, name: 'Mystery Africa', lat: 5.0, lng: 25.0, image: 'https://plus.unsplash.com/premium_photo-1661936361131-c421746dcd0d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YWZyaWNhfGVufDB8fDB8fHww' },
      { id: 59, region: 'Americas', price: 790, days: 5, tags: ['Mystery', 'Beach', 'Culture'], revealed: false, name: 'Mystery Americas', lat: 10.0, lng: -70.0, image: 'https://images.unsplash.com/photo-1438401171849-74ac270044ee?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c2VhdHRsZXxlbnwwfHwwfHx8MA%3D%3D' },
      { id: 60, region: 'Oceania', price: 850, days: 6, tags: ['Mystery', 'Island', 'Adventure'], revealed: false, name: 'Mystery Oceania', lat: -20.0, lng: 150.0, image: 'https://images.unsplash.com/photo-1598135753163-6167c1a1ad65?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aGF3YWlpfGVufDB8fDB8fHww' }
    ]

    const destinations = ref([])
    const isLoading = ref(true)

    // Fetch destinations
    const fetchDestinations = async () => {
      isLoading.value = true
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800))
        destinations.value = allDestinations
      } catch (error) {
        console.error('Failed to fetch destinations:', error)
      } finally {
        isLoading.value = false
      }
    }

    const filteredDestinations = computed(() => {
      if (!destinations.value.length) return []

      if (activeFilter.value === 'all') {
        return destinations.value
      }
      if (activeFilter.value === 'revealed') {
        return destinations.value.filter((d) => d.revealed === true)
      }
      if (activeFilter.value === 'mystery') {
        return destinations.value.filter((d) => d.revealed === false)
      }
      return destinations.value
    })

    onMounted(async () => {
      await fetchDestinations()
    })

    const bookDestination = async (destination) => {
      if (!store.getters['auth/isAuthenticated']) {
        router.push({ name: 'login', query: { redirect: '/destinations' } })
        return
      }

      try {
        const result = await store.dispatch('addToCart', {
          destination_id: destination.id,
          quantity: 1,
          unit_price: destination.price,
          is_mystery: !destination.revealed
        })

        if (!result?.success) {
          throw new Error(result?.error || 'Failed to add destination to cart')
        }

        store.commit('SHOW_NOTIFICATION', {
          message: destination.revealed 
            ? `${destination.name || destination.city} added to your cart`
            : 'Mystery destination added to your cart',
          type: 'success'
        })

        router.push('/cart')
      } catch (error) {
        store.commit('SHOW_NOTIFICATION', {
          message: error?.message || 'Failed to add destination to cart',
          type: 'error'
        })
      }
    }

    return {
      activeFilter,
      isLoading,
      destinations: destinations.value,
      filteredDestinations,
      bookDestination
    }
  }
}
</script>

<style scoped>
.destinations-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.destinations-header {
  text-align: center;
  margin-bottom: 40px;
}

.destinations-header h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 10px;
}

.destinations-header h1 span {
  color: #FF6B6B;
  position: relative;
}

.destinations-header h1 span::after {
  content: '';
  position: absolute;
  bottom: 5px;
  left: 0;
  width: 100%;
  height: 8px;
  background: rgba(255, 107, 107, 0.2);
  z-index: -1;
}

.destinations-header p {
  color: #666;
  font-size: 1.1rem;
}

/* Filter Tabs */
.filter-tabs {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 25px;
  background: #f0f0f0;
  border: none;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-tab:hover {
  background: #e0e0e0;
}

.filter-tab.active {
  background: #FF6B6B;
  color: white;
}

.filter-tab svg {
  width: 18px;
  height: 18px;
}

/* Destinations Grid */
.destinations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.loading {
  text-align: center;
  color: #666;
  font-size: 1.1rem;
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 107, 107, 0.2);
  border-top-color: #FF6B6B;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.no-results {
  text-align: center;
  padding: 60px 20px;
  background: #f8f9fa;
  border-radius: 16px;
}

.no-results svg {
  margin-bottom: 20px;
  opacity: 0.5;
}

.no-results h3 {
  color: #333;
  margin-bottom: 10px;
}

.no-results p {
  color: #666;
}

.results-count {
  text-align: center;
  color: #666;
  font-size: 0.9rem;
  padding: 20px 0;
  border-top: 1px solid #e0e0e0;
}

/* Dark Mode */
:root.dark-mode .destinations-header h1 {
  color: #F5F9FF;
}

:root.dark-mode .destinations-header p {
  color: #B0C4DE;
}

:root.dark-mode .filter-tab {
  background: #122B44;
  color: #B0C4DE;
}

:root.dark-mode .filter-tab:hover {
  background: #1A334D;
}

:root.dark-mode .filter-tab.active {
  background: #00D4FF;
  color: #0B1E33;
}

:root.dark-mode .no-results {
  background: #122B44;
}

:root.dark-mode .no-results h3 {
  color: #F5F9FF;
}

:root.dark-mode .no-results p {
  color: #B0C4DE;
}

:root.dark-mode .results-count {
  color: #B0C4DE;
  border-top-color: #1A334D;
}

/* Responsive */
@media (max-width: 768px) {
  .destinations-header h1 {
    font-size: 2rem;
  }
  
  .destinations-grid {
    grid-template-columns: 1fr;
  }
  
  .filter-tabs {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-tab {
    justify-content: center;
  }
}
</style>