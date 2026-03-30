<template>
  <BaseModal v-model="open" title="Edit user">
    <form class="edit-form" @submit.prevent="submit">
      <BaseInput v-model="form.pseudo" label="Username" required />
      <BaseInput v-model="form.email" label="Email" type="email" required />
      <div class="field">
        <label class="field__label">Bio</label>
        <textarea v-model="form.bio" class="field__textarea" rows="2" />
      </div>
      <div class="field">
        <label class="field__label">Role</label>
        <select v-model="form.role" class="field__select">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <p v-if="error" class="edit-form__error">{{ error }}</p>
    </form>

    <template #footer>
      <BaseButton variant="secondary" @click="open = false">Cancel</BaseButton>
      <BaseButton :loading="loading" @click="submit">Save</BaseButton>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import BaseModal from '../ui/BaseModal.vue';
import BaseInput from '../ui/BaseInput.vue';
import BaseButton from '../ui/BaseButton.vue';
import type { User, UserRole } from '../../types/user.types';
import { updateUser } from '../../api/users.api';

const props = defineProps<{ user: User }>();
const open = defineModel<boolean>({ required: true });
const emit = defineEmits<{ updated: [user: User] }>();

const loading = ref(false);
const error = ref<string | null>(null);

const form = reactive({
  pseudo: '',
  email: '',
  bio: '',
  role: 'user' as UserRole,
});

watch(
  () => props.user,
  (u) => {
    form.pseudo = u.pseudo;
    form.email = u.email;
    form.bio = u.bio ?? '';
    form.role = u.role;
  },
  { immediate: true },
);

async function submit() {
  loading.value = true;
  error.value = null;
  try {
    const updated = await updateUser(props.user.id, {
      pseudo: form.pseudo,
      email: form.email,
      bio: form.bio,
      role: form.role,
    });
    emit('updated', updated);
    open.value = false;
  } catch {
    error.value = 'Failed to update user';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.edit-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.field__label {
  font-size: var(--font-size-sm);
  font-weight: 500;
  display: block;
  margin-bottom: var(--space-1);
}

.field__textarea,
.field__select {
  width: 100%;
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-family: inherit;
  background: var(--color-surface);
  color: var(--color-text-primary);
  outline: none;
}
.field__textarea:focus,
.field__select:focus {
  border-color: var(--color-accent);
}
.field__textarea {
  resize: vertical;
}

.edit-form__error {
  font-size: var(--font-size-sm);
  color: var(--color-danger);
}
</style>
