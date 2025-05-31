<template>
  <div class="container-fluid py-4">
    <!-- Page Header -->
    <div class="row mb-4">
      <div class="col">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h1 class="h3 mb-1">Dashboard</h1>
            <p class="text-muted mb-0">Manage your charging stations</p>
          </div>
          <button
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#stationModal"
            @click="openStationModal()"
          >
            <i class="fas fa-plus me-2"></i>
            Add Station
          </button>
        </div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="row mb-4">
      <div class="col-xl-3 col-md-6 mb-3">
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="flex-shrink-0">
                <div class="bg-primary text-white rounded-circle p-3">
                  <i class="fas fa-charging-station"></i>
                </div>
              </div>
              <div class="flex-grow-1 ms-3">
                <h6 class="text-muted mb-1">Total Stations</h6>
                <h4 class="mb-0">{{ stationsStore.stats.totalStations }}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-3 col-md-6 mb-3">
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="flex-shrink-0">
                <div class="bg-success text-white rounded-circle p-3">
                  <i class="fas fa-check-circle"></i>
                </div>
              </div>
              <div class="flex-grow-1 ms-3">
                <h6 class="text-muted mb-1">Active Stations</h6>
                <h4 class="mb-0">{{ stationsStore.activeStations.length }}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-3 col-md-6 mb-3">
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="flex-shrink-0">
                <div class="bg-warning text-white rounded-circle p-3">
                  <i class="fas fa-tools"></i>
                </div>
              </div>
              <div class="flex-grow-1 ms-3">
                <h6 class="text-muted mb-1">Maintenance</h6>
                <h4 class="mb-0">{{ stationsStore.maintenanceStations.length }}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-3 col-md-6 mb-3">
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="flex-shrink-0">
                <div class="bg-info text-white rounded-circle p-3">
                  <i class="fas fa-bolt"></i>
                </div>
              </div>
              <div class="flex-grow-1 ms-3">
                <h6 class="text-muted mb-1">Avg Power</h6>
                <h4 class="mb-0">{{ avgPower }} kW</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="row mb-4">
      <div class="col">
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-3">
                <label class="form-label">Search</label>
                <input
                  v-model="searchQuery"
                  type="text"
                  class="form-control"
                  placeholder="Search stations..."
                  @input="handleSearch"
                />
              </div>
              <div class="col-md-2">
                <label class="form-label">Status</label>
                <select
                  v-model="filters.status"
                  class="form-select"
                  @change="handleFilterChange"
                >
                  <option value="">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
              <div class="col-md-2">
                <label class="form-label">Connector</label>
                <select
                  v-model="filters.connectorType"
                  class="form-select"
                  @change="handleFilterChange"
                >
                  <option value="">All Types</option>
                  <option value="Type 1">Type 1</option>
                  <option value="Type 2">Type 2</option>
                  <option value="CCS">CCS</option>
                  <option value="CHAdeMO">CHAdeMO</option>
                  <option value="Tesla">Tesla</option>
                </select>
              </div>
              <div class="col-md-2">
                <label class="form-label">Min Power</label>
                <input
                  v-model="filters.minPower"
                  type="number"
                  class="form-control"
                  placeholder="kW"
                  @input="handleFilterChange"
                />
              </div>
              <div class="col-md-2">
                <label class="form-label">Max Power</label>
                <input
                  v-model="filters.maxPower"
                  type="number"
                  class="form-control"
                  placeholder="kW"
                  @input="handleFilterChange"
                />
              </div>
              <div class="col-md-1">
                <label class="form-label">&nbsp;</label>
                <button
                  class="btn btn-outline-secondary w-100"
                  @click="clearFilters"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stations Table -->
    <div class="row">
      <div class="col">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-white">
            <h5 class="mb-0">Charging Stations</h5>
          </div>
          <div class="card-body p-0">
            <div v-if="stationsStore.loading" class="text-center py-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            
            <div v-else-if="stationsStore.stations.length === 0" class="text-center py-5">
              <i class="fas fa-charging-station text-muted" style="font-size: 3rem;"></i>
              <h5 class="text-muted mt-3">No charging stations found</h5>
              <p class="text-muted">Add your first charging station to get started</p>
            </div>

            <div v-else class="table-responsive">
              <table class="table table-hover mb-0">
                <thead class="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Location</th>
                    <th>Power</th>
                    <th>Connector</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="station in stationsStore.stations" :key="station._id">
                    <td>
                      <div class="fw-semibold">{{ station.name }}</div>
                      <small class="text-muted">{{ station.description || 'No description' }}</small>
                    </td>
                    <td>
                      <span
                        class="badge"
                        :class="{
                          'bg-success': station.status === 'Active',
                          'bg-secondary': station.status === 'Inactive',
                          'bg-warning': station.status === 'Maintenance'
                        }"
                      >
                        {{ station.status }}
                      </span>
                    </td>
                    <td>
                      <small>{{ station.location.address }}</small>
                    </td>
                    <td>{{ station.powerOutput }} kW</td>
                    <td>{{ station.connectorType }}</td>
                    <td>
                      <small>{{ formatDate(station.createdAt) }}</small>
                    </td>
                    <td>
                      <div class="btn-group btn-group-sm">
                        <button
                          class="btn btn-outline-primary"
                          @click="editStation(station)"
                          title="Edit"
                        >
                          <i class="fas fa-edit"></i>
                        </button>
                        <button
                          class="btn btn-outline-danger"
                          @click="confirmDeleteStation(station)"
                          title="Delete"
                        >
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Station Modal -->
    <StationModal
      :show="showStationModal"
      :station="currentStation"
      @close="closeStationModal"
      @saved="handleStationSaved"
    />

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmModal
      :show="showDeleteModal"
      :item-name="stationToDelete?.name"
      @confirm="handleDeleteConfirm"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useStationsStore } from '@/stores/stations'
import StationModal from '@/components/StationModal.vue'
import DeleteConfirmModal from '@/components/DeleteConfirmModal.vue'

const stationsStore = useStationsStore()

// Local state
const showStationModal = ref(false)
const showDeleteModal = ref(false)
const currentStation = ref(null)
const stationToDelete = ref(null)
const searchQuery = ref('')

const filters = reactive({
  status: '',
  connectorType: '',
  minPower: '',
  maxPower: ''
})

// Computed
const avgPower = computed(() => {
  const avg = stationsStore.stats.powerStats?.avgPower || 0
  return avg ? Math.round(avg) : 0
})

// Methods
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

const handleSearch = () => {
  stationsStore.setFilters({ search: searchQuery.value })
  stationsStore.fetchStations()
}

const handleFilterChange = () => {
  stationsStore.setFilters(filters)
  stationsStore.fetchStations()
}

const clearFilters = () => {
  Object.keys(filters).forEach(key => filters[key] = '')
  searchQuery.value = ''
  stationsStore.clearFilters()
  stationsStore.fetchStations()
}

const openStationModal = (station = null) => {
  currentStation.value = station
  showStationModal.value = true
}

const closeStationModal = () => {
  showStationModal.value = false
  currentStation.value = null
}

const editStation = (station) => {
  openStationModal(station)
}

const confirmDeleteStation = (station) => {
  stationToDelete.value = station
  showDeleteModal.value = true
}

const handleDeleteConfirm = async () => {
  if (stationToDelete.value) {
    await stationsStore.deleteStation(stationToDelete.value._id)
    showDeleteModal.value = false
    stationToDelete.value = null
  }
}

const handleStationSaved = () => {
  closeStationModal()
  stationsStore.fetchStations()
}

// Lifecycle
onMounted(async () => {
  console.log('Dashboard mounted, starting data fetch...')
  console.log('Auth store:', stationsStore)
  console.log('Is authenticated:', stationsStore ? 'store exists' : 'store missing')
  
  try {
    console.log('Fetching stations...')
    const stationsResult = await stationsStore.fetchStations()
    console.log('Stations result:', stationsResult)
    
    console.log('Fetching stats...')
    const statsResult = await stationsStore.fetchStats()
    console.log('Stats result:', statsResult)
    
    console.log('Stations loaded:', stationsStore.stations.length)
  } catch (error) {
    console.error('Error loading dashboard data:', error)
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    })
  }
})
</script>

<style scoped>
.card {
  border-radius: 0.75rem;
}

.rounded-circle {
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.table th {
  border-top: none;
  font-weight: 600;
  color: #6c757d;
  font-size: 0.875rem;
}

.btn-group-sm .btn {
  padding: 0.25rem 0.5rem;
}
</style>
