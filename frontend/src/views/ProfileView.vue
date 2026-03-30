<template>
  <div class="profile-page">
    <div class="profile-card">
      <h1 class="profile-card__title">My profile</h1>

      <form class="profile-form" @submit.prevent="submit">
        <div class="field">
          <label class="field__label">Avatar</label>
          <div class="avatar-upload">
            <img
              v-if="avatarUrl"
              :src="avatarUrl"
              alt="Avatar"
              class="avatar-upload__preview"
            />
            <input
              type="file"
              accept="image/*"
              class="avatar-upload__input"
              @change="handleAvatarChange"
            />
            <p v-if="avatarError" class="profile-form__error">{{ avatarError }}</p>
          </div>
        </div>
        <BaseInput v-model="pseudo" label="Username" type="text" required />
        <div class="field">
          <label class="field__label">Bio</label>
          <textarea
            v-model="bio"
            class="field__textarea"
            rows="3"
            maxlength="500"
            placeholder="Tell us a bit about yourself..."
          />
        </div>

        <p v-if="success" class="profile-form__success">Profile updated.</p>
        <p v-if="error" class="profile-form__error">{{ error }}</p>

        <BaseButton type="submit" :loading="loading">Save changes</BaseButton>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import BaseInput from '../components/ui/BaseInput.vue';
import BaseButton from '../components/ui/BaseButton.vue';
import { useAuthStore } from '../stores/auth.store';
import { updateMe, uploadAvatar } from '../api/users.api';

const auth = useAuthStore();

const pseudo = ref(auth.user?.pseudo ?? '');
const bio = ref(auth.user?.bio ?? '');
const loading = ref(false);
const error = ref<string | null>(null);
const success = ref(false);
const avatarUrl = ref<string | null>(auth.user?.avatarUrl ?? null);
const avatarError = ref<string | null>(null);

onMounted(() => {
  pseudo.value = auth.user?.pseudo ?? '';
  bio.value = auth.user?.bio ?? '';
});

async function handleAvatarChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;
  avatarError.value = null;
  try {
    const url = await uploadAvatar(file);
    avatarUrl.value = url;
    await auth.fetchMe();
  } catch (err) {
    console.error('[uploadAvatar]', err);
    avatarError.value = 'Failed to upload avatar';
  }
}

async function submit() {
  loading.value = true;
  error.value = null;
  success.value = false;
  try {
    const updated = await updateMe({ pseudo: pseudo.value, bio: bio.value });
    await auth.fetchMe();
    pseudo.value = updated.pseudo;
    bio.value = updated.bio ?? '';
    success.value = true;
  } catch {
    error.value = 'Failed to update profile';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.profile-page {
  display: flex;
  justify-content: center;
  padding: var(--space-10) var(--space-4);
}

.profile-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-8);
  width: 100%;
  max-width: 480px;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.profile-card__title {
  font-size: var(--font-size-xl);
  font-weight: 600;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.field__label {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-primary);
  display: block;
  margin-bottom: var(--space-1);
}

.field__textarea {
  width: 100%;
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-family: inherit;
  resize: vertical;
  outline: none;
  transition: border-color 0.15s;
  background: var(--color-surface);
  color: var(--color-text-primary);
}
.field__textarea:focus {
  border-color: var(--color-accent);
}

.profile-form__success {
  font-size: var(--font-size-sm);
  color: var(--color-success);
}

.profile-form__error {
  font-size: var(--font-size-sm);
  color: var(--color-danger);
}

.avatar-upload {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.avatar-upload__preview {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--color-border);
}
.avatar-upload__input {
  font-size: var(--font-size-sm);
}
</style>
