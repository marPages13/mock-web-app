<template>
  <div class="input-bar">
    <div class="input-bar__row">
      <textarea
        ref="textareaRef"
        v-model="content"
        class="input-bar__textarea"
        placeholder="Write a message..."
        rows="1"
        @keydown.enter.exact.prevent="submit"
        @input="autoResize"
      />
      <label class="input-bar__attach" title="Attach file">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/>
        </svg>
        <input
          ref="fileInputRef"
          type="file"
          class="input-bar__file-hidden"
          @change="handleFileChange"
        />
      </label>
      <BaseButton
        variant="primary"
        :loading="sending"
        aria-label="Send"
        :disabled="!canSubmit"
        @click="submit"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
        </svg>
      </BaseButton>
    </div>
    <div v-if="attachedFile" class="input-bar__preview">
      <img v-if="previewUrl" :src="previewUrl" class="input-bar__preview-img" alt="Preview" />
      <span class="input-bar__file-name">{{ attachedFile.name }}</span>
      <button class="input-bar__file-remove" type="button" @click="clearAttachment">✕</button>
    </div>
    <p v-if="error" class="input-bar__error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import BaseButton from '../ui/BaseButton.vue';
import { useMessages } from '../../composables/useMessages';

const emit = defineEmits<{ sent: [] }>();

const { sending, error, sendMessage } = useMessages();

const content = ref('');
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);
const attachedFile = ref<File | null>(null);
const previewUrl = ref<string | null>(null);

watch(attachedFile, (file, _old) => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = null;
  }
  if (file && file.type.startsWith('image/')) {
    previewUrl.value = URL.createObjectURL(file);
  }
});

const canSubmit = computed(() => content.value.trim().length > 0);

function autoResize() {
  const el = textareaRef.value;
  if (!el) return;
  el.style.height = 'auto';
  el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
}

function handleFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0] ?? null;
  attachedFile.value = file;
}

function clearAttachment() {
  attachedFile.value = null;
  if (fileInputRef.value) fileInputRef.value.value = '';
}

async function submit() {
  if (!canSubmit.value || sending.value) return;
  const text = content.value.trim();
  const file = attachedFile.value;
  content.value = '';
  clearAttachment();
  await nextTick();
  autoResize();
  await sendMessage(text, file ?? undefined);
  emit('sent');
}
</script>

<style scoped>
.input-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: var(--statusbar-height);
  z-index: 45;
  border-top: 1px solid var(--color-border);
  background: var(--color-surface-glass);
  backdrop-filter: blur(14px);
  padding: var(--space-3) var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  width: 100%;
  box-shadow: 0 -10px 30px rgba(24, 24, 27, 0.06);
}

.input-bar__row {
  display: flex;
  align-items: flex-end;
  gap: var(--space-2);
  width: 100%;
}

.input-bar__textarea {
  flex: 1;
  min-width: 0;
  resize: none;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-sm);
  line-height: 1.5;
  background: var(--color-surface-alt);
  color: var(--color-text-primary);
  outline: none;
  overflow-y: hidden;
  transition: border-color 0.15s, background 0.15s;
}
.input-bar__textarea:focus {
  border-color: var(--color-accent);
  background: var(--color-surface);
}

.input-bar__error {
  font-size: var(--font-size-xs);
  color: var(--color-danger);
}

.input-bar__attach {
  cursor: pointer;
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  padding: var(--space-1);
}
.input-bar__attach:hover { color: var(--color-accent); }
.input-bar__file-hidden { display: none; }
.input-bar__preview {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.input-bar__preview-img {
  height: 48px;
  width: 48px;
  object-fit: cover;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  flex-shrink: 0;
}

.input-bar__file-name {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.input-bar__file-remove {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-danger);
  padding: 0;
  font-size: var(--font-size-xs);
  flex-shrink: 0;
}
</style>
