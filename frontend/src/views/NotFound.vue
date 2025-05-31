<template>
  <div class="not-found-view">
    <div class="container">
      <div class="row justify-content-center align-items-center min-vh-100">
        <div class="col-lg-6 text-center">
          <!-- 404 Illustration -->
          <div class="error-illustration mb-4">
            <div class="error-code">404</div>
            <div class="error-icon">
              <i class="fas fa-charging-station"></i>
            </div>
          </div>

          <!-- Error Message -->
          <h1 class="display-6 fw-bold text-dark mb-3">
            Oops! Page Not Found
          </h1>
          
          <p class="lead text-muted mb-4">
            The charging station you're looking for seems to be offline. 
            Don't worry, we'll help you get back on track!
          </p>

          <!-- Current URL Info -->
          <div class="alert alert-light border d-inline-block mb-4">
            <i class="fas fa-link me-2 text-muted"></i>
            <small class="text-muted">
              <strong>Requested URL:</strong> {{ $route.fullPath }}
            </small>
          </div>

          <!-- Action Buttons -->
          <div class="d-flex flex-column flex-sm-row gap-3 justify-content-center mb-5">
            <button 
              class="btn btn-primary btn-lg"
              @click="goToDashboard"
            >
              <i class="fas fa-tachometer-alt me-2"></i>
              Go to Dashboard
            </button>
            
            <button 
              class="btn btn-outline-primary btn-lg"
              @click="goBack"
            >
              <i class="fas fa-arrow-left me-2"></i>
              Go Back
            </button>
          </div>

          <!-- Helpful Links -->
          <div class="helpful-links">
            <h5 class="h6 text-muted mb-3">Or try these popular sections:</h5>
            <div class="row g-3">
              <div class="col-sm-4">
                <router-link 
                  to="/dashboard" 
                  class="d-block p-3 bg-white rounded border text-decoration-none hover-shadow"
                >
                  <i class="fas fa-tachometer-alt fa-2x text-primary mb-2"></i>
                  <div class="fw-semibold text-dark">Dashboard</div>
                  <small class="text-muted">View your stations</small>
                </router-link>
              </div>
              
              <div class="col-sm-4">
                <router-link 
                  to="/map" 
                  class="d-block p-3 bg-white rounded border text-decoration-none hover-shadow"
                >
                  <i class="fas fa-map-marked-alt fa-2x text-success mb-2"></i>
                  <div class="fw-semibold text-dark">Map View</div>
                  <small class="text-muted">Find stations</small>
                </router-link>
              </div>
              
              <div class="col-sm-4">
                <router-link 
                  to="/profile" 
                  class="d-block p-3 bg-white rounded border text-decoration-none hover-shadow"
                >
                  <i class="fas fa-user-circle fa-2x text-info mb-2"></i>
                  <div class="fw-semibold text-dark">Profile</div>
                  <small class="text-muted">Manage account</small>
                </router-link>
              </div>
            </div>
          </div>

          <!-- Error Reporting -->
          <div class="mt-5 pt-4 border-top">
            <p class="text-muted small mb-2">
              Think this is a mistake? 
              <a href="#" @click.prevent="reportError" class="text-decoration-none">
                Report this error
              </a>
            </p>
            <div class="text-muted">
              <small>Error ID: {{ errorId }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const router = useRouter()
const toast = useToast()

const errorId = ref('')

// Generate random error ID for reporting
const generateErrorId = () => {
  return 'ERR-' + Math.random().toString(36).substr(2, 9).toUpperCase()
}

const goToDashboard = () => {
  router.push('/dashboard')
}

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/dashboard')
  }
}

const reportError = () => {
  // Simulate error reporting
  toast.info('Error report submitted. Thank you for your feedback!')
}

onMounted(() => {
  errorId.value = generateErrorId()
})
</script>

<style scoped>
.not-found-view {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.not-found-view::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
  opacity: 0.3;
}

.container {
  position: relative;
  z-index: 1;
}

.error-illustration {
  position: relative;
  margin-bottom: 2rem;
}

.error-code {
  font-size: 8rem;
  font-weight: 900;
  background: linear-gradient(45deg, #ff6b6b, #feca57);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.error-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: -1;
}

.error-icon i {
  font-size: 6rem;
  color: rgba(255, 255, 255, 0.1);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
  50% { transform: translate(-50%, -50%) translateY(-10px); }
}

.hover-shadow {
  transition: all 0.3s ease;
}

.hover-shadow:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
}

.btn {
  border-radius: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0.75rem 2rem;
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.alert {
  border-radius: 0.75rem;
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.1) !important;
  border-color: rgba(255, 255, 255, 0.2) !important;
}

.helpful-links .rounded {
  border-radius: 0.75rem !important;
  transition: all 0.3s ease;
}

.bg-white {
  background-color: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(10px);
}

.text-dark {
  color: #2c3e50 !important;
}

.text-muted {
  color: rgba(255, 255, 255, 0.8) !important;
}

h1 {
  color: white !important;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.lead {
  color: rgba(255, 255, 255, 0.9) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.border-top {
  border-color: rgba(255, 255, 255, 0.2) !important;
}

@media (max-width: 768px) {
  .error-code {
    font-size: 5rem;
  }
  
  .error-icon i {
    font-size: 4rem;
  }
  
  .btn {
    padding: 0.5rem 1.5rem;
    font-size: 0.9rem;
  }
}
</style>
