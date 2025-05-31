import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'
import { useToast } from 'vue-toastification'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(localStorage.getItem('token'))
  const loading = ref(false)
  
  // Toast instance
  const toast = useToast()
    // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userFullName = computed(() => user.value ? user.value.fullName : '')
  const userRole = computed(() => user.value ? user.value.role : '')
  
  // Actions
  const setAuthData = (userData, tokenData) => {
    user.value = userData
    token.value = tokenData
    localStorage.setItem('token', tokenData)
    
    // Set API default header
    api.defaults.headers.common['Authorization'] = `Bearer ${tokenData}`
  }
  
  const clearAuthData = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
  }
    const login = async (credentials) => {
    try {
      loading.value = true
      const response = await api.post('/auth/login', credentials)
      
      if (response.data.success) {
        setAuthData(response.data.data.user, response.data.data.token)
        toast.success('Login successful!')
        return { success: true }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
      return { success: false, message }
    } finally {
      loading.value = false
    }
  }
  
  const register = async (userData) => {
    try {
      loading.value = true
      const response = await api.post('/auth/register', userData)
      
      if (response.data.success) {
        setAuthData(response.data.data.user, response.data.data.token)
        toast.success('Registration successful!')
        return { success: true }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
      return { success: false, message }
    } finally {
      loading.value = false
    }
  }
  
  const logout = () => {
    clearAuthData()
    toast.info('Logged out successfully')
  }
    const fetchProfile = async () => {
    try {
      const response = await api.get('/auth/profile')
      if (response.data.success) {
        user.value = response.data.data.user
        return { success: true }
      }
    } catch (error) {
      if (error.response?.status === 401) {
        // Token is invalid
        clearAuthData()
        return { success: false, message: 'Session expired' }
      }
      return { success: false, message: 'Failed to fetch profile' }
    }
  }
  
  const updateProfile = async (profileData) => {
    try {
      loading.value = true
      const response = await api.put('/auth/profile', profileData)
      
      if (response.data.success) {
        user.value = response.data.data.user
        toast.success('Profile updated successfully!')
        return { success: true }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile'
      toast.error(message)
      return { success: false, message }
    } finally {
      loading.value = false
    }
  }
    // Initialize auth state
  const initializeAuth = async () => {
    if (token.value) {
      // Set API header
      api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
      
      // Try to fetch user profile
      const result = await fetchProfile()
      if (!result.success) {
        clearAuthData()
      }
    }
  }
  
  return {
    // State
    user,
    token,
    loading,
    
    // Getters
    isAuthenticated,
    userFullName,
    userRole,
    
    // Actions
    login,
    register,
    logout,
    fetchProfile,
    updateProfile,
    initializeAuth,
    clearAuthData
  }
})
