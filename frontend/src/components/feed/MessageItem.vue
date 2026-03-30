<template>
  <div class="message" :class="{ 'message--own': isOwn }">
    <div class="message__avatar">{{ authorInitials }}</div>
    <div class="message__body">
      <div class="message__header">
        <span class="message__pseudo">{{ message.user?.pseudo ?? 'Deleted user' }}</span>
        <span class="message__time">{{ formattedTime }}</span>
      </div>
      <div class="message__bubble">
        <p class="message__text">{{ message.content }}</p>
        <template v-if="message.attachmentUrl">
          <img
            v-if="isImageAttachment && !imageBroken"
            :src="message.attachmentUrl"
            class="message-item__image"
            alt="Image"
            @error="imageBroken = true"
          />
          <a
            v-else
            :href="message.attachmentUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="message-item__attachment"
          >
            Attachment
          </a>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Message } from '../../types/message.types';
import { useAuthStore } from '../../stores/auth.store';

const props = defineProps<{ message: Message }>();

const auth = useAuthStore();
const imageBroken = ref(false);

const isOwn = computed(() => auth.user?.id === props.message.user?.id);

const isImageAttachment = computed(() => {
  if (!props.message.attachmentUrl) return false;
  try {
    const pathname = new URL(props.message.attachmentUrl).pathname;
    return /\.(jpe?g|png|gif|webp|svg|bmp)$/i.test(pathname);
  } catch {
    return false;
  }
});

const authorInitials = computed(() => {
  const pseudo = props.message.user?.pseudo ?? '?';
  return pseudo.slice(0, 2).toUpperCase();
});

const formattedTime = computed(() => {
  const date = new Date(props.message.createdAt);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) {
    return date.toLocaleTimeString('fr-CH', { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString('fr-CH', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
});
</script>

<style scoped>
.message {
  display: flex;
  align-items: flex-end;
  gap: var(--space-2);
  padding: var(--space-1) 0;
}

.message--own {
  flex-direction: row-reverse;
}

.message__avatar {
  width: 32px;
  height: 32px;
  min-width: 32px;
  border-radius: var(--radius-full);
  background: var(--color-accent-light);
  color: var(--color-accent);
  font-size: var(--font-size-xs);
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: flex-start;
  margin-top: var(--space-3);
}

.message__body {
  max-width: 70%;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.message--own .message__body {
  align-items: flex-end;
}

.message__header {
  display: flex;
  align-items: baseline;
  gap: var(--space-2);
}

.message--own .message__header {
  flex-direction: row-reverse;
}

.message__pseudo {
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--color-text-secondary);
}

.message__time {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.message__bubble {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-2) var(--space-3);
  border-bottom-left-radius: var(--radius-sm);
  box-shadow: var(--shadow-sm);
}

.message--own .message__bubble {
  background: var(--color-accent-light);
  border-color: var(--color-accent-light);
  border-bottom-left-radius: var(--radius-lg);
  border-bottom-right-radius: var(--radius-sm);
}

.message__text {
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  white-space: pre-wrap;
  word-break: break-word;
}

.message--own .message__text {
  color: var(--color-text-primary);
}

.message-item__image {
  display: block;
  max-width: 240px;
  max-height: 200px;
  object-fit: contain;
  border-radius: var(--radius-sm);
  margin-top: var(--space-1);
  cursor: pointer;
}

.message-item__attachment {
  font-size: var(--font-size-xs);
  color: var(--color-accent);
  text-decoration: underline;
  display: block;
  margin-top: var(--space-1);
}
</style>
