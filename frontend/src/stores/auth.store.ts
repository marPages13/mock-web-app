import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User, LoginPayload, RegisterPayload } from '../types/user.types';
import { apiClient } from '../api/client';

export const useAuthStore = defineStore(
  'auth',
  () => {
    const token = ref<string | null>(null);
    const user = ref<User | null>(null);
    const version = ref(0);

    const isAuthenticated = computed(() => token.value !== null);
    const isAdmin = computed(() => user.value?.role === 'admin');
    const initials = computed(() => {
      const pseudo = user.value?.pseudo ?? '';
      return pseudo.slice(0, 2).toUpperCase();
    });

    async function login(payload: LoginPayload) {
      const { data } = await apiClient.post<{ token: string; user: User }>(
        '/auth/login',
        payload,
      );
      token.value = data.token;
      user.value = data.user;
      version.value++;
      // Keep token in localStorage for the axios interceptor
      localStorage.setItem('auth_token', data.token);
    }

    async function register(payload: RegisterPayload) {
      await apiClient.post('/auth/register', payload);
    }

    async function fetchMe() {
      const { data } = await apiClient.get<{ user: User }>('/users/me');
      user.value = data.user;
    }

    function logout() {
      token.value = null;
      user.value = null;
      version.value++;
      localStorage.removeItem('auth_token');
    }

    return { token, user, version, isAuthenticated, isAdmin, initials, login, register, fetchMe, logout };
  },
  {
    persist: {
      key: 'auth',
      storage: localStorage,
      pick: ['token', 'user'],
    },
  },
);
