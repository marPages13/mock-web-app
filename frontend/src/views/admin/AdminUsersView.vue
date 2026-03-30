<template>
  <div>
    <h2 class="page-title">Users</h2>

    <div v-if="loading" class="state-info">
      <LoadingSpinner />
    </div>
    <p v-else-if="error" class="state-error">{{ error }}</p>
    <p v-else-if="users.length === 0" class="state-info">No users.</p>

    <div v-else class="table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Registered</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td class="td--muted">{{ user.id }}</td>
            <td>{{ user.pseudo }}</td>
            <td class="td--muted">{{ user.email }}</td>
            <td>
              <span :class="['badge-role', `badge-role--${user.role}`]">{{ user.role }}</span>
            </td>
            <td class="td--muted">{{ formatDate(user.createdAt) }}</td>
            <td class="td--actions">
              <BaseButton variant="secondary" @click="openEdit(user)">Edit</BaseButton>
              <BaseButton
                variant="danger"
                :loading="deletingId === user.id"
                @click="remove(user.id)"
              >
                Delete
              </BaseButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <UserEditModal
      v-if="editingUser"
      v-model="editModalOpen"
      :user="editingUser"
      @updated="onUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import BaseButton from '../../components/ui/BaseButton.vue';
import LoadingSpinner from '../../components/ui/LoadingSpinner.vue';
import UserEditModal from '../../components/admin/UserEditModal.vue';
import { listUsers, deleteUser } from '../../api/users.api';
import type { User } from '../../types/user.types';

const users = ref<User[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const deletingId = ref<number | null>(null);
const editingUser = ref<User | null>(null);
const editModalOpen = ref(false);

onMounted(fetch);

async function fetch() {
  loading.value = true;
  error.value = null;
  try {
    users.value = await listUsers();
  } catch {
    error.value = 'Failed to load users';
  } finally {
    loading.value = false;
  }
}

function openEdit(user: User) {
  editingUser.value = user;
  editModalOpen.value = true;
}

function onUpdated(updated: User) {
  const idx = users.value.findIndex((u) => u.id === updated.id);
  if (idx !== -1) users.value[idx] = updated;
}

async function remove(id: number) {
  deletingId.value = id;
  try {
    await deleteUser(id);
    users.value = users.value.filter((u) => u.id !== id);
  } finally {
    deletingId.value = null;
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-CH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
</script>

<style scoped>
.page-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin-bottom: var(--space-6);
}

.state-info {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  padding: var(--space-8) 0;
  display: flex;
  justify-content: center;
}

.state-error {
  color: var(--color-danger);
  font-size: var(--font-size-sm);
}

.table-wrap {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--font-size-sm);
}

.table th {
  text-align: left;
  padding: var(--space-2) var(--space-3);
  border-bottom: 2px solid var(--color-border);
  color: var(--color-text-muted);
  font-weight: 500;
}

.table td {
  padding: var(--space-3);
  border-bottom: 1px solid var(--color-border);
  vertical-align: middle;
}

.td--muted {
  color: var(--color-text-muted);
}

.td--actions {
  display: flex;
  gap: var(--space-2);
}

.badge-role {
  font-size: var(--font-size-xs);
  font-weight: 600;
  padding: 2px var(--space-2);
  border-radius: var(--radius-full);
}

.badge-role--admin {
  background: var(--color-accent-light);
  color: var(--color-accent);
}

.badge-role--user {
  background: var(--color-surface-alt);
  color: var(--color-text-secondary);
}
</style>
