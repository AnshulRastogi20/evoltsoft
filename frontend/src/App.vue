<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <!-- Navigation -->
    <NavBar v-if="authStore.isAuthenticated" />
    
    <!-- Main Content -->
    <main class="flex-grow-1 w-100">
      <router-view />
    </main>
    
    <!-- Footer -->
    <AppFooter v-if="authStore.isAuthenticated" />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import NavBar from '@/components/NavBar.vue'
import AppFooter from '@/components/AppFooter.vue'

const authStore = useAuthStore()

onMounted(async () => {
  try {
    // Initialize authentication state
    await authStore.initializeAuth()
  } catch (error) {
    console.error('Error initializing auth:', error)
  }
})
</script>

<style>
/* Global app styles */
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  margin: 0;
  padding: 0;
}

/* Ensure full width for main content */
main {
  width: 100%;
  margin: 0;
  padding: 0;
}

/* Override Bootstrap container constraints for full-width sections */
.full-width {
  width: 100vw;
  margin-left: calc(-50vw + 50%);
}
</style>
