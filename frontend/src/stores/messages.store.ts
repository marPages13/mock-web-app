import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Message } from '../types/message.types';
import { apiClient } from '../api/client';

export const useMessagesStore = defineStore('messages', () => {
  const messages = ref<Message[]>([]);
  const hasMore = ref(true);
  const loading = ref(false);
  const scrollToLatestSignal = ref(0);

  // Cursor: the smallest id currently loaded (used to fetch older pages)
  const cursor = ref<number | undefined>(undefined);

  async function loadPage() {
    if (loading.value || !hasMore.value) return;
    loading.value = true;

    try {
      const params: Record<string, string | number> = { limit: 30 };
      if (cursor.value !== undefined) params.before = cursor.value;

      const { data } = await apiClient.get<{ messages: Message[]; hasMore: boolean }>(
        '/messages',
        { params },
      );

      // Prepend older messages (they come back newest-first within the batch, reverse to oldest-first)
      const older = [...data.messages].reverse();
      messages.value = [...older, ...messages.value];

      hasMore.value = data.hasMore;

      if (data.messages.length > 0) {
        // The last item in the response is the oldest of the batch
        cursor.value = data.messages[data.messages.length - 1].id;
      }
    } finally {
      loading.value = false;
    }
  }

  function appendMessage(message: Message) {
    messages.value.push(message);
  }

  function appendOwnMessage(message: Message) {
    messages.value.push(message);
    scrollToLatestSignal.value++;
  }

  function replaceMessage(tempId: number, message: Message) {
    const tempIndex = messages.value.findIndex((item) => item.id === tempId);
    const existingIndex = messages.value.findIndex((item) => item.id === message.id);

    if (existingIndex !== -1 && existingIndex !== tempIndex) {
      if (tempIndex !== -1) {
        messages.value.splice(tempIndex, 1);
      }
      return;
    }

    if (tempIndex !== -1) {
      messages.value.splice(tempIndex, 1, message);
      return;
    }

    messages.value.push(message);
  }

  function removeMessage(id: number) {
    messages.value = messages.value.filter((m) => m.id !== id);
  }

  /** Fetch messages newer than the latest one currently loaded. */
  async function pollNew() {
    const latest = messages.value.length
      ? messages.value[messages.value.length - 1].id
      : undefined;

    const params: Record<string, string | number> = { limit: 50 };
    if (latest !== undefined) params.after = latest;

    const { data } = await apiClient.get<{ messages: Message[]; hasMore: boolean }>(
      '/messages',
      { params },
    );

    if (data.messages.length > 0) {
      // API returns newest-first, reverse to oldest-first then append
      const newer = [...data.messages].reverse();
      messages.value.push(...newer);
    }
  }

  function reset() {
    messages.value = [];
    hasMore.value = true;
    cursor.value = undefined;
    scrollToLatestSignal.value = 0;
  }

  return {
    messages,
    hasMore,
    loading,
    scrollToLatestSignal,
    loadPage,
    appendMessage,
    appendOwnMessage,
    replaceMessage,
    removeMessage,
    pollNew,
    reset,
  };
});
