<template>
  <div class="modal fade" ref="modalEl" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content glassmorphism-card">
        <div class="modal-header border-bottom border-glass">
          <h5 class="modal-title text-starlight-yellow-glow">{{ title }}</h5>
          <button type="button" class="btn-close custom-close-btn" @click="handleCancel" aria-label="Close"></button>
        </div>
        <div class="modal-body text-light">
          <p>{{ message }}</p>
        </div>
        <div class="modal-footer border-top border-glass">
          <button type="button" class="btn btn-secondary custom-outline-btn" @click="handleCancel"
            :disabled="isConfirming">
            {{ cancelText }}
          </button>
          <button type="button" class="btn gradient-button-danger" @click="handleConfirm" :disabled="isConfirming">
            <span v-if="isConfirming" class="spinner-border spinner-border-sm me-2" role="status"
              aria-hidden="true"></span>
            {{ isConfirming ? 'Đang xử lý...' : confirmText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue';
import { Modal } from 'bootstrap';

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: 'Xác nhận',
  },
  message: {
    type: String,
    required: true,
  },
  confirmText: {
    type: String,
    default: 'Xác nhận',
  },
  cancelText: {
    type: String,
    default: 'Hủy',
  },
  isConfirming: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['confirm', 'cancel', 'update:show']);

const modalEl = ref(null);
let modalInstance = null;

onMounted(() => {
  if (modalEl.value) {
    modalInstance = new Modal(modalEl.value, {
      backdrop: 'static', // Ngăn không cho đóng khi bấm ra ngoài
      keyboard: false // Ngăn không cho đóng bằng phím Esc
    });
    // Lắng nghe sự kiện khi modal của bootstrap được ẩn đi
    modalEl.value.addEventListener('hidden.bs.modal', () => {
      emit('update:show', false);
    });
  }
});

onUnmounted(() => {
  if (modalInstance) {
    modalInstance.dispose();
  }
});

// Đồng bộ trạng thái hiển thị của modal với prop 'show'
watch(() => props.show, (newValue) => {
  if (newValue) {
    modalInstance?.show();
  } else {
    modalInstance?.hide();
  }
});

const handleConfirm = () => {
  emit('confirm');
};

const handleCancel = () => {
  emit('update:show', false);
  emit('cancel');
};
</script>

<style scoped>
/* Sao chép các style tương tự từ các file view của bạn */
.glassmorphism-card {
  background: var(--surface-glass);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid var(--border-glass);
  border-radius: 1rem;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}

.text-starlight-yellow-glow {
  color: var(--starlight-yellow);
  text-shadow: 0 0 5px rgba(255, 217, 77, 0.7), 0 0 10px rgba(255, 217, 77, 0.5);
}

.border-glass {
  border-color: var(--border-glass) !important;
}

.custom-close-btn {
  filter: invert(1) grayscale(100%) brightness(200%);
}

.custom-outline-btn {
  border-color: var(--border-glass);
  color: var(--nebula-white);
}

.custom-outline-btn:hover {
  background-color: var(--cosmic-blue);
  border-color: var(--cosmic-blue);
}

.gradient-button-danger {
  border: none;
  color: var(--nebula-white);
  font-weight: bold;
  border-radius: 0.5rem;
  background: linear-gradient(90deg, #dc3545, #ff6b6b);
}
</style>