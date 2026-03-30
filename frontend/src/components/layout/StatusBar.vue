<template>
  <div class="status-bar">
    <span class="status-bar__dot" />
    <span class="status-bar__text">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { usePresence } from '../../composables/usePresence';

const { anon, users } = usePresence();

const label = computed(() => {
  const parts: string[] = [];
  if (anon.value > 0) {
    parts.push(`${anon.value} anonyme${anon.value > 1 ? 's' : ''}`);
  }
  if (users.value.length > 0) {
    parts.push(...users.value);
  }
  return parts.length > 0 ? parts.join(', ') : 'Aucun utilisateur en ligne';
});
</script>

<style scoped>
.status-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 50;
  height: var(--statusbar-height, 28px);
  border-top: 1px solid var(--color-border);
  background: var(--color-surface-glass);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: 0 var(--space-6);
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  flex-shrink: 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.04);
}

.status-bar__dot {
  width: 7px;
  height: 7px;
  border-radius: var(--radius-full);
  background: #22c55e;
  flex-shrink: 0;
}
</style>
