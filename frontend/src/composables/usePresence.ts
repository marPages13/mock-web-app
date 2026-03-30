import { ref, watch, onUnmounted } from 'vue';
import { useAuthStore } from '../stores/auth.store';

export interface PresenceState {
  anon: number;
  users: string[];
}

export function usePresence() {
  const auth = useAuthStore();
  const anon = ref(0);
  const users = ref<string[]>([]);

  let es: EventSource | null = null;

  function connect(token: string | null) {
    es?.close();

    const url = token
      ? `/api/presence/stream?token=${encodeURIComponent(token)}`
      : '/api/presence/stream';

    es = new EventSource(url);
    es.onmessage = (event) => {
      try {
        const state: PresenceState = JSON.parse(event.data);
        anon.value = state.anon;
        users.value = state.users;
      } catch {
        // malformed message — ignore
      }
    };
  }

  watch(
    () => auth.token,
    (token) => {
      connect(token);
    },
    { immediate: true },
  );

  onUnmounted(() => {
    es?.close();
  });

  return { anon, users };
}
