<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1 class="auth-card__title">Create account</h1>

      <form class="auth-form" @submit.prevent="submit">
        <BaseInput
          v-model="pseudo"
          label="Username"
          type="text"
          autocomplete="username"
          required
        />
        <BaseInput
          v-model="email"
          label="Email"
          type="email"
          autocomplete="email"
          required
        />
        <BaseInput
          v-model="password"
          label="Password"
          type="password"
          autocomplete="new-password"
          required
          :error="passwordError"
        />

        <p v-if="error" class="auth-form__error">{{ error }}</p>

        <BaseButton type="submit" :loading="loading" style="width: 100%">
          Register
        </BaseButton>
      </form>

      <p class="auth-card__footer">
        Already have an account? <RouterLink to="/login">Login</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import BaseInput from '../components/ui/BaseInput.vue';
import BaseButton from '../components/ui/BaseButton.vue';
import { useAuth } from '../composables/useAuth';

const { register, loading, error } = useAuth();

const pseudo = ref('');
const email = ref('');
const password = ref('');

const passwordError = computed(() =>
  password.value.length > 0 && password.value.length < 8
    ? 'Password must be at least 8 characters'
    : '',
);

async function submit() {
  if (passwordError.value) return;
  await register({ pseudo: pseudo.value, email: email.value, password: password.value });
}
</script>

<style scoped>
.auth-page {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: var(--space-8) var(--space-4);
}

.auth-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-8);
  width: 100%;
  max-width: 400px;
  box-shadow: var(--shadow-sm);
}

.auth-card__title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin-bottom: var(--space-6);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.auth-form__error {
  font-size: var(--font-size-sm);
  color: var(--color-danger);
  background: var(--color-danger-light);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
}

.auth-card__footer {
  margin-top: var(--space-5);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  text-align: center;
}
</style>
