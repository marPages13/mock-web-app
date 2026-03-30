import { useMessagesStore } from '../stores/messages.store';
import { createMessage as apiCreateMessage } from '../api/messages.api';
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth.store';
import type { Message } from '../types/message.types';

export function useMessages() {
  const store = useMessagesStore();
  const auth = useAuthStore();
  const sending = ref(false);
  const error = ref<string | null>(null);

  function requestScrollToLatest() {
    if ('scrollToLatestSignal' in store && typeof store.scrollToLatestSignal === 'number') {
      store.scrollToLatestSignal += 1;
    }
  }

  async function sendMessage(content: string, file?: File) {
    sending.value = true;
    error.value = null;
    const tempId = -Date.now();

    try {
      const optimisticMessage: Message = {
        id: tempId,
        content,
        createdAt: new Date().toISOString(),
        attachmentUrl: null,
        user: auth.user
          ? { id: auth.user.id, pseudo: auth.user.pseudo }
          : null,
      };

      if ('appendOwnMessage' in store && typeof store.appendOwnMessage === 'function') {
        store.appendOwnMessage(optimisticMessage);
      } else {
        store.appendMessage(optimisticMessage);
        requestScrollToLatest();
      }

      const message = await apiCreateMessage({ content, file });
      if ('replaceMessage' in store && typeof store.replaceMessage === 'function') {
        store.replaceMessage(tempId, message);
        requestScrollToLatest();
      } else {
        store.removeMessage(tempId);
        store.appendMessage(message);
        requestScrollToLatest();
      }
    } catch (err) {
      store.removeMessage(tempId);
      error.value = err instanceof Error ? err.message : 'Failed to send message';
    } finally {
      sending.value = false;
    }
  }

  return { store, sending, error, sendMessage };
}
