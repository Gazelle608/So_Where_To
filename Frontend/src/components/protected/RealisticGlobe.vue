<template>
  <div class="realistic-globe" ref="globeContainer">
    <!-- Loading overlay (only shown while globe is initializing) -->
    <div v-if="!globeReady" class="globe-loading">
      <div class="loading-spinner"></div>
      <p>Loading 3D Globe...</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, defineExpose, nextTick } from 'vue'
import Globe from 'globe.gl'

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
    const globeContainer = ref(null)
    const globe = ref(null)
    const globeReady = ref(false)
    const isAnimating = ref(false)

    // Destinations data (simplified for demo)
    const destinations = [
      // Asia
      { id: 1, name: 'Tokyo', country: 'Japan', region: 'Asia', lat: 35.6762, lng: 139.6503, price: 1299, days: 5, rating: 4.8 },
      { id: 2, name: 'Seoul', country: 'South Korea', region: 'Asia', lat: 37.5665, lng: 126.9780, price: 1199, days: 5, rating: 4.7 },
      { id: 3, name: 'Bangkok', country: 'Thailand', region: 'Asia', lat: 13.7563, lng: 100.5018, price: 899, days: 5, rating: 4.6 },
      { id: 4, name: 'Singapore', country: 'Singapore', region: 'Asia', lat: 1.3521, lng: 103.8198, price: 1199, days: 4, rating: 4.8 },
      // Europe
      { id: 5, name: 'Paris', country: 'France', region: 'Europe', lat: 48.8566, lng: 2.3522, price: 999, days: 4, rating: 4.7 },
      { id: 6, name: 'London', country: 'UK', region: 'Europe', lat: 51.5074, lng: -0.1278, price: 1099, days: 5, rating: 4.7 },
      { id: 7, name: 'Rome', country: 'Italy', region: 'Europe', lat: 41.9028, lng: 12.4964, price: 949, days: 4, rating: 4.8 },
      { id: 8, name: 'Barcelona', country: 'Spain', region: 'Europe', lat: 41.3851, lng: 2.1734, price: 899, days: 4, rating: 4.7 },
      // Africa
      { id: 9, name: 'Cape Town', country: 'South Africa', region: 'Africa', lat: -33.9249, lng: 18.4241, price: 799, days: 4, rating: 4.9 },
      { id: 10, name: 'Marrakech', country: 'Morocco', region: 'Africa', lat: 31.6295, lng: -7.9811, price: 899, days: 5, rating: 4.7 },
      { id: 11, name: 'Cairo', country: 'Egypt', region: 'Africa', lat: 30.0444, lng: 31.2357, price: 949, days: 5, rating: 4.6 },
      // Americas
      { id: 12, name: 'New York', country: 'USA', region: 'Americas', lat: 40.7128, lng: -74.0060, price: 1199, days: 4, rating: 4.8 },
      { id: 13, name: 'Rio de Janeiro', country: 'Brazil', region: 'Americas', lat: -22.9068, lng: -43.1729, price: 1099, days: 6, rating: 4.8 },
      { id: 14, name: 'Cancun', country: 'Mexico', region: 'Americas', lat: 21.1619, lng: -86.8515, price: 999, days: 5, rating: 4.7 },
      // Oceania
      { id: 15, name: 'Sydney', country: 'Australia', region: 'Oceania', lat: -33.8688, lng: 151.2093, price: 1499, days: 7, rating: 4.8 },
      { id: 16, name: 'Auckland', country: 'New Zealand', region: 'Oceania', lat: -36.8485, lng: 174.7633, price: 1399, days: 6, rating: 4.7 },
    ]

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
      if (!globeContainer.value) return

      // Clear any existing globe
      if (globe.value) {
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
        console.log('Globe initialized successfully')
      } catch (error) {
        console.error('Failed to initialize globe:', error)
      }
    }

    const updateMarkers = () => {
      if (!globe.value) return

      // Clear existing markers
      globe.value.htmlElementsData([])

      // Add markers
      globe.value
        .htmlElementsData(destinations)
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
              emit('locationSelected', d)
            }
          })
          
          return container
        })
    }

    // 🔥 CRITICAL: This is the method that will be called from parent
    const spinGlobe = () => {
      return new Promise((resolve) => {
        if (isAnimating.value || !globe.value) {
          resolve()
          return
        }

        console.log('Spinning globe...')
        isAnimating.value = true
        emit('spin')

        // Get current position
        const currentPov = globe.value.pointOfView()
        const startLat = currentPov.lat || 20
        const startLng = currentPov.lng || 0
        
        // Spin animation parameters
        const spins = 3
        const spinDuration = 2000
        const startTime = Date.now()

        // Animate spin
        const animateSpin = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / spinDuration, 1)
          
          // Calculate new position
          const newLng = (startLng + (360 * spins * progress)) % 360
          const newLat = startLat + Math.sin(progress * Math.PI * 2) * 10
          
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
            // Spin complete
            setTimeout(() => {
              isAnimating.value = false
              emit('spin-complete')
              resolve()
            }, 100)
          }
        }

        requestAnimationFrame(animateSpin)
      })
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

    // 🔥 EXPOSE THE METHOD TO PARENT COMPONENT
    defineExpose({
      spinGlobe
    })

    return {
      globeContainer,
      globeReady,
      spinGlobe // Also return for template use if needed
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

/* Dark mode adjustments */
:root.dark-mode .loading-spinner {
  border-top-color: #00D4FF;
}

/* Responsive */
@media (max-width: 768px) {
  .realistic-globe {
    height: 350px;
  }
}

@media (max-width: 480px) {
  .realistic-globe {
    height: 300px;
  }
}
</style>