<template>
  <div ref="feedRef" class="feed" @scroll="onScroll">
    <!-- Sentinel for loading older messages when scrolling up -->
    <div ref="sentinelRef" class="feed__sentinel">
      <LoadingSpinner v-if="store.loading" size="20px" />
      <span v-else-if="!store.hasMore" class="feed__end">Beginning of conversation</span>
    </div>

    <!-- Messages (oldest → newest) -->
    <MessageItem
      v-for="message in store.messages"
      :key="message.id"
      :message="message"
    />

    <!-- Invisible anchor always sitting at the very bottom -->
    <div ref="bottomAnchor" class="feed__bottom-anchor" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useMessagesStore } from '../../stores/messages.store';
import MessageItem from './MessageItem.vue';
import LoadingSpinner from '../ui/LoadingSpinner.vue';

const POLL_INTERVAL = 5000;
const TOP_THRESHOLD = 80;

const store = useMessagesStore();

const feedRef = ref<HTMLElement | null>(null);
const sentinelRef = ref<HTMLElement | null>(null);
const bottomAnchor = ref<HTMLElement | null>(null);

let pollTimer: ReturnType<typeof setInterval> | null = null;
let isLoadingOlder = false;
let userHasScrolledUp = false;

/* ─── helpers ─── */

function scrollToBottom(instant = true) {
  const el = feedRef.value;
  if (!el) return;
  // Force layout so scrollHeight is up-to-date
  void el.offsetHeight;
  el.scrollTop = el.scrollHeight;
  if (!instant) {
    // As a fallback, also try the smooth API (some browsers batch layout)
    el.scrollTo({ top: el.scrollHeight, behavior: 'instant' });
  }
  userHasScrolledUp = false;
}

function isNearBottom(): boolean {
  const el = feedRef.value;
  if (!el) return true;
  return el.scrollHeight - el.scrollTop - el.clientHeight < 80;
}

/* ─── scroll handler: detect "user scrolled up" + load older ─── */

async function onScroll() {
  const el = feedRef.value;
  if (!el) return;

  // Track whether the user deliberately scrolled away from the bottom
  userHasScrolledUp = !isNearBottom();

  // Load older messages when near the top
  if (el.scrollTop <= TOP_THRESHOLD && !isLoadingOlder && store.hasMore && !store.loading) {
    isLoadingOlder = true;
    const prevHeight = el.scrollHeight;
    const prevTop = el.scrollTop;

    await store.loadPage();
    await nextTick();

    // Restore scroll position so the view doesn't jump
    el.scrollTop = prevTop + (el.scrollHeight - prevHeight);
    isLoadingOlder = false;
  }
}

/* ─── lifecycle ─── */

onMounted(async () => {
  store.reset();
  await store.loadPage();
  await nextTick();
  // After first load, force scroll to the very bottom (instant, no animation)
  scrollToBottom(true);

  pollTimer = setInterval(() => store.pollNew(), POLL_INTERVAL);
});

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer);
});

/* ─── react to new messages (poll / optimistic) ─── */

watch(
  () => store.messages.length,
  async (newLen, oldLen) => {
    if (newLen <= oldLen) return; // only care about additions
    if (isLoadingOlder) return;  // don't scroll when prepending old messages

    await nextTick();

    // If the user was near the bottom (or it's their own message), scroll down
    if (!userHasScrolledUp) {
      scrollToBottom(true);
    }
  },
);

/* ─── explicit signal from "send own message" ─── */

watch(
  () => store.scrollToLatestSignal,
  async (n, o) => {
    if (n <= o) return;
    await nextTick();
    scrollToBottom(true);
  },
);
</script>

<style scoped>
.feed {
  /* Fill all available vertical space inside .home */
  position: absolute;
  inset: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  /* Stack children vertically */
  display: flex;
  flex-direction: column;

  padding: var(--space-4);
  padding-bottom: calc(var(--statusbar-height) + var(--bottom-panel-height) + var(--space-8));
  gap: var(--space-1);
}

/* Push messages to the bottom when they don't fill the viewport */
.feed__sentinel {
  margin-top: auto;
  display: flex;
  justify-content: center;
  padding: var(--space-4) 0;
  min-height: 40px;
}

.feed__end {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.feed__bottom-anchor {
  width: 1px;
  height: 1px;
  flex-shrink: 0;
}
</style>
