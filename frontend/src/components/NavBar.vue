<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container-fluid">
      <!-- Brand -->
      <router-link class="navbar-brand fw-bold" to="/dashboard">
        <i class="fas fa-charging-station me-2"></i>
        {{ appName }}
      </router-link>

      <!-- Mobile toggle -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Navigation items -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link
              class="nav-link"
              to="/dashboard"
              :class="{ active: $route.name === 'Dashboard' }"
            >
              <i class="fas fa-tachometer-alt me-1"></i>
              Dashboard
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              class="nav-link"
              to="/map"
              :class="{ active: $route.name === 'MapView' }"
            >
              <i class="fas fa-map-marked-alt me-1"></i>
              Map View
            </router-link>
          </li>
        </ul>

        <!-- User menu -->
        <ul class="navbar-nav">
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="fas fa-user-circle me-1"></i>
              {{ authStore.userFullName || 'User' }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li>
                <router-link class="dropdown-item" to="/profile">
                  <i class="fas fa-user me-2"></i>
                  Profile
                </router-link>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <a
                  class="dropdown-item text-danger"
                  href="#"
                  @click.prevent="handleLogout"
                >
                  <i class="fas fa-sign-out-alt me-2"></i>
                  Logout
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const appName = import.meta.env.VITE_APP_NAME || 'EV Charging Station Manager'

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.navbar-brand {
  font-size: 1.25rem;
}

.nav-link.active {
  font-weight: 600;
  color: rgba(255, 255, 255, 1) !important;
}

.dropdown-item:hover {
  background-color: var(--bs-primary);
  color: white;
}

.dropdown-item.text-danger:hover {
  background-color: var(--bs-danger);
}
</style>
