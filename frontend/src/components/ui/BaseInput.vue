<template>
  <div class="field">
    <label v-if="label" :for="inputId" class="field__label">{{ label }}</label>
    <input
      :id="inputId"
      :class="['field__input', { 'field__input--error': error }]"
      v-bind="$attrs"
      :value="modelValue"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <span v-if="error" class="field__error">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
import { useId } from 'vue';

defineOptions({ inheritAttrs: false });

defineProps<{
  modelValue?: string;
  label?: string;
  error?: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const inputId = useId();
</script>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.field__label {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-primary);
}

.field__input {
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  color: var(--color-text-primary);
  font-size: var(--font-size-base);
  transition: border-color 0.15s;
  outline: none;
  width: 100%;
}

.field__input:focus {
  border-color: var(--color-accent);
}

.field__input--error {
  border-color: var(--color-danger);
}

.field__error {
  font-size: var(--font-size-xs);
  color: var(--color-danger);
}
</style>
