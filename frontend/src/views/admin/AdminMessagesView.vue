<template>
  <div>
    <h2 class="page-title">Messages</h2>

    <div v-if="loading" class="state-info">
      <LoadingSpinner />
    </div>
    <p v-else-if="error" class="state-error">{{ error }}</p>
    <p v-else-if="messages.length === 0" class="state-info">No messages.</p>

    <div v-else class="table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Content</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="msg in messages" :key="msg.id">
            <td class="td--muted">{{ msg.id }}</td>
            <td>{{ msg.user?.pseudo ?? '—' }}</td>
            <td class="td--content">{{ msg.content || '(image)' }}</td>
            <td class="td--muted">{{ formatDate(msg.createdAt) }}</td>
            <td>
              <BaseButton
                variant="danger"
                :loading="deletingId === msg.id"
                @click="remove(msg.id)"
              >
                Delete
              </BaseButton>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="hasMore" class="load-more">
        <BaseButton variant="secondary" :loading="loadingMore" @click="loadMore">
          Load older
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import BaseButton from '../../components/ui/BaseButton.vue';
import LoadingSpinner from '../../components/ui/LoadingSpinner.vue';
import { getMessages, deleteMessage } from '../../api/messages.api';
import type { Message } from '../../types/message.types';

const messages = ref<Message[]>([]);
const loading = ref(true);
const loadingMore = ref(false);
const hasMore = ref(false);
const error = ref<string | null>(null);
const deletingId = ref<number | null>(null);
const cursor = ref<number | undefined>();

onMounted(fetch);

async function fetch() {
  loading.value = true;
  error.value = null;
  try {
    const data = await getMessages({ limit: 50 });
    messages.value = [...data.messages].reverse();
    hasMore.value = data.hasMore;
    if (data.messages.length > 0) {
      cursor.value = data.messages[data.messages.length - 1].id;
    }
  } catch {
    error.value = 'Failed to load messages';
  } finally {
    loading.value = false;
  }
}

async function loadMore() {
  loadingMore.value = true;
  try {
    const data = await getMessages({ limit: 50, before: cursor.value });
    const older = [...data.messages].reverse();
    messages.value = [...older, ...messages.value];
    hasMore.value = data.hasMore;
    if (data.messages.length > 0) {
      cursor.value = data.messages[data.messages.length - 1].id;
    }
  } finally {
    loadingMore.value = false;
  }
}

async function remove(id: number) {
  deletingId.value = id;
  try {
    await deleteMessage(id);
    messages.value = messages.value.filter((m) => m.id !== id);
  } finally {
    deletingId.value = null;
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('fr-CH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
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

.td--content {
  max-width: 320px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.load-more {
  display: flex;
  justify-content: center;
  padding: var(--space-6) 0;
}
</style>
