<template>
  <div class="min-vh-100 d-flex align-items-center justify-content-center bg-light">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="card shadow">
            <div class="card-body p-4">
              <!-- Header -->
              <div class="text-center mb-4">
                <i class="fas fa-charging-station text-primary" style="font-size: 3rem;"></i>
                <h2 class="mt-3 mb-1">Create Account</h2>
                <p class="text-muted">Join our charging station network</p>
              </div>

              <!-- Registration Form -->
              <form @submit.prevent="handleRegister">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="firstName" class="form-label">First Name</label>
                    <input
                      id="firstName"
                      v-model="registerForm.firstName"
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': errors.firstName }"
                      placeholder="John"
                      required
                    />
                    <div v-if="errors.firstName" class="invalid-feedback">
                      {{ errors.firstName }}
                    </div>
                  </div>

                  <div class="col-md-6 mb-3">
                    <label for="lastName" class="form-label">Last Name</label>
                    <input
                      id="lastName"
                      v-model="registerForm.lastName"
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': errors.lastName }"
                      placeholder="Doe"
                      required
                    />
                    <div v-if="errors.lastName" class="invalid-feedback">
                      {{ errors.lastName }}
                    </div>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="email" class="form-label">Email Address</label>
                  <input
                    id="email"
                    v-model="registerForm.email"
                    type="email"
                    class="form-control"
                    :class="{ 'is-invalid': errors.email }"
                    placeholder="john.doe@example.com"
                    required
                  />
                  <div v-if="errors.email" class="invalid-feedback">
                    {{ errors.email }}
                  </div>
                </div>

                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <div class="input-group">
                    <input
                      id="password"
                      v-model="registerForm.password"
                      :type="showPassword ? 'text' : 'password'"
                      class="form-control"
                      :class="{ 'is-invalid': errors.password }"
                      placeholder="Choose a strong password"
                      required
                    />
                    <button
                      class="btn btn-outline-secondary"
                      type="button"
                      @click="showPassword = !showPassword"
                    >
                      <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                    </button>
                  </div>
                  <div v-if="errors.password" class="invalid-feedback d-block">
                    {{ errors.password }}
                  </div>
                  <small class="text-muted">
                    Password must be at least 6 characters with uppercase, lowercase, and number
                  </small>
                </div>

                <div class="mb-3">
                  <label for="confirmPassword" class="form-label">Confirm Password</label>
                  <input
                    id="confirmPassword"
                    v-model="registerForm.confirmPassword"
                    :type="showPassword ? 'text' : 'password'"
                    class="form-control"
                    :class="{ 'is-invalid': errors.confirmPassword }"
                    placeholder="Confirm your password"
                    required
                  />
                  <div v-if="errors.confirmPassword" class="invalid-feedback">
                    {{ errors.confirmPassword }}
                  </div>
                </div>

                <div class="mb-3 form-check">
                  <input
                    id="agreeTerms"
                    v-model="registerForm.agreeTerms"
                    type="checkbox"
                    class="form-check-input"
                    :class="{ 'is-invalid': errors.agreeTerms }"
                    required
                  />
                  <label class="form-check-label" for="agreeTerms">
                    I agree to the <a href="#" class="text-decoration-none">Terms of Service</a>
                    and <a href="#" class="text-decoration-none">Privacy Policy</a>
                  </label>
                  <div v-if="errors.agreeTerms" class="invalid-feedback">
                    {{ errors.agreeTerms }}
                  </div>
                </div>

                <button
                  type="submit"
                  class="btn btn-primary w-100"
                  :disabled="authStore.loading"
                >
                  <span v-if="authStore.loading" class="spinner-border spinner-border-sm me-2"></span>
                  <i v-else class="fas fa-user-plus me-2"></i>
                  {{ authStore.loading ? 'Creating Account...' : 'Create Account' }}
                </button>
              </form>

              <!-- Footer -->
              <div class="text-center mt-4">
                <p class="mb-0">
                  Already have an account?
                  <router-link to="/login" class="text-decoration-none">
                    Sign in here
                  </router-link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const showPassword = ref(false)
const registerForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false
})
const errors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeTerms: ''
})

const validateForm = () => {
  // Reset errors
  Object.keys(errors).forEach(key => errors[key] = '')
  
  let isValid = true
  
  // First name validation
  if (!registerForm.firstName.trim()) {
    errors.firstName = 'First name is required'
    isValid = false
  } else if (registerForm.firstName.length < 2) {
    errors.firstName = 'First name must be at least 2 characters'
    isValid = false
  }
  
  // Last name validation
  if (!registerForm.lastName.trim()) {
    errors.lastName = 'Last name is required'
    isValid = false
  } else if (registerForm.lastName.length < 2) {
    errors.lastName = 'Last name must be at least 2 characters'
    isValid = false
  }
  
  // Email validation
  if (!registerForm.email) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(registerForm.email)) {
    errors.email = 'Please enter a valid email address'
    isValid = false
  }
  
  // Password validation
  if (!registerForm.password) {
    errors.password = 'Password is required'
    isValid = false
  } else if (registerForm.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
    isValid = false
  } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(registerForm.password)) {
    errors.password = 'Password must contain uppercase, lowercase, and number'
    isValid = false
  }
  
  // Confirm password validation
  if (!registerForm.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password'
    isValid = false
  } else if (registerForm.password !== registerForm.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
    isValid = false
  }
  
  // Terms agreement validation
  if (!registerForm.agreeTerms) {
    errors.agreeTerms = 'You must agree to the terms and conditions'
    isValid = false
  }
  
  return isValid
}

const handleRegister = async () => {
  if (!validateForm()) return
  
  const result = await authStore.register({
    firstName: registerForm.firstName.trim(),
    lastName: registerForm.lastName.trim(),
    email: registerForm.email,
    password: registerForm.password
  })
  
  if (result.success) {
    router.push('/dashboard')
  }
}
</script>

<style scoped>
.card {
  border: none;
  border-radius: 1rem;
}

.btn {
  border-radius: 0.5rem;
}

.form-control {
  border-radius: 0.5rem;
}

.input-group .btn {
  border-radius: 0 0.5rem 0.5rem 0;
}

.input-group .form-control {
  border-radius: 0.5rem 0 0 0.5rem;
}

.bg-light {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
}
</style>
