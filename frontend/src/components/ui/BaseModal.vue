<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-backdrop" @click.self="emit('update:modelValue', false)">
        <div class="modal" role="dialog" :aria-label="title">
          <div class="modal__header">
            <h2 class="modal__title">{{ title }}</h2>
            <button aria-label="Close" class="modal__close" @click="emit('update:modelValue', false)">
              &#x2715;
            </button>
          </div>
          <div class="modal__body">
            <slot />
          </div>
          <div v-if="$slots.footer" class="modal__footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{ modelValue: boolean; title: string }>();
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>();
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: var(--space-4);
}

.modal {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-5) var(--space-6);
  border-bottom: 1px solid var(--color-border);
}

.modal__title {
  font-size: var(--font-size-lg);
  font-weight: 600;
}

.modal__close {
  color: var(--color-text-muted);
  font-size: var(--font-size-lg);
  line-height: 1;
  padding: var(--space-1);
  border-radius: var(--radius-sm);
}
.modal__close:hover {
  background: var(--color-surface-alt);
  color: var(--color-text-primary);
}

.modal__body {
  padding: var(--space-6);
}

.modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-6);
  border-top: 1px solid var(--color-border);
}

/* Transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.15s;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
