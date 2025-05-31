<template>
  <div class="modal fade" :class="{ show: show }" :style="{ display: show ? 'block' : 'none' }" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="fas fa-charging-station me-2"></i>
            {{ isEditing ? 'Edit Charging Station' : 'Add New Charging Station' }}
          </h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        
        <form @submit.prevent="handleSubmit">
          <div class="modal-body">
            <div class="row">
              <!-- Station Name -->
              <div class="col-md-6 mb-3">
                <label class="form-label">Station Name *</label>
                <input
                  v-model="form.name"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors.name }"
                  placeholder="Enter station name"
                  required
                />
                <div v-if="errors.name" class="invalid-feedback">{{ errors.name }}</div>
              </div>

              <!-- Power Output -->
              <div class="col-md-6 mb-3">
                <label class="form-label">Power Output (kW) *</label>
                <input
                  v-model.number="form.powerOutput"
                  type="number"
                  class="form-control"
                  :class="{ 'is-invalid': errors.powerOutput }"
                  placeholder="e.g., 50"
                  min="1"
                  max="1000"
                  required
                />
                <div v-if="errors.powerOutput" class="invalid-feedback">{{ errors.powerOutput }}</div>
              </div>

              <!-- Status -->
              <div class="col-md-6 mb-3">
                <label class="form-label">Status</label>
                <select v-model="form.status" class="form-select" :class="{ 'is-invalid': errors.status }">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
                <div v-if="errors.status" class="invalid-feedback">{{ errors.status }}</div>
              </div>

              <!-- Connector Type -->
              <div class="col-md-6 mb-3">
                <label class="form-label">Connector Type *</label>
                <select
                  v-model="form.connectorType"
                  class="form-select"
                  :class="{ 'is-invalid': errors.connectorType }"
                  required
                >
                  <option value="">Select connector type</option>
                  <option value="Type 1">Type 1</option>
                  <option value="Type 2">Type 2</option>
                  <option value="CCS">CCS</option>
                  <option value="CHAdeMO">CHAdeMO</option>
                  <option value="Tesla">Tesla</option>
                </select>
                <div v-if="errors.connectorType" class="invalid-feedback">{{ errors.connectorType }}</div>
              </div>

              <!-- Address -->
              <div class="col-12 mb-3">
                <label class="form-label">Address *</label>
                <input
                  v-model="form.address"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors.address }"
                  placeholder="Enter full address"
                  required
                />
                <div v-if="errors.address" class="invalid-feedback">{{ errors.address }}</div>
              </div>

              <!-- Coordinates -->
              <div class="col-md-6 mb-3">
                <label class="form-label">Latitude *</label>
                <input
                  v-model.number="form.latitude"
                  type="number"
                  class="form-control"
                  :class="{ 'is-invalid': errors.latitude }"
                  placeholder="e.g., 28.6139"
                  step="any"
                  min="-90"
                  max="90"
                  required
                />
                <div v-if="errors.latitude" class="invalid-feedback">{{ errors.latitude }}</div>
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label">Longitude *</label>
                <input
                  v-model.number="form.longitude"
                  type="number"
                  class="form-control"
                  :class="{ 'is-invalid': errors.longitude }"
                  placeholder="e.g., 77.2090"
                  step="any"
                  min="-180"
                  max="180"
                  required
                />
                <div v-if="errors.longitude" class="invalid-feedback">{{ errors.longitude }}</div>
              </div>

              <!-- Price per kWh -->
              <div class="col-md-6 mb-3">
                <label class="form-label">Price per kWh (Optional)</label>
                <div class="input-group">
                  <span class="input-group-text">₹</span>
                  <input
                    v-model.number="form.pricePerKWh"
                    type="number"
                    class="form-control"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>

              <!-- Available -->
              <div class="col-md-6 mb-3 d-flex align-items-end">
                <div class="form-check">
                  <input
                    id="isAvailable"
                    v-model="form.isAvailable"
                    type="checkbox"
                    class="form-check-input"
                  />
                  <label class="form-check-label" for="isAvailable">
                    Station is available for use
                  </label>
                </div>
              </div>

              <!-- Description -->
              <div class="col-12 mb-3">
                <label class="form-label">Description</label>
                <textarea
                  v-model="form.description"
                  class="form-control"
                  :class="{ 'is-invalid': errors.description }"
                  rows="3"
                  placeholder="Additional information about the charging station..."
                  maxlength="500"
                ></textarea>
                <div v-if="errors.description" class="invalid-feedback">{{ errors.description }}</div>
                <small class="text-muted">{{ form.description?.length || 0 }}/500 characters</small>
              </div>

              <!-- Location Helper -->
              <div class="col-12">
                <div class="alert alert-info">
                  <i class="fas fa-info-circle me-2"></i>
                  <strong>Tip:</strong> You can click on the map in the Map View to get coordinates, or use online tools like Google Maps to find exact coordinates.
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="$emit('close')">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="fas fa-save me-2"></i>
              {{ loading ? 'Saving...' : (isEditing ? 'Update Station' : 'Create Station') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  
  <!-- Modal backdrop -->
  <div v-if="show" class="modal-backdrop fade show"></div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useStationsStore } from '@/stores/stations'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  station: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'saved'])

const stationsStore = useStationsStore()
const loading = ref(false)

const form = reactive({
  name: '',
  powerOutput: '',
  status: 'Active',
  connectorType: '',
  address: '',
  latitude: '',
  longitude: '',
  pricePerKWh: 0,
  isAvailable: true,
  description: ''
})

const errors = reactive({
  name: '',
  powerOutput: '',
  status: '',
  connectorType: '',
  address: '',
  latitude: '',
  longitude: '',
  description: ''
})

const isEditing = computed(() => !!props.station)

// Define functions first
const resetForm = () => {
  Object.assign(form, {
    name: '',
    powerOutput: '',
    status: 'Active',
    connectorType: '',
    address: '',
    latitude: '',
    longitude: '',
    pricePerKWh: 0,
    isAvailable: true,
    description: ''
  })
}

const resetErrors = () => {
  Object.keys(errors).forEach(key => errors[key] = '')
}

// Watch for prop changes
watch(() => props.station, (newStation) => {
  if (newStation) {
    // Populate form with existing station data
    Object.assign(form, {
      name: newStation.name || '',
      powerOutput: newStation.powerOutput || '',
      status: newStation.status || 'Active',
      connectorType: newStation.connectorType || '',
      address: newStation.location?.address || '',
      latitude: newStation.location?.coordinates?.[1] || '',
      longitude: newStation.location?.coordinates?.[0] || '',
      pricePerKWh: newStation.pricePerKWh || 0,
      isAvailable: newStation.isAvailable !== false,
      description: newStation.description || ''
    })
  } else {
    // Reset form for new station
    resetForm()
  }
}, { immediate: true })

// Watch for show prop to reset errors
watch(() => props.show, (show) => {
  if (show) {
    resetErrors()
  }
})

const validateForm = () => {
  resetErrors()
  let isValid = true

  // Name validation
  if (!form.name.trim()) {
    errors.name = 'Station name is required'
    isValid = false
  } else if (form.name.length > 100) {
    errors.name = 'Station name cannot exceed 100 characters'
    isValid = false
  }

  // Power output validation
  if (!form.powerOutput) {
    errors.powerOutput = 'Power output is required'
    isValid = false
  } else if (form.powerOutput < 1 || form.powerOutput > 1000) {
    errors.powerOutput = 'Power output must be between 1 and 1000 kW'
    isValid = false
  }

  // Connector type validation
  if (!form.connectorType) {
    errors.connectorType = 'Connector type is required'
    isValid = false
  }

  // Address validation
  if (!form.address.trim()) {
    errors.address = 'Address is required'
    isValid = false
  } else if (form.address.length > 200) {
    errors.address = 'Address cannot exceed 200 characters'
    isValid = false
  }

  // Latitude validation
  if (form.latitude === '' || form.latitude === null) {
    errors.latitude = 'Latitude is required'
    isValid = false
  } else if (form.latitude < -90 || form.latitude > 90) {
    errors.latitude = 'Latitude must be between -90 and 90'
    isValid = false
  }

  // Longitude validation
  if (form.longitude === '' || form.longitude === null) {
    errors.longitude = 'Longitude is required'
    isValid = false
  } else if (form.longitude < -180 || form.longitude > 180) {
    errors.longitude = 'Longitude must be between -180 and 180'
    isValid = false
  }

  // Description validation
  if (form.description && form.description.length > 500) {
    errors.description = 'Description cannot exceed 500 characters'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  loading.value = true

  try {
    const stationData = {
      name: form.name.trim(),
      powerOutput: Number(form.powerOutput),
      status: form.status,
      connectorType: form.connectorType,
      location: {
        address: form.address.trim(),
        coordinates: [Number(form.longitude), Number(form.latitude)]
      },
      pricePerKWh: Number(form.pricePerKWh) || 0,
      isAvailable: form.isAvailable,
      description: form.description.trim()
    }

    let result
    if (isEditing.value) {
      result = await stationsStore.updateStation(props.station._id, stationData)
    } else {
      result = await stationsStore.createStation(stationData)
    }

    if (result.success) {
      emit('saved')
    }
  } catch (error) {
    console.error('Error saving station:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-dialog {
  margin: 1.75rem auto;
}

.modal-content {
  border: none;
  border-radius: 0.75rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.modal-header {
  border-bottom: 1px solid #dee2e6;
  padding: 1.25rem;
}

.modal-body {
  padding: 1.25rem;
  max-height: 70vh;
  overflow-y: auto;
}

.modal-footer {
  border-top: 1px solid #dee2e6;
  padding: 1.25rem;
}

.form-control, .form-select {
  border-radius: 0.5rem;
}

.alert {
  border-radius: 0.5rem;
}
</style>
