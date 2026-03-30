import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import { useMessagesStore } from '../stores/messages.store';
import type { LoginPayload, RegisterPayload } from '../types/user.types';

export function useAuth() {
  const auth = useAuthStore();
  const router = useRouter();
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function login(payload: LoginPayload, redirect = '/') {
    loading.value = true;
    error.value = null;
    try {
      const messagesStore = useMessagesStore();
      messagesStore.reset();
      await auth.login(payload);
      await auth.fetchMe();
      await router.replace(redirect);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Login failed';
    } finally {
      loading.value = false;
    }
  }

  async function register(payload: RegisterPayload) {
    loading.value = true;
    error.value = null;
    try {
      await auth.register(payload);
      // Auto-login after registration
      await auth.login({ email: payload.email, password: payload.password });
      await auth.fetchMe();
      await router.replace('/');
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Registration failed';
    } finally {
      loading.value = false;
    }
  }

  function logout() {
    const messagesStore = useMessagesStore();
    messagesStore.reset();
    auth.logout();
    router.push('/');
  }

  return { auth, loading, error, login, register, logout };
}
