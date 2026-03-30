<template>
  <div class="home">
    <MessageFeed />

    <template v-if="auth.isAuthenticated">
      <Transition name="hint">
        <div v-if="showHint" class="input-hint" @click="dismissHint">
          <span>Write your first message here 👇</span>
          <button class="input-hint__close" aria-label="Dismiss">✕</button>
          <div class="input-hint__arrow" />
        </div>
      </Transition>
      <MessageInput @sent="dismissHint" />
    </template>

    <div v-else class="home__guest-bar">
      <RouterLink to="/login">Login</RouterLink> or
      <RouterLink to="/register">register</RouterLink> to join the conversation.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MessageFeed from '../components/feed/MessageFeed.vue';
import MessageInput from '../components/feed/MessageInput.vue';
import { useAuthStore } from '../stores/auth.store';

const auth = useAuthStore();

const HINT_KEY = 'inputHintDismissed';
const showHint = ref(auth.isAuthenticated && !localStorage.getItem(HINT_KEY));

function dismissHint() {
  showHint.value = false;
  localStorage.setItem(HINT_KEY, '1');
}
</script>

<style scoped>
.home {
  position: relative;
  flex: 1;
  width: 100%;
  height: calc(100vh - var(--navbar-height));
  overflow: hidden;
}

.home__guest-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: var(--statusbar-height);
  z-index: 45;
  padding: var(--space-3) var(--space-6);
  border-top: 1px solid var(--color-border);
  background: var(--color-surface-glass);
  backdrop-filter: blur(14px);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  text-align: center;
  width: 100%;
  box-shadow: 0 -10px 30px rgba(24, 24, 27, 0.06);
}

.input-hint {
  position: fixed;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  left: 50%;
  bottom: calc(var(--statusbar-height) + var(--bottom-panel-height) + var(--space-2));
  transform: translateX(-50%);
  padding: var(--space-2) var(--space-3);
  background: var(--color-accent);
  color: #fff;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  cursor: pointer;
  width: fit-content;
  box-shadow: var(--shadow-sm);
  z-index: 46;
}

.input-hint__close {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: var(--font-size-xs);
  opacity: 0.8;
  padding: 0;
  line-height: 1;
}
.input-hint__close:hover {
  opacity: 1;
}

.input-hint__arrow {
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid var(--color-accent);
}

.hint-enter-active,
.hint-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.hint-enter-from,
.hint-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(4px);
}
</style>
