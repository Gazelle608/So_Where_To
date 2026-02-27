<template>
  <div class="realistic-globe">
    <div ref="globeContainer" class="globe-canvas"></div>

    <div v-if="!globeReady" class="globe-loading">
      <div class="loading-spinner"></div>
      <p>Loading 3D Globe...</p>
    </div>

    <transition name="fade">
      <div v-if="selectedDestination" class="destination-popup" :style="popupStyle">
        <button class="popup-close" @click="selectedDestination = null">×</button>
        <h3>{{ selectedDestination.name }}</h3>
        <p class="country">{{ selectedDestination.country }}</p>
        <div class="popup-details">
          <span class="price">R{{ selectedDestination.price }}</span>
          <span class="days">{{ selectedDestination.days }} days</span>
          <span class="rating">⭐ {{ selectedDestination.rating }}</span>
        </div>
        <div class="popup-tags">
          <span v-for="tag in selectedDestination.tags" :key="tag" class="tag">
            {{ tag }}
          </span>
        </div>
        <button class="book-btn" @click="handleBooking">Book Now</button>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, defineExpose, nextTick, computed } from 'vue'
import Globe from 'globe.gl'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

// Custom marker SVG icons as HTML strings
const markerIcons = {
  asia: `<svg width="24" height="24" viewBox="0 0 24 24" fill="#FF6B6B" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`,
  europe: `<svg width="24" height="24" viewBox="0 0 24 24" fill="#4A6FA5" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`,
  africa: `<svg width="24" height="24" viewBox="0 0 24 24" fill="#F4A261" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`,
  americas: `<svg width="24" height="24" viewBox="0 0 24 24" fill="#9B6B9E" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`,
  oceania: `<svg width="24" height="24" viewBox="0 0 24 24" fill="#28A745" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`
}

export default {
  name: 'RealisticGlobe',
  props: {
    interactive: {
      type: Boolean,
      default: true
    }
  },
  emits: ['locationSelected', 'spin', 'spin-complete'],
  setup(props, { emit }) {
    const store = useStore()
    const router = useRouter()
    const globeContainer = ref(null)
    const globe = ref(null)
    const globeReady = ref(false)
    const isAnimating = ref(false)
    const selectedDestination = ref(null)
    const popupPosition = ref({ x: 0, y: 0 })
    const allMarkersVisible = ref(true)

    // ALL 55 DESTINATIONS
    const destinations = [
      // Asia
      { id: 1, name: 'Tokyo', country: 'Japan', region: 'Asia', lat: 35.6762, lng: 139.6503, price: 1299, days: 5, rating: 4.8, tags: ['Culture', 'Food', 'Technology'] },
      { id: 2, name: 'Kyoto', country: 'Japan', region: 'Asia', lat: 35.0116, lng: 135.7681, price: 1199, days: 5, rating: 4.7, tags: ['Temples', 'Culture', 'Gardens'] },
      { id: 3, name: 'Osaka', country: 'Japan', region: 'Asia', lat: 34.6937, lng: 135.5023, price: 1099, days: 4, rating: 4.6, tags: ['Food', 'Castles', 'Nightlife'] },
      { id: 4, name: 'Seoul', country: 'South Korea', region: 'Asia', lat: 37.5665, lng: 126.9780, price: 1199, days: 5, rating: 4.7, tags: ['K-Pop', 'Food', 'Technology'] },
      { id: 5, name: 'Busan', country: 'South Korea', region: 'Asia', lat: 35.1796, lng: 129.0756, price: 1099, days: 4, rating: 4.5, tags: ['Beach', 'Temples', 'Seafood'] },
      { id: 6, name: 'Beijing', country: 'China', region: 'Asia', lat: 39.9042, lng: 116.4074, price: 1099, days: 5, rating: 4.6, tags: ['History', 'Great Wall', 'Culture'] },
      { id: 7, name: 'Shanghai', country: 'China', region: 'Asia', lat: 31.2304, lng: 121.4737, price: 1199, days: 5, rating: 4.7, tags: ['Modern', 'Shopping', 'Food'] },
      { id: 8, name: 'Hong Kong', country: 'China', region: 'Asia', lat: 22.3193, lng: 114.1694, price: 1299, days: 5, rating: 4.8, tags: ['Skyline', 'Food', 'Shopping'] },
      { id: 9, name: 'Bangkok', country: 'Thailand', region: 'Asia', lat: 13.7563, lng: 100.5018, price: 899, days: 5, rating: 4.6, tags: ['Temples', 'Food', 'Markets'] },
      { id: 10, name: 'Chiang Mai', country: 'Thailand', region: 'Asia', lat: 18.7883, lng: 98.9853, price: 849, days: 4, rating: 4.7, tags: ['Mountains', 'Temples', 'Culture'] },
      { id: 11, name: 'Phuket', country: 'Thailand', region: 'Asia', lat: 7.8804, lng: 98.3923, price: 899, days: 5, rating: 4.5, tags: ['Beach', 'Islands', 'Nightlife'] },
      { id: 12, name: 'Singapore', country: 'Singapore', region: 'Asia', lat: 1.3521, lng: 103.8198, price: 1199, days: 4, rating: 4.8, tags: ['Modern', 'Food', 'Gardens'] },
      { id: 13, name: 'Kuala Lumpur', country: 'Malaysia', region: 'Asia', lat: 3.1390, lng: 101.6869, price: 949, days: 4, rating: 4.5, tags: ['Petronas', 'Food', 'Culture'] },
      { id: 14, name: 'Hanoi', country: 'Vietnam', region: 'Asia', lat: 21.0285, lng: 105.8542, price: 849, days: 5, rating: 4.6, tags: ['History', 'Food', 'Old Quarter'] },
      { id: 15, name: 'Ho Chi Minh City', country: 'Vietnam', region: 'Asia', lat: 10.8231, lng: 106.6297, price: 849, days: 4, rating: 4.5, tags: ['Markets', 'History', 'Food'] },
      // Europe
      { id: 16, name: 'Paris', country: 'France', region: 'Europe', lat: 48.8566, lng: 2.3522, price: 999, days: 4, rating: 4.7, tags: ['Romance', 'Art', 'Food'] },
      { id: 17, name: 'London', country: 'UK', region: 'Europe', lat: 51.5074, lng: -0.1278, price: 1099, days: 5, rating: 4.7, tags: ['History', 'Royal', 'Theatre'] },
      { id: 18, name: 'Rome', country: 'Italy', region: 'Europe', lat: 41.9028, lng: 12.4964, price: 949, days: 4, rating: 4.8, tags: ['History', 'Food', 'Art'] },
      { id: 19, name: 'Venice', country: 'Italy', region: 'Europe', lat: 45.4408, lng: 12.3155, price: 999, days: 4, rating: 4.7, tags: ['Canals', 'Romance', 'Art'] },
      { id: 20, name: 'Florence', country: 'Italy', region: 'Europe', lat: 43.7696, lng: 11.2558, price: 949, days: 4, rating: 4.8, tags: ['Renaissance', 'Art', 'Food'] },
      { id: 21, name: 'Barcelona', country: 'Spain', region: 'Europe', lat: 41.3851, lng: 2.1734, price: 899, days: 4, rating: 4.7, tags: ['Gaudi', 'Beach', 'Food'] },
      { id: 22, name: 'Madrid', country: 'Spain', region: 'Europe', lat: 40.4168, lng: -3.7038, price: 899, days: 4, rating: 4.6, tags: ['Art', 'Food', 'Nightlife'] },
      { id: 23, name: 'Amsterdam', country: 'Netherlands', region: 'Europe', lat: 52.3676, lng: 4.9041, price: 949, days: 4, rating: 4.7, tags: ['Canals', 'Museums', 'Cycling'] },
      { id: 24, name: 'Berlin', country: 'Germany', region: 'Europe', lat: 52.5200, lng: 13.4050, price: 899, days: 4, rating: 4.6, tags: ['History', 'Art', 'Nightlife'] },
      { id: 25, name: 'Munich', country: 'Germany', region: 'Europe', lat: 48.1351, lng: 11.5820, price: 899, days: 4, rating: 4.6, tags: ['Beer', 'Castles', 'Culture'] },
      { id: 26, name: 'Vienna', country: 'Austria', region: 'Europe', lat: 48.2082, lng: 16.3738, price: 949, days: 4, rating: 4.7, tags: ['Music', 'Palaces', 'Coffee'] },
      { id: 27, name: 'Prague', country: 'Czech Republic', region: 'Europe', lat: 50.0755, lng: 14.4378, price: 849, days: 4, rating: 4.7, tags: ['Castle', 'Beer', 'History'] },
      { id: 28, name: 'Budapest', country: 'Hungary', region: 'Europe', lat: 47.4979, lng: 19.0402, price: 849, days: 4, rating: 4.6, tags: ['Thermal', 'Danube', 'History'] },
      { id: 29, name: 'Lisbon', country: 'Portugal', region: 'Europe', lat: 38.7223, lng: -9.1393, price: 849, days: 4, rating: 4.7, tags: ['Trams', 'Food', 'Hills'] },
      { id: 30, name: 'Dublin', country: 'Ireland', region: 'Europe', lat: 53.3498, lng: -6.2603, price: 899, days: 4, rating: 4.6, tags: ['Pub', 'Literature', 'History'] },
      // Africa
      { id: 31, name: 'Cape Town', country: 'South Africa', region: 'Africa', lat: -33.9249, lng: 18.4241, price: 799, days: 4, rating: 4.9, tags: ['Table Mountain', 'Beach', 'Wine'] },
      { id: 32, name: 'Johannesburg', country: 'South Africa', region: 'Africa', lat: -26.2041, lng: 28.0473, price: 749, days: 4, rating: 4.5, tags: ['City', 'Culture', 'History'] },
      { id: 33, name: 'Durban', country: 'South Africa', region: 'Africa', lat: -29.8587, lng: 31.0218, price: 749, days: 4, rating: 4.5, tags: ['Beach', 'Indian Food', 'Warm'] },
      { id: 34, name: 'Marrakech', country: 'Morocco', region: 'Africa', lat: 31.6295, lng: -7.9811, price: 899, days: 5, rating: 4.7, tags: ['Souk', 'Medina', 'Desert'] },
      { id: 35, name: 'Cairo', country: 'Egypt', region: 'Africa', lat: 30.0444, lng: 31.2357, price: 949, days: 5, rating: 4.6, tags: ['Pyramids', 'Nile', 'History'] },
      { id: 36, name: 'Nairobi', country: 'Kenya', region: 'Africa', lat: -1.2921, lng: 36.8219, price: 999, days: 6, rating: 4.6, tags: ['Safari', 'Wildlife', 'Culture'] },
      { id: 37, name: 'Zanzibar', country: 'Tanzania', region: 'Africa', lat: -6.1659, lng: 39.2026, price: 1099, days: 6, rating: 4.8, tags: ['Beach', 'Spice', 'History'] },
      { id: 38, name: 'Victoria Falls', country: 'Zimbabwe', region: 'Africa', lat: -17.9243, lng: 25.8569, price: 999, days: 5, rating: 4.9, tags: ['Waterfall', 'Adventure', 'Nature'] },
      { id: 39, name: 'Mauritius', country: 'Mauritius', region: 'Africa', lat: -20.3484, lng: 57.5522, price: 1199, days: 7, rating: 4.8, tags: ['Beach', 'Luxury', 'Lagoon'] },
      { id: 40, name: 'Seychelles', country: 'Seychelles', region: 'Africa', lat: -4.6796, lng: 55.4920, price: 1299, days: 7, rating: 4.9, tags: ['Beach', 'Islands', 'Nature'] },
      // Americas
      { id: 41, name: 'New York', country: 'USA', region: 'Americas', lat: 40.7128, lng: -74.0060, price: 1199, days: 4, rating: 4.8, tags: ['City', 'Culture', 'Shopping'] },
      { id: 42, name: 'Los Angeles', country: 'USA', region: 'Americas', lat: 34.0522, lng: -118.2437, price: 1199, days: 4, rating: 4.6, tags: ['Hollywood', 'Beach', 'Entertainment'] },
      { id: 43, name: 'San Francisco', country: 'USA', region: 'Americas', lat: 37.7749, lng: -122.4194, price: 1199, days: 4, rating: 4.7, tags: ['Golden Gate', 'Tech', 'Hills'] },
      { id: 44, name: 'Chicago', country: 'USA', region: 'Americas', lat: 41.8781, lng: -87.6298, price: 1099, days: 4, rating: 4.6, tags: ['Architecture', 'Food', 'Lake'] },
      { id: 45, name: 'Miami', country: 'USA', region: 'Americas', lat: 25.7617, lng: -80.1918, price: 1099, days: 4, rating: 4.6, tags: ['Beach', 'Nightlife', 'Art Deco'] },
      { id: 46, name: 'Cancun', country: 'Mexico', region: 'Americas', lat: 21.1619, lng: -86.8515, price: 999, days: 5, rating: 4.7, tags: ['Beach', 'Resort', 'Mayan'] },
      { id: 47, name: 'Mexico City', country: 'Mexico', region: 'Americas', lat: 19.4326, lng: -99.1332, price: 949, days: 4, rating: 4.6, tags: ['History', 'Food', 'Culture'] },
      { id: 48, name: 'Rio de Janeiro', country: 'Brazil', region: 'Americas', lat: -22.9068, lng: -43.1729, price: 1099, days: 6, rating: 4.8, tags: ['Christ', 'Carnival', 'Beach'] },
      { id: 49, name: 'Buenos Aires', country: 'Argentina', region: 'Americas', lat: -34.6037, lng: -58.3816, price: 999, days: 5, rating: 4.7, tags: ['Tango', 'Food', 'European'] },
      { id: 50, name: 'Lima', country: 'Peru', region: 'Americas', lat: -12.0464, lng: -77.0428, price: 949, days: 5, rating: 4.6, tags: ['Food', 'History', 'Coast'] },
      // Oceania
      { id: 51, name: 'Sydney', country: 'Australia', region: 'Oceania', lat: -33.8688, lng: 151.2093, price: 1499, days: 7, rating: 4.8, tags: ['Opera', 'Harbour', 'Beach'] },
      { id: 52, name: 'Melbourne', country: 'Australia', region: 'Oceania', lat: -37.8136, lng: 144.9631, price: 1399, days: 6, rating: 4.7, tags: ['Coffee', 'Art', 'Sport'] },
      { id: 53, name: 'Auckland', country: 'New Zealand', region: 'Oceania', lat: -36.8485, lng: 174.7633, price: 1399, days: 6, rating: 4.7, tags: ['Harbour', 'Islands', 'Adventure'] },
      { id: 54, name: 'Queenstown', country: 'New Zealand', region: 'Oceania', lat: -45.0312, lng: 168.6626, price: 1499, days: 6, rating: 4.9, tags: ['Adventure', 'Scenery', 'Ski'] },
      { id: 55, name: 'Fiji', country: 'Fiji', region: 'Oceania', lat: -17.7134, lng: 178.0650, price: 1399, days: 7, rating: 4.8, tags: ['Islands', 'Beach', 'Diving'] }
    ]

    const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])

    const getMarkerIcon = (region) => {
      const iconMap = {
        'Asia': markerIcons.asia,
        'Europe': markerIcons.europe,
        'Africa': markerIcons.africa,
        'Americas': markerIcons.americas,
        'Oceania': markerIcons.oceania
      }
      return iconMap[region] || markerIcons.asia
    }

    const initGlobe = () => {
      // 1. Safety Check: Ensure the DOM element exists.
      // globeContainer.value refers to the template ref (e.g., <div ref="globeContainer">).
      // If the component hasn't rendered yet or the element is missing, we exit 
      // to prevent "Cannot read property of null" errors when initializing the library.
      if (!globeContainer.value) return

      // 2. Cleanup: Prevent memory leaks and duplicate globes.
      // If globe.value already holds an instance (e.g., this function was called twice),
      // we need to properly dismantle the old one before creating a new one.
      if (globe.value) {
        // _destructor() is a specific internal cleanup method that removes event listeners,
        // stops the animation loop, and clears the WebGL context from memory.
        globe.value._destructor()
      }

      try {
        // Initialize globe with proper dimensions
        const width = globeContainer.value.clientWidth || 800
        const height = globeContainer.value.clientHeight || 500

        globe.value = Globe()(globeContainer.value)
          .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
          .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
          .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
          .width(width)
          .height(height)
          .showAtmosphere(true)
          .atmosphereColor('#00D4FF')
          .atmosphereAltitude(0.25)
          .showGraticules(false)
          .showGlobe(true)
          .pointOfView({ lat: 20, lng: 0, altitude: 2.5 })

        // Add markers
        updateMarkers()

        globeReady.value = true
        console.log('Globe initialized successfully with', destinations.length, 'destinations')
      } catch (error) {
        console.error('Failed to initialize globe:', error)
      }
    }

    const updateMarkers = () => {
      if (!globe.value) return

      // Clear existing markers
      globe.value.htmlElementsData([])

      // Add markers - show all when allMarkersVisible is true
      const markersToShow = allMarkersVisible.value ? destinations : []
      
      globe.value
        .htmlElementsData(markersToShow)
        .htmlLat(d => d.lat)
        .htmlLng(d => d.lng)
        .htmlElement(d => {
          const container = document.createElement('div')
          container.style.position = 'relative'
          container.style.pointerEvents = 'auto'
          container.style.cursor = 'pointer'
          container.style.zIndex = '10'
          container.style.transition = 'transform 0.2s'
          
          // Create marker element
          const marker = document.createElement('div')
          marker.innerHTML = getMarkerIcon(d.region)
          marker.style.transition = 'transform 0.2s'
          marker.style.transform = 'scale(1)'
          marker.style.filter = 'drop-shadow(0 0 5px rgba(255,255,255,0.5))'
          
          // Create tooltip
          const tooltip = document.createElement('div')
          tooltip.textContent = d.name
          tooltip.style.position = 'absolute'
          tooltip.style.bottom = '100%'
          tooltip.style.left = '50%'
          tooltip.style.transform = 'translateX(-50%)'
          tooltip.style.marginBottom = '8px'
          tooltip.style.padding = '4px 8px'
          tooltip.style.background = '#0B1E33'
          tooltip.style.color = '#F5F9FF'
          tooltip.style.borderRadius = '4px'
          tooltip.style.fontSize = '12px'
          tooltip.style.whiteSpace = 'nowrap'
          tooltip.style.border = '1px solid #00D4FF'
          tooltip.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)'
          tooltip.style.display = 'none'
          tooltip.style.zIndex = '20'
          
          container.appendChild(marker)
          container.appendChild(tooltip)
          
          // Hover events
          container.addEventListener('mouseenter', () => {
            marker.style.transform = 'scale(1.2)'
            tooltip.style.display = 'block'
          })
          
          container.addEventListener('mouseleave', () => {
            marker.style.transform = 'scale(1)'
            tooltip.style.display = 'none'
          })
          
          // Click event
          container.addEventListener('click', (event) => {
            event.stopPropagation()
            if (!isAnimating.value && props.interactive) {
              showDestinationPopup(d, event)
            }
          })
          
          return container
        })
    }

    const showDestinationPopup = (destination, event) => {
      selectedDestination.value = destination
      
      // Calculate popup position based on click event
      if (event && globeContainer.value) {
        const rect = globeContainer.value.getBoundingClientRect()
        popupPosition.value = {
          left: event.clientX - rect.left - 150, // Center popup (300px width/2)
          top: event.clientY - rect.top - 200 // Position above click
        }
      } else {
        // Default position
        popupPosition.value = {
          left: globeContainer.value?.clientWidth / 2 - 150 || 0,
          top: 100
        }
      }
      
      emit('locationSelected', destination)
    }

    // MAIN SPIN FUNCTION - Spins and picks random destination
    const spinGlobe = () => {
      return new Promise((resolve) => {
        if (isAnimating.value || !globe.value) {
          resolve()
          return
        }

        console.log('Spinning globe and selecting random destination...')
        isAnimating.value = true
        selectedDestination.value = null // Clear any existing popup
        emit('spin')

        // Hide all markers during spin for cleaner look
        allMarkersVisible.value = false
        globe.value.htmlElementsData([])

        // Get current position
        const currentPov = globe.value.pointOfView()
        const startLat = currentPov.lat || 20
        const startLng = currentPov.lng || 0
        
        // Spin animation parameters
        const spins = 4 // Number of full rotations
        const spinDuration = 3000 // 3 seconds
        const startTime = Date.now()

        // Animate spin
        const animateSpin = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / spinDuration, 1)
          
          // Calculate new position - smooth rotation
          const newLng = (startLng + (360 * spins * progress)) % 360
          const newLat = startLat + Math.sin(progress * Math.PI * 2) * 15
          
          // Update globe position
          globe.value.pointOfView({
            lat: newLat,
            lng: newLng,
            altitude: 2.5,
            transitionDuration: 0
          })

          if (progress < 1) {
            requestAnimationFrame(animateSpin)
          } else {
            // Spin complete - pick random destination
            setTimeout(() => {
              // Select random destination from array
              const randomIndex = Math.floor(Math.random() * destinations.length)
              const randomDestination = destinations[randomIndex]
              
              console.log('Selected random destination:', randomDestination.name)
              
              // Show only the selected destination marker
              allMarkersVisible.value = false
              globe.value.htmlElementsData([randomDestination])
              
              // Center globe on selected destination
              globe.value.pointOfView({
                lat: randomDestination.lat,
                lng: randomDestination.lng,
                altitude: 1.5,
                transitionDuration: 1000
              })
              
              // Show popup after centering
              setTimeout(() => {
                showDestinationPopup(randomDestination)
                isAnimating.value = false
                emit('spin-complete')
                resolve(randomDestination)
              }, 1000)
              
            }, 100)
          }
        }

        requestAnimationFrame(animateSpin)
      })
    }

    const resetView = () => {
      if (!globe.value) return
      
      globe.value.pointOfView({ 
        lat: 20, 
        lng: 0, 
        altitude: 2.5,
        transitionDuration: 1500 
      })
      
      // Show all markers again
      allMarkersVisible.value = true
      updateMarkers()
      selectedDestination.value = null
    }

    const handleBooking = () => {
      console.log("Clicked booking")
      console.log("Auth:", isAuthenticated.value)
      console.log("Destination:", selectedDestination.value)

      if (isAuthenticated.value && selectedDestination.value) {
        localStorage.setItem(
          'selected_destination',
          JSON.stringify(selectedDestination.value)
        )

        console.log("Pushing route...")
        router.push('/bookings')
      } else {
        console.log("Blocked by condition")
        store.commit('SHOW_NOTIFICATION', {
          message: 'Please sign in to book this destination',
          type: 'info'
        })
      }
    }

    const handleResize = () => {
      if (globe.value && globeContainer.value) {
        globe.value.width(globeContainer.value.clientWidth)
        globe.value.height(globeContainer.value.clientHeight)
      }
    }

    onMounted(() => {
      console.log('Mounting globe component...')
      nextTick(() => {
        initGlobe()
        window.addEventListener('resize', handleResize)
      })
    })

    onUnmounted(() => {
      if (globe.value) {
        globe.value._destructor()
      }
      window.removeEventListener('resize', handleResize)
    })

    const popupStyle = computed(() => ({
      left: popupPosition.value.left + 'px',
      top: popupPosition.value.top + 'px'
    }))

    // EXPOSE THE METHOD TO PARENT COMPONENT
    defineExpose({
      spinGlobe,
      resetView
    })

    return {
      globeContainer,
      globeReady,
      selectedDestination,
      popupStyle,
      spinGlobe,
      resetView,
      handleBooking
    }
  }
}
</script>

<style scoped>
.realistic-globe {
  width: 100%;
  height: 500px;
  position: relative;
  background: #000;
  border-radius: 20px;
  overflow: hidden;
}

/* Loading overlay */
.globe-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #0a0a2a, #000);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  color: white;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 107, 107, 0.3);
  border-top-color: #FF6B6B;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Destination Popup */
.destination-popup {
  position: absolute;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  z-index: 100;
  width: 300px;
  animation: popupFade 0.3s ease;
  border: 2px solid #FF6B6B;
}

@keyframes popupFade {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.popup-close {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s;
}

.popup-close:hover {
  background: #f0f0f0;
  color: #333;
}

.destination-popup h3 {
  font-size: 1.4rem;
  color: #333;
  margin-bottom: 5px;
  padding-right: 20px;
}

.destination-popup .country {
  color: #FF6B6B;
  font-size: 0.9rem;
  margin-bottom: 15px;
}

.popup-details {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.popup-details span {
  font-size: 0.95rem;
  font-weight: 600;
}

.popup-details .price {
  color: #28A745;
}

.popup-details .days {
  color: #4A6FA5;
}

.popup-details .rating {
  color: #FFC107;
}

.popup-tags {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  margin-bottom: 15px;
}

.tag {
  background: #f0f0f0;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  color: #666;
}

.book-btn {
  width: 100%;
  padding: 12px;
  background: #FF6B6B;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.book-btn:hover {
  background: #FF5252;
  transform: translateY(-2px);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Dark mode */
:root.dark-mode .destination-popup {
  background: #0B1E33;
  border-color: #00D4FF;
}

:root.dark-mode .destination-popup h3 {
  color: #F5F9FF;
}

:root.dark-mode .destination-popup .country {
  color: #00D4FF;
}

:root.dark-mode .tag {
  background: #122B44;
  color: #B0C4DE;
  border: 1px solid #1A334D;
}

:root.dark-mode .popup-close:hover {
  background: #1A334D;
  color: #F5F9FF;
}

:root.dark-mode .loading-spinner {
  border-top-color: #00D4FF;
}

/* Responsive */
@media (max-width: 768px) {
  .realistic-globe {
    height: 350px;
  }
  
  .destination-popup {
    width: 250px;
    left: 50% !important;
    transform: translateX(-50%);
    top: 50px !important;
  }
}

@media (max-width: 480px) {
  .realistic-globe {
    height: 300px;
  }
}
</style>