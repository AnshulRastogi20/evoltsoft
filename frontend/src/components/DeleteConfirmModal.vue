<template>
  <div class="modal fade" :class="{ show: show }" :style="{ display: show ? 'block' : 'none' }" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header border-0 pb-0">
          <h5 class="modal-title text-danger">
            <i class="fas fa-exclamation-triangle me-2"></i>
            Confirm Deletion
          </h5>
          <button type="button" class="btn-close" @click="$emit('cancel')"></button>
        </div>
        
        <div class="modal-body">
          <div class="text-center mb-3">
            <div class="alert alert-danger d-inline-flex align-items-center">
              <i class="fas fa-trash-alt fa-2x me-3"></i>
              <div>
                <strong>This action cannot be undone!</strong>
                <div class="small">The {{ itemType }} will be permanently removed.</div>
              </div>
            </div>
          </div>
          
          <p class="mb-3">
            Are you sure you want to delete 
            <strong class="text-danger">{{ getItemName() }}</strong>?
          </p>
          
          <div v-if="item" class="bg-light p-3 rounded mb-3">
            <div class="row text-sm">
              <div v-if="item.name" class="col-12 mb-2">
                <strong>Name:</strong> {{ item.name }}
              </div>
              <div v-if="item.location?.address" class="col-12 mb-2">
                <strong>Address:</strong> {{ item.location.address }}
              </div>
              <div v-if="item.status" class="col-6">
                <strong>Status:</strong> 
                <span class="badge" :class="getStatusBadgeClass(item.status)">
                  {{ item.status }}
                </span>
              </div>
              <div v-if="item.connectorType" class="col-6">
                <strong>Connector:</strong> {{ item.connectorType }}
              </div>
            </div>
          </div>
          
          <div class="alert alert-warning">
            <i class="fas fa-info-circle me-2"></i>
            <strong>Please note:</strong> This will permanently remove the {{ itemType }} from the system.
            Any associated data will also be deleted.
          </div>
        </div>

        <div class="modal-footer border-0 pt-0">
          <button type="button" class="btn btn-secondary" @click="$emit('cancel')">
            <i class="fas fa-times me-2"></i>
            Cancel
          </button>
          <button type="button" class="btn btn-danger" @click="confirmDelete" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            <i v-else class="fas fa-trash me-2"></i>
            {{ loading ? 'Deleting...' : 'Delete ' + itemType }}
          </button>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Modal backdrop -->
  <div v-if="show" class="modal-backdrop fade show"></div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  item: {
    type: Object,
    default: null
  },
  itemType: {
    type: String,
    default: 'item'
  }
})

const emit = defineEmits(['confirm', 'cancel'])

const loading = ref(false)

const getItemName = () => {
  if (!props.item) return 'this ' + props.itemType
  
  if (props.item.name) return props.item.name
  if (props.item.title) return props.item.title
  if (props.item.email) return props.item.email
  
  return 'this ' + props.itemType
}

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'Active': return 'bg-success'
    case 'Inactive': return 'bg-danger'
    case 'Maintenance': return 'bg-warning text-dark'
    default: return 'bg-secondary'
  }
}

const confirmDelete = async () => {
  loading.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 500)) // Small delay for UX
    emit('confirm')
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
  padding: 1.25rem 1.25rem 0;
}

.modal-body {
  padding: 1.25rem;
}

.modal-footer {
  padding: 0 1.25rem 1.25rem;
}

.alert {
  border-radius: 0.5rem;
}

.text-sm {
  font-size: 0.875rem;
}

.btn {
  border-radius: 0.5rem;
}
</style>
