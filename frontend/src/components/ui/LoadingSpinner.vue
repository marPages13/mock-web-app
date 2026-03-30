<template>
  <div class="spinner" :style="{ width: size, height: size }" role="status" aria-label="Loading" />
</template>

<script setup lang="ts">
withDefaults(defineProps<{ size?: string }>(), { size: '24px' });
</script>

<style scoped>
.spinner {
  border: 2px solid var(--color-border);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
