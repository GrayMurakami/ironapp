<script setup>
defineProps({
  title: { type: String, required: true },
  message: { type: String, default: '' },
  confirmLabel: { type: String, default: 'Confirm' },
  cancelLabel: { type: String, default: 'Cancel' },
})

const emit = defineEmits(['confirm', 'cancel'])
</script>

<template>
  <div
    class="confirm-overlay"
    @click.self="emit('cancel')"
  >
    <div class="confirm-modal">
      <div class="confirm-modal__stripe" />
      <h2 class="confirm-modal__title">
        {{ title }}
      </h2>
      <p
        v-if="message"
        class="confirm-modal__message">
        {{ message }}
      </p>

      <div class="confirm-modal__actions">
        <button
          class="confirm-modal__cancel"
          @click="emit('cancel')">
          {{ cancelLabel }}
        </button>
        <button
          class="confirm-modal__confirm"
          @click="emit('confirm')">
          {{ confirmLabel }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.confirm-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.6);
}

.confirm-modal {
  width: 100%;
  max-width: 340px;
  padding: 0 22px 22px;
  border-radius: 20px;
  overflow: hidden;
  background: var(--bg-card);
  border: 1px solid var(--border);
  box-shadow: 0 24px 60px rgba(0, 0, 0, .5);
}

.confirm-modal__stripe {
  height: 4px;
  margin: 0 -22px 20px;
  background: linear-gradient(90deg, var(--error-red), transparent);
}

.confirm-modal__title {
  margin: 0;
  font-family: var(--display);
  font-size: 26px;
  font-weight: 400;
  letter-spacing: .5px;
  line-height: 1;
  text-transform: uppercase;
  color: var(--text);
}

.confirm-modal__message {
  margin: 16px 0 0;
  font-size: 13.5px;
  line-height: 1.5;
  color: var(--text-secondary);
  text-wrap: pretty;
}

.confirm-modal__actions {
  display: flex;
  gap: 10px;
  margin-top: 22px;
}

.confirm-modal__cancel {
  flex: 1;
  padding: 14px;
  border-radius: 13px;
  border: 1.5px solid var(--border);
  background: none;
  color: var(--text-secondary);
  font-family: var(--font);
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
}

.confirm-modal__confirm {
  flex: 1.4;
  padding: 14px;
  border-radius: 13px;
  border: 1.5px solid var(--error-red);
  background: color-mix(in srgb, var(--error-red) 12%, transparent);
  color: var(--error-red);
  font-family: var(--font);
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  transition: background .15s, color .15s;
}

.confirm-modal__confirm:active {
  background: var(--error-red);
  color: #fff;
}
</style>
