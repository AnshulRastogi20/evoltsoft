<template>
  <div class="map-view">
    <!-- Header Section -->
    <div class="header-section bg-white shadow-sm border-bottom">
      <div class="container-fluid py-3">
        <div class="row align-items-center">
          <div class="col-md-6">
            <h4 class="mb-0">
              <i class="fas fa-map-marked-alt me-2 text-primary"></i>
              Charging Stations Map
            </h4>
            <p class="text-muted mb-0 small">Find charging stations near you</p>
          </div>
          <div class="col-md-6">
            <div class="d-flex justify-content-end">
              <button
                class="btn btn-primary me-2"
                @click="showStationModal = true"
              >
                <i class="fas fa-plus me-2"></i>
                Add Station
              </button>
              <button
                class="btn btn-outline-primary"
                @click="getCurrentLocation"
                :disabled="locationLoading"
              >
                <span v-if="locationLoading" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="fas fa-location-arrow me-2"></i>
                My Location
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Map Controls -->
    <div class="controls-section bg-light border-bottom">
      <div class="container-fluid py-2">
        <div class="row align-items-center">
          <div class="col-md-4">
            <div class="input-group input-group-sm">
              <span class="input-group-text">
                <i class="fas fa-search"></i>
              </span>
              <input
                v-model="searchQuery"
                type="text"
                class="form-control"
                placeholder="Search stations..."
              />
            </div>
          </div>
          <div class="col-md-4">
            <select v-model="statusFilter" class="form-select form-select-sm">
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
          <div class="col-md-4">
            <select v-model="connectorFilter" class="form-select form-select-sm">
              <option value="">All Connectors</option>
              <option value="Type 1">Type 1</option>
              <option value="Type 2">Type 2</option>
              <option value="CCS">CCS</option>
              <option value="CHAdeMO">CHAdeMO</option>
              <option value="Tesla">Tesla</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Map Container -->
    <div class="map-container">
      <div id="map" class="map" ref="mapContainer"></div>
      
      <!-- Loading Overlay -->
      <div v-if="loading" class="map-loading">
        <div class="text-center">
          <div class="spinner-border text-primary mb-3"></div>
          <p>Loading stations...</p>
        </div>
      </div>
    </div>

    <!-- Station Info Panel -->
    <div v-if="selectedStation" class="station-info-panel">
      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h6 class="mb-0">
            <i class="fas fa-charging-station me-2"></i>
            {{ selectedStation.name }}
          </h6>
          <button class="btn btn-sm btn-outline-secondary" @click="closeStationInfo">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-12 mb-2">
              <span class="badge" :class="getStatusBadgeClass(selectedStation.status)">
                {{ selectedStation.status }}
              </span>
              <span v-if="selectedStation.isAvailable" class="badge bg-success ms-2">Available</span>
              <span v-else class="badge bg-danger ms-2">Unavailable</span>
            </div>
            <div class="col-12 mb-2">
              <small class="text-muted">Address:</small>
              <div>{{ selectedStation.location?.address }}</div>
            </div>
            <div class="col-6 mb-2">
              <small class="text-muted">Power Output:</small>
              <div>{{ selectedStation.powerOutput }} kW</div>
            </div>
            <div class="col-6 mb-2">
              <small class="text-muted">Connector:</small>
              <div>{{ selectedStation.connectorType }}</div>
            </div>
            <div v-if="selectedStation.pricePerKWh" class="col-6 mb-2">
              <small class="text-muted">Price:</small>
              <div>₹{{ selectedStation.pricePerKWh }}/kWh</div>
            </div>
            <div v-if="selectedStation.description" class="col-12 mb-2">
              <small class="text-muted">Description:</small>
              <div class="small">{{ selectedStation.description }}</div>
            </div>
          </div>
          <div class="btn-group w-100 mt-3">
            <button
              class="btn btn-sm btn-outline-primary"
              @click="editStation(selectedStation)"
            >
              <i class="fas fa-edit me-1"></i>
              Edit
            </button>
            <button
              class="btn btn-sm btn-outline-info"
              @click="getDirections(selectedStation)"
            >
              <i class="fas fa-route me-1"></i>
              Directions
            </button>
            <button
              class="btn btn-sm btn-outline-danger"
              @click="confirmDelete(selectedStation)"
            >
              <i class="fas fa-trash me-1"></i>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Click Coordinates Modal -->
    <div v-if="showCoordinatesModal" class="modal fade show d-block" style="background-color: rgba(0,0,0,0.5)">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-map-pin me-2"></i>
              Add Station at Location
            </h5>
            <button type="button" class="btn-close" @click="showCoordinatesModal = false"></button>
          </div>
          <div class="modal-body">
            <p>Do you want to add a new charging station at these coordinates?</p>
            <div class="row">
              <div class="col-6">
                <label class="form-label">Latitude:</label>
                <input type="text" class="form-control" :value="clickedCoordinates.lat" readonly />
              </div>
              <div class="col-6">
                <label class="form-label">Longitude:</label>
                <input type="text" class="form-control" :value="clickedCoordinates.lng" readonly />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showCoordinatesModal = false">
              Cancel
            </button>
            <button type="button" class="btn btn-primary" @click="addStationAtLocation">
              <i class="fas fa-plus me-2"></i>
              Add Station
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Station Modal -->
    <StationModal
      :show="showStationModal"
      :station="editingStation"
      @close="closeStationModal"
      @saved="handleStationSaved"
    />

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmModal
      :show="showDeleteModal"
      :item="stationToDelete"
      item-type="charging station"
      @confirm="handleDelete"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useStationsStore } from '@/stores/stations'
import { useToast } from 'vue-toastification'
import StationModal from '@/components/StationModal.vue'
import DeleteConfirmModal from '@/components/DeleteConfirmModal.vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const stationsStore = useStationsStore()
const toast = useToast()

// Refs
const mapContainer = ref(null)
const loading = ref(false)
const locationLoading = ref(false)
const map = ref(null)
const markers = ref([])
const userLocationMarker = ref(null)

// Modal states
const showStationModal = ref(false)
const showDeleteModal = ref(false)
const showCoordinatesModal = ref(false)

// Data
const selectedStation = ref(null)
const editingStation = ref(null)
const stationToDelete = ref(null)
const clickedCoordinates = reactive({ lat: 0, lng: 0 })

// Filters
const searchQuery = ref('')
const statusFilter = ref('')
const connectorFilter = ref('')

// Computed
const filteredStations = computed(() => {
  let stations = stationsStore.stations

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    stations = stations.filter(station =>
      station.name.toLowerCase().includes(query) ||
      station.location?.address.toLowerCase().includes(query)
    )
  }

  if (statusFilter.value) {
    stations = stations.filter(station => station.status === statusFilter.value)
  }

  if (connectorFilter.value) {
    stations = stations.filter(station => station.connectorType === connectorFilter.value)
  }

  return stations
})

// Methods
const initMap = () => {
  // Ensure DOM element exists
  if (!mapContainer.value) {
    console.error('Map container not found')
    return
  }

  try {
    // Default to Delhi, India
    const defaultCenter = [28.6139, 77.2090]
    
    map.value = L.map(mapContainer.value).setView(defaultCenter, 10)

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map.value)

    // Add click handler for adding new stations
    map.value.on('click', (e) => {
      clickedCoordinates.lat = e.latlng.lat.toFixed(6)
      clickedCoordinates.lng = e.latlng.lng.toFixed(6)
      showCoordinatesModal.value = true
    })
  } catch (error) {
    console.error('Error initializing map:', error)
    toast.error('Failed to initialize map')
  }
}

const loadStations = async () => {
  loading.value = true
  try {
    await stationsStore.fetchStations()
    updateMarkers()
  } catch (error) {
    toast.error('Failed to load charging stations')
  } finally {
    loading.value = false
  }
}

const updateMarkers = () => {
  try {
    // Ensure map exists
    if (!map.value) {
      console.warn('Map not initialized, skipping marker update')
      return
    }

    // Clear existing markers
    markers.value.forEach(marker => {
      try {
        map.value.removeLayer(marker)
      } catch (error) {
        console.warn('Error removing marker:', error)
      }
    })
    markers.value = []

    // Add markers for filtered stations
    filteredStations.value.forEach(station => {
      if (station.location?.coordinates) {
        try {
          const [lng, lat] = station.location.coordinates
          
          // Create custom icon based on status
          const iconColor = getStatusColor(station.status)
          const icon = L.divIcon({
            className: 'custom-station-marker',
            html: `<div style="background-color: ${iconColor}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          })

          const marker = L.marker([lat, lng], { icon })
            .addTo(map.value)
            .on('click', () => {
              selectedStation.value = station
            })

          // Add popup
          marker.bindPopup(`
            <div>
              <h6>${station.name}</h6>
              <p class="mb-1">${station.location.address}</p>
              <small>
                <span class="badge" style="background-color: ${iconColor}">${station.status}</span>
                ${station.powerOutput} kW • ${station.connectorType}
              </small>
            </div>
          `)

          markers.value.push(marker)
        } catch (error) {
          console.error('Error adding marker for station:', station.name, error)
        }
      }
    })
  } catch (error) {
    console.error('Error updating markers:', error)
  }
}

const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    toast.error('Geolocation is not supported by this browser')
    return
  }

  locationLoading.value = true

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords
      
      // Remove existing user location marker
      if (userLocationMarker.value) {
        map.value.removeLayer(userLocationMarker.value)
      }

      // Add user location marker
      const userIcon = L.divIcon({
        className: 'user-location-marker',
        html: '<div style="background-color: #007bff; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      })

      userLocationMarker.value = L.marker([latitude, longitude], { icon: userIcon })
        .addTo(map.value)
        .bindPopup('Your Location')

      // Center map on user location
      map.value.setView([latitude, longitude], 13)
      
      locationLoading.value = false
      toast.success('Location found!')
    },
    (error) => {
      locationLoading.value = false
      toast.error('Unable to get your location')
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000
    }
  )
}

const getStatusColor = (status) => {
  switch (status) {
    case 'Active': return '#28a745'
    case 'Inactive': return '#dc3545'
    case 'Maintenance': return '#ffc107'
    default: return '#6c757d'
  }
}

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'Active': return 'bg-success'
    case 'Inactive': return 'bg-danger'
    case 'Maintenance': return 'bg-warning text-dark'
    default: return 'bg-secondary'
  }
}

const closeStationInfo = () => {
  selectedStation.value = null
}

const editStation = (station) => {
  editingStation.value = station
  showStationModal.value = true
  closeStationInfo()
}

const confirmDelete = (station) => {
  stationToDelete.value = station
  showDeleteModal.value = true
  closeStationInfo()
}

const handleDelete = async () => {
  if (stationToDelete.value) {
    const result = await stationsStore.deleteStation(stationToDelete.value._id)
    if (result.success) {
      updateMarkers()
    }
    showDeleteModal.value = false
    stationToDelete.value = null
  }
}

const getDirections = (station) => {
  if (station.location?.coordinates) {
    const [lng, lat] = station.location.coordinates
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
    window.open(url, '_blank')
  }
}

const addStationAtLocation = () => {
  editingStation.value = {
    location: {
      coordinates: [parseFloat(clickedCoordinates.lng), parseFloat(clickedCoordinates.lat)]
    }
  }
  showCoordinatesModal.value = false
  showStationModal.value = true
}

const closeStationModal = () => {
  showStationModal.value = false
  editingStation.value = null
}

const handleStationSaved = () => {
  closeStationModal()
  loadStations()
}

// Watchers
watch([searchQuery, statusFilter, connectorFilter], () => {
  updateMarkers()
})

// Lifecycle
onMounted(async () => {
  await nextTick()
  try {
    initMap()
    loadStations()
  } catch (error) {
    console.error('Error during component mount:', error)
  }
})

onUnmounted(() => {
  if (map.value) {
    map.value.remove()
  }
})
</script>

<style scoped>
.map-view {
  height: calc(100vh - 56px); /* Subtract navbar height */
  display: flex;
  flex-direction: column;
  width: 100%;
}

.header-section {
  flex-shrink: 0;
}

.controls-section {
  flex-shrink: 0;
}

.map-container {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.map {
  width: 100%;
  height: 100%;
}

.map-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.station-info-panel {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 300px;
  z-index: 1000;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
}

.station-info-panel .card {
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .station-info-panel {
    left: 20px;
    right: 20px;
    width: auto;
  }
  
  .controls-section .row > div {
    margin-bottom: 0.5rem;
  }
}
</style>

<style>
.leaflet-popup-content {
  margin: 8px 12px;
}

.custom-station-marker {
  background: transparent;
  border: none;
}

.user-location-marker {
  background: transparent;
  border: none;
}
</style>
