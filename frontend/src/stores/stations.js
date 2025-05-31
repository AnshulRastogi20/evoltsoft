import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'
import { useToast } from 'vue-toastification'

export const useStationsStore = defineStore('stations', () => {
  // State
  const stations = ref([])
  const currentStation = ref(null)
  const loading = ref(false)
  const pagination = ref({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  })
  const filters = ref({
    status: '',
    connectorType: '',
    minPower: '',
    maxPower: '',
    search: ''
  })
  const stats = ref({
    totalStations: 0,
    statusDistribution: [],
    connectorDistribution: [],
    powerStats: {}
  })
  
  // Toast instance
  const toast = useToast()
  
  // Getters
  const filteredStations = computed(() => {
    let result = stations.value
    
    if (filters.value.status) {
      result = result.filter(station => station.status === filters.value.status)
    }
    
    if (filters.value.connectorType) {
      result = result.filter(station => station.connectorType === filters.value.connectorType)
    }
    
    if (filters.value.search) {
      const searchTerm = filters.value.search.toLowerCase()
      result = result.filter(station => 
        station.name.toLowerCase().includes(searchTerm) ||
        station.description?.toLowerCase().includes(searchTerm) ||
        station.location.address.toLowerCase().includes(searchTerm)
      )
    }
    
    return result
  })
  
  const activeStations = computed(() => 
    stations.value.filter(station => station.status === 'Active')
  )
  
  const inactiveStations = computed(() => 
    stations.value.filter(station => station.status === 'Inactive')
  )
  
  const maintenanceStations = computed(() => 
    stations.value.filter(station => station.status === 'Maintenance')
  )
  
  // Actions
  const fetchStations = async (page = 1, limit = 10) => {
    try {
      loading.value = true
      const params = {
        page,
        limit,
        ...filters.value
      }
      
      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key]
        }
      })
      
      const response = await api.get('/stations', { params })
      
      if (response.data.success) {
        stations.value = response.data.data
        pagination.value = response.data.pagination
        return { success: true }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch stations'
      toast.error(message)
      return { success: false, message }
    } finally {
      loading.value = false
    }
  }
    const fetchStation = async (id) => {
    try {
      loading.value = true
      const response = await api.get(`/stations/${id}`)
      
      if (response.data.success) {
        currentStation.value = response.data.data.station
        return { success: true, station: response.data.data.station }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch station'
      toast.error(message)
      return { success: false, message }
    } finally {
      loading.value = false
    }
  }
  
  const createStation = async (stationData) => {
    try {
      loading.value = true
      const response = await api.post('/stations', stationData)
      
      if (response.data.success) {
        // Add new station to the list
        stations.value.unshift(response.data.data.station)
        toast.success('Charging station created successfully!')
        return { success: true, station: response.data.data.station }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create station'
      toast.error(message)
      return { success: false, message }
    } finally {
      loading.value = false
    }
  }
  
  const updateStation = async (id, stationData) => {
    try {
      loading.value = true
      const response = await api.put(`/stations/${id}`, stationData)
      
      if (response.data.success) {
        // Update station in the list
        const index = stations.value.findIndex(station => station._id === id)
        if (index !== -1) {
          stations.value[index] = response.data.data.station
        }
        
        // Update current station if it's the same
        if (currentStation.value?._id === id) {
          currentStation.value = response.data.data.station
        }
        
        toast.success('Charging station updated successfully!')
        return { success: true, station: response.data.data.station }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update station'
      toast.error(message)
      return { success: false, message }
    } finally {
      loading.value = false
    }
  }
    const deleteStation = async (id) => {
    try {
      loading.value = true
      const response = await api.delete(`/stations/${id}`)
      
      if (response.data.success) {
        // Remove station from the list
        stations.value = stations.value.filter(station => station._id !== id)
        
        // Clear current station if it's the same
        if (currentStation.value?._id === id) {
          currentStation.value = null
        }
        
        toast.success('Charging station deleted successfully!')
        return { success: true }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete station'
      toast.error(message)
      return { success: false, message }
    } finally {
      loading.value = false
    }
  }
  
  const fetchNearbyStations = async (longitude, latitude, maxDistance = 10000) => {
    try {
      loading.value = true
      const response = await api.get(`/stations/nearby/${longitude}/${latitude}`, {
        params: { maxDistance }
      })
      
      if (response.data.success) {
        return { success: true, stations: response.data.data.stations }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch nearby stations'
      toast.error(message)
      return { success: false, message }
    } finally {
      loading.value = false
    }
  }
    const fetchStats = async () => {
    try {
      const response = await api.get('/stations/stats')
      
      if (response.data.success) {
        stats.value = response.data.data.stats
        return { success: true }
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
      return { success: false }
    }
  }
  
  const setFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters }
  }
  
  const clearFilters = () => {
    filters.value = {
      status: '',
      connectorType: '',
      minPower: '',
      maxPower: '',
      search: ''
    }
  }
  
  const setCurrentStation = (station) => {
    currentStation.value = station
  }
  
  return {
    // State
    stations,
    currentStation,
    loading,
    pagination,
    filters,
    stats,
    
    // Getters
    filteredStations,
    activeStations,
    inactiveStations,
    maintenanceStations,
    
    // Actions
    fetchStations,
    fetchStation,
    createStation,
    updateStation,
    deleteStation,
    fetchNearbyStations,
    fetchStats,
    setFilters,
    clearFilters,
    setCurrentStation
  }
})
