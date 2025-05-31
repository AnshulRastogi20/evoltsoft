<template>
  <div class="profile-view">
    <div class="container-fluid py-4">
      <!-- Page Header -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h4 class="mb-1">
                <i class="fas fa-user-circle me-2 text-primary"></i>
                Profile Settings
              </h4>
              <p class="text-muted mb-0">Manage your account information and preferences</p>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <!-- Profile Information -->
        <div class="col-lg-8">
          <div class="card shadow-sm border-0 mb-4">
            <div class="card-header bg-white py-3">
              <h5 class="mb-0">
                <i class="fas fa-user me-2"></i>
                Personal Information
              </h5>
            </div>
            <div class="card-body">
              <form @submit.prevent="updateProfile">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">First Name *</label>
                    <input
                      v-model="profileForm.firstName"
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': errors.firstName }"
                      placeholder="Enter first name"
                      required
                    />
                    <div v-if="errors.firstName" class="invalid-feedback">{{ errors.firstName }}</div>
                  </div>

                  <div class="col-md-6 mb-3">
                    <label class="form-label">Last Name *</label>
                    <input
                      v-model="profileForm.lastName"
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': errors.lastName }"
                      placeholder="Enter last name"
                      required
                    />
                    <div v-if="errors.lastName" class="invalid-feedback">{{ errors.lastName }}</div>
                  </div>

                  <div class="col-12 mb-3">
                    <label class="form-label">Email Address</label>
                    <input
                      v-model="profileForm.email"
                      type="email"
                      class="form-control"
                      :class="{ 'is-invalid': errors.email }"
                      placeholder="Enter email address"
                      readonly
                    />
                    <small class="text-muted">Email address cannot be changed</small>
                    <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
                  </div>

                  <div class="col-md-6 mb-3">
                    <label class="form-label">Role</label>
                    <input
                      :value="user?.role || 'User'"
                      type="text"
                      class="form-control"
                      readonly
                    />
                    <small class="text-muted">Role is assigned by administrators</small>
                  </div>

                  <div class="col-md-6 mb-3">
                    <label class="form-label">Member Since</label>
                    <input
                      :value="formatDate(user?.createdAt)"
                      type="text"
                      class="form-control"
                      readonly
                    />
                  </div>
                </div>

                <div class="d-flex justify-content-end">
                  <button type="submit" class="btn btn-primary" :disabled="profileLoading">
                    <span v-if="profileLoading" class="spinner-border spinner-border-sm me-2"></span>
                    <i v-else class="fas fa-save me-2"></i>
                    {{ profileLoading ? 'Updating...' : 'Update Profile' }}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Activity Summary -->
          <div class="card shadow-sm border-0 mb-4">
            <div class="card-header bg-white py-3">
              <h5 class="mb-0">
                <i class="fas fa-chart-line me-2"></i>
                Activity Summary
              </h5>
            </div>
            <div class="card-body">
              <div class="row text-center">
                <div class="col-md-4 mb-3">
                  <div class="bg-primary bg-opacity-10 rounded p-3">
                    <i class="fas fa-charging-station fa-2x text-primary mb-2"></i>
                    <h4 class="mb-1">{{ userStats.stationsCreated }}</h4>
                    <small class="text-muted">Stations Created</small>
                  </div>
                </div>
                <div class="col-md-4 mb-3">
                  <div class="bg-success bg-opacity-10 rounded p-3">
                    <i class="fas fa-calendar fa-2x text-success mb-2"></i>
                    <h4 class="mb-1">{{ formatDate(user?.lastLogin, 'short') || 'Never' }}</h4>
                    <small class="text-muted">Last Login</small>
                  </div>
                </div>
                <div class="col-md-4 mb-3">
                  <div class="bg-info bg-opacity-10 rounded p-3">
                    <i class="fas fa-edit fa-2x text-info mb-2"></i>
                    <h4 class="mb-1">{{ userStats.stationsUpdated }}</h4>
                    <small class="text-muted">Stations Updated</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Security Settings -->
        <div class="col-lg-4">
          <div class="card shadow-sm border-0 mb-4">
            <div class="card-header bg-white py-3">
              <h5 class="mb-0">
                <i class="fas fa-shield-alt me-2"></i>
                Security Settings
              </h5>
            </div>
            <div class="card-body">
              <form @submit.prevent="changePassword">
                <div class="mb-3">
                  <label class="form-label">Current Password *</label>
                  <input
                    v-model="passwordForm.currentPassword"
                    type="password"
                    class="form-control"
                    :class="{ 'is-invalid': errors.currentPassword }"
                    placeholder="Enter current password"
                    required
                  />
                  <div v-if="errors.currentPassword" class="invalid-feedback">{{ errors.currentPassword }}</div>
                </div>

                <div class="mb-3">
                  <label class="form-label">New Password *</label>
                  <input
                    v-model="passwordForm.newPassword"
                    type="password"
                    class="form-control"
                    :class="{ 'is-invalid': errors.newPassword }"
                    placeholder="Enter new password"
                    required
                  />
                  <div v-if="errors.newPassword" class="invalid-feedback">{{ errors.newPassword }}</div>
                  <small class="text-muted">Minimum 6 characters required</small>
                </div>

                <div class="mb-3">
                  <label class="form-label">Confirm New Password *</label>
                  <input
                    v-model="passwordForm.confirmPassword"
                    type="password"
                    class="form-control"
                    :class="{ 'is-invalid': errors.confirmPassword }"
                    placeholder="Confirm new password"
                    required
                  />
                  <div v-if="errors.confirmPassword" class="invalid-feedback">{{ errors.confirmPassword }}</div>
                </div>

                <button type="submit" class="btn btn-warning w-100" :disabled="passwordLoading">
                  <span v-if="passwordLoading" class="spinner-border spinner-border-sm me-2"></span>
                  <i v-else class="fas fa-key me-2"></i>
                  {{ passwordLoading ? 'Updating...' : 'Change Password' }}
                </button>
              </form>
            </div>
          </div>

          <!-- Account Actions -->
          <div class="card shadow-sm border-0">
            <div class="card-header bg-white py-3">
              <h5 class="mb-0">
                <i class="fas fa-cog me-2"></i>
                Account Actions
              </h5>
            </div>
            <div class="card-body">
              <div class="d-grid gap-2">
                <button class="btn btn-outline-info" @click="downloadData">
                  <i class="fas fa-download me-2"></i>
                  Download My Data
                </button>
                <button class="btn btn-outline-secondary" @click="clearCache">
                  <i class="fas fa-trash me-2"></i>
                  Clear Local Cache
                </button>
                <hr>
                <button class="btn btn-outline-danger" @click="showDeleteAccount = true">
                  <i class="fas fa-user-times me-2"></i>
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Account Confirmation Modal -->
    <div v-if="showDeleteAccount" class="modal fade show d-block" style="background-color: rgba(0,0,0,0.5)">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title text-danger">
              <i class="fas fa-exclamation-triangle me-2"></i>
              Delete Account
            </h5>
            <button type="button" class="btn-close" @click="showDeleteAccount = false"></button>
          </div>
          <div class="modal-body">
            <div class="alert alert-danger">
              <strong>Warning:</strong> This action cannot be undone. Your account and all associated data will be permanently deleted.
            </div>
            <p>To confirm account deletion, please type <strong>DELETE</strong> in the field below:</p>
            <input
              v-model="deleteConfirmation"
              type="text"
              class="form-control"
              placeholder="Type DELETE to confirm"
            />
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-secondary" @click="showDeleteAccount = false">
              Cancel
            </button>
            <button
              type="button"
              class="btn btn-danger"
              :disabled="deleteConfirmation !== 'DELETE' || deleteLoading"
              @click="deleteAccount"
            >
              <span v-if="deleteLoading" class="spinner-border spinner-border-sm me-2"></span>
              {{ deleteLoading ? 'Deleting...' : 'Delete Account' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useStationsStore } from '@/stores/stations'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const stationsStore = useStationsStore()
const toast = useToast()
const router = useRouter()

// Data
const profileLoading = ref(false)
const passwordLoading = ref(false)
const deleteLoading = ref(false)
const showDeleteAccount = ref(false)
const deleteConfirmation = ref('')

const profileForm = reactive({
  firstName: '',
  lastName: '',
  email: ''
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const errors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const userStats = reactive({
  stationsCreated: 0,
  stationsUpdated: 0
})

// Computed
const user = computed(() => authStore.user)

// Methods
const formatDate = (dateString, format = 'long') => {
  if (!dateString) return 'N/A'
  
  const date = new Date(dateString)
  const options = format === 'short' 
    ? { month: 'short', day: 'numeric', year: 'numeric' }
    : { year: 'numeric', month: 'long', day: 'numeric' }
    
  return date.toLocaleDateString('en-US', options)
}

const initializeProfile = () => {
  if (user.value) {
    profileForm.firstName = user.value.firstName || ''
    profileForm.lastName = user.value.lastName || ''
    profileForm.email = user.value.email || ''
  }
}

const validateProfileForm = () => {
  resetErrors()
  let isValid = true

  if (!profileForm.firstName.trim()) {
    errors.firstName = 'First name is required'
    isValid = false
  }

  if (!profileForm.lastName.trim()) {
    errors.lastName = 'Last name is required'
    isValid = false
  }

  return isValid
}

const validatePasswordForm = () => {
  resetErrors()
  let isValid = true

  if (!passwordForm.currentPassword) {
    errors.currentPassword = 'Current password is required'
    isValid = false
  }

  if (!passwordForm.newPassword) {
    errors.newPassword = 'New password is required'
    isValid = false
  } else if (passwordForm.newPassword.length < 6) {
    errors.newPassword = 'Password must be at least 6 characters'
    isValid = false
  }

  if (!passwordForm.confirmPassword) {
    errors.confirmPassword = 'Please confirm your new password'
    isValid = false
  } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
    isValid = false
  }

  return isValid
}

const resetErrors = () => {
  Object.keys(errors).forEach(key => errors[key] = '')
}

const updateProfile = async () => {
  if (!validateProfileForm()) return

  profileLoading.value = true

  try {
    // Simulate API call for profile update
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Update user in auth store
    authStore.updateUser({
      ...user.value,
      firstName: profileForm.firstName.trim(),
      lastName: profileForm.lastName.trim()
    })

    toast.success('Profile updated successfully!')
  } catch (error) {
    toast.error('Failed to update profile')
  } finally {
    profileLoading.value = false
  }
}

const changePassword = async () => {
  if (!validatePasswordForm()) return

  passwordLoading.value = true

  try {
    // Simulate API call for password change
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Reset password form
    Object.assign(passwordForm, {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })

    toast.success('Password changed successfully!')
  } catch (error) {
    toast.error('Failed to change password')
  } finally {
    passwordLoading.value = false
  }
}

const downloadData = async () => {
  try {
    // Simulate data download
    toast.info('Preparing your data for download...')
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const userData = {
      profile: user.value,
      stations: stationsStore.stations.filter(station => station.createdBy === user.value?.id),
      exportDate: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `user-data-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast.success('Data downloaded successfully!')
  } catch (error) {
    toast.error('Failed to download data')
  }
}

const clearCache = () => {
  try {
    localStorage.removeItem('auth-storage')
    localStorage.removeItem('stations-storage')
    sessionStorage.clear()
    
    toast.success('Local cache cleared successfully!')
  } catch (error) {
    toast.error('Failed to clear cache')
  }
}

const deleteAccount = async () => {
  deleteLoading.value = true

  try {
    // Simulate account deletion
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    toast.success('Account deleted successfully')
    authStore.logout()
    router.push('/login')
  } catch (error) {
    toast.error('Failed to delete account')
  } finally {
    deleteLoading.value = false
    showDeleteAccount.value = false
  }
}

const loadUserStats = async () => {
  try {
    // Count stations created by user
    const userStations = stationsStore.stations.filter(station => 
      station.createdBy === user.value?.id
    )
    userStats.stationsCreated = userStations.length
    userStats.stationsUpdated = Math.floor(userStations.length * 0.7) // Simulate
  } catch (error) {
    console.error('Failed to load user stats:', error)
  }
}

// Lifecycle
onMounted(() => {
  initializeProfile()
  loadUserStats()
})
</script>

<style scoped>
.profile-view {
  background-color: #f8f9fa;
  min-height: 100vh;
}

.card {
  border-radius: 0.75rem;
  transition: transform 0.2s ease-in-out;
}

.card:hover {
  transform: translateY(-2px);
}

.card-header {
  border-bottom: 1px solid #dee2e6;
  border-top-left-radius: 0.75rem;
  border-top-right-radius: 0.75rem;
}

.form-control, .form-select {
  border-radius: 0.5rem;
  border: 1px solid #dee2e6;
}

.form-control:focus, .form-select:focus {
  border-color: #86b7fe;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.btn {
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
}

.modal-content {
  border-radius: 0.75rem;
}

.bg-opacity-10 {
  --bs-bg-opacity: 0.1;
}
</style>
