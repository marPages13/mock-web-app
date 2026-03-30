<template>
  <div class="app">
    <AppNavbar />
    <main class="main-content">
      <RouterView :key="auth.version" />
    </main>
    <StatusBar />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import AppNavbar from './components/layout/AppNavbar.vue';
import StatusBar from './components/layout/StatusBar.vue';
import { useAuthStore } from './stores/auth.store';

const auth = useAuthStore();

// On every app load, verify the stored token is still valid.
// If the DB was wiped, the API returns 401 → the axios interceptor clears the token.
onMounted(async () => {
  if (auth.isAuthenticated) {
    await auth.fetchMe().catch(() => {/* interceptor handles logout */});
  }
});
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
</style>
