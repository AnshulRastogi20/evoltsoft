<template>
  <footer class="bg-light border-top py-3 mt-auto">
    <div class="container-fluid">
      <div class="row align-items-center">
        <div class="col-md-6">
          <small class="text-muted">
            © {{ currentYear }} {{ appName }}. All rights reserved.
          </small>
        </div>
        <div class="col-md-6 text-md-end">
          <small class="text-muted">
            Version {{ appVersion }}
          </small>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
const appName = import.meta.env.VITE_APP_NAME || 'EV Charging Station Manager'
const appVersion = import.meta.env.VITE_APP_VERSION || '1.0.0'
</script>

<style scoped>
footer {
  flex-shrink: 0;
}
</style>
