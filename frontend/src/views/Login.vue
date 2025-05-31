<template>
  <div class="min-vh-100 d-flex align-items-center justify-content-center bg-light">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-4">
          <div class="card shadow">
            <div class="card-body p-4">
              <!-- Header -->
              <div class="text-center mb-4">
                <i class="fas fa-charging-station text-primary" style="font-size: 3rem;"></i>
                <h2 class="mt-3 mb-1">Welcome Back</h2>
                <p class="text-muted">Sign in to your account</p>
              </div>

              <!-- Login Form -->
              <form @submit.prevent="handleLogin">
                <div class="mb-3">
                  <label for="email" class="form-label">Email Address</label>
                  <input
                    id="email"
                    v-model="loginForm.email"
                    type="email"
                    class="form-control"
                    :class="{ 'is-invalid': errors.email }"
                    placeholder="Enter your email"
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
                      v-model="loginForm.password"
                      :type="showPassword ? 'text' : 'password'"
                      class="form-control"
                      :class="{ 'is-invalid': errors.password }"
                      placeholder="Enter your password"
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
                </div>

                <div class="mb-3 form-check">
                  <input
                    id="rememberMe"
                    v-model="loginForm.rememberMe"
                    type="checkbox"
                    class="form-check-input"
                  />
                  <label class="form-check-label" for="rememberMe">
                    Remember me
                  </label>
                </div>

                <button
                  type="submit"
                  class="btn btn-primary w-100"
                  :disabled="authStore.loading"
                >
                  <span v-if="authStore.loading" class="spinner-border spinner-border-sm me-2"></span>
                  <i v-else class="fas fa-sign-in-alt me-2"></i>
                  {{ authStore.loading ? 'Signing in...' : 'Sign In' }}
                </button>
              </form>

              <!-- Footer -->
              <div class="text-center mt-4">
                <p class="mb-0">
                  Don't have an account?
                  <router-link to="/register" class="text-decoration-none">
                    Sign up here
                  </router-link>
                </p>
              </div>
            </div>
          </div>

          <!-- Demo Credentials -->
          <div class="card mt-3 border-info">
            <div class="card-body text-center">
              <small class="text-info">
                <i class="fas fa-info-circle me-1"></i>
                Demo: admin@example.com / password123
              </small>
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
const loginForm = reactive({
  email: '',
  password: '',
  rememberMe: false
})
const errors = reactive({
  email: '',
  password: ''
})

const validateForm = () => {
  errors.email = ''
  errors.password = ''
  
  let isValid = true
  
  if (!loginForm.email) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(loginForm.email)) {
    errors.email = 'Please enter a valid email address'
    isValid = false
  }
  
  if (!loginForm.password) {
    errors.password = 'Password is required'
    isValid = false
  } else if (loginForm.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
    isValid = false
  }
  
  return isValid
}

const handleLogin = async () => {
  if (!validateForm()) return
  
  const result = await authStore.login({
    email: loginForm.email,
    password: loginForm.password
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
