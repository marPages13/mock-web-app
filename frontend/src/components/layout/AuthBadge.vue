<template>
  <div ref="badgeRef" class="auth-badge">
    <!-- Logged in -->
    <button v-if="auth.isAuthenticated" class="badge badge--user" @click="open = !open">
      <img
        v-if="auth.user?.avatarUrl && !avatarBroken"
        :src="auth.user.avatarUrl"
        alt="Avatar"
        class="badge__avatar"
        @error="avatarBroken = true"
      />
      <span v-else>{{ auth.initials }}</span>
    </button>

    <!-- Guest -->
    <div v-else class="guest-links">
      <RouterLink to="/login" class="nav-link">Login</RouterLink>
      <RouterLink to="/register" class="nav-link nav-link--accent">Register</RouterLink>
    </div>

    <!-- Dropdown -->
    <Transition name="dropdown">
      <div v-if="open && auth.isAuthenticated" class="dropdown">
        <div class="dropdown__name">{{ auth.user?.pseudo }}</div>
        <RouterLink to="/profile" class="dropdown__item" @click="open = false">Profile</RouterLink>
        <RouterLink v-if="auth.isAdmin" to="/admin" class="dropdown__item" @click="open = false">
          Admin
        </RouterLink>
        <button class="dropdown__item dropdown__item--danger" @click="handleLogout">
          Logout
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useAuth } from '../../composables/useAuth';

const { auth, logout } = useAuth();
const open = ref(false);
const badgeRef = ref<HTMLElement | null>(null);
const avatarBroken = ref(false);

// Reset broken flag whenever the avatar URL changes (e.g. after a new upload)
watch(() => auth.user?.avatarUrl, () => { avatarBroken.value = false; });

function handleLogout() {
  open.value = false;
  logout();
}

function onClickOutside(e: MouseEvent) {
  if (badgeRef.value && !badgeRef.value.contains(e.target as Node)) {
    open.value = false;
  }
}

onMounted(() => document.addEventListener('click', onClickOutside));
onUnmounted(() => document.removeEventListener('click', onClickOutside));
</script>

<style scoped>
.auth-badge {
  position: relative;
}

.badge {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: opacity 0.15s;
  border: none;
  padding: 0;
  line-height: 1;
}

.badge--user {
  background: var(--color-accent);
  color: #fff;
  overflow: hidden;
}
.badge--user:hover {
  opacity: 0.85;
}
.badge__avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--radius-full);
}

.guest-links {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.nav-link {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  font-weight: 500;
}
.nav-link:hover {
  color: var(--color-text-primary);
  text-decoration: none;
}
.nav-link--accent {
  color: var(--color-accent);
}

.dropdown {
  position: absolute;
  top: calc(100% + var(--space-2));
  right: 0;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  min-width: 160px;
  z-index: 50;
  overflow: hidden;
}

.dropdown__name {
  padding: var(--space-3) var(--space-4);
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text-primary);
  border-bottom: 1px solid var(--color-border);
}

.dropdown__item {
  display: block;
  width: 100%;
  text-align: left;
  padding: var(--space-3) var(--space-4);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  transition: background 0.1s;
}
.dropdown__item:hover {
  background: var(--color-surface-alt);
  color: var(--color-text-primary);
  text-decoration: none;
}
.dropdown__item--danger {
  color: var(--color-danger);
}
.dropdown__item--danger:hover {
  background: var(--color-danger-light);
  color: var(--color-danger);
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.1s, transform 0.1s;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
