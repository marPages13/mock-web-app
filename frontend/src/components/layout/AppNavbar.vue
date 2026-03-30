<template>
  <header class="navbar">
    <div class="navbar__inner">
      <RouterLink to="/" class="navbar__brand" aria-label="MockWebApp home">
        <span class="navbar__logo" aria-hidden="true">
          <svg viewBox="0 0 48 48" class="navbar__logo-svg" role="img">
            <defs>
              <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#4f46e5" />
                <stop offset="100%" stop-color="#3730a3" />
              </linearGradient>
            </defs>
            <rect x="4" y="4" width="40" height="40" rx="12" fill="url(#brandGradient)" />
            <path
              d="M15 31V17h4.3l4.7 8.1 4.7-8.1H33v14h-3.8v-7.3l-3.7 6.2h-2.9l-3.8-6.3V31H15Z"
              fill="#ffffff"
            />
          </svg>
        </span>
        <span class="navbar__brand-text">
          <span class="navbar__brand-title">MockWebApp</span>
          <span class="navbar__brand-subtitle">Communication Platform</span>
        </span>
      </RouterLink>
      <div class="navbar__actions">
        <button
          class="theme-toggle"
          type="button"
          :aria-label="themeLabel"
          :title="themeLabel"
          @click="toggleTheme"
        >
          <svg v-if="isDark" viewBox="0 0 24 24" class="theme-toggle__icon" aria-hidden="true">
            <path
              d="M12 17.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11Zm0-15.5h.01M12 22h.01M4.22 4.22l.01.01M19.77 19.78l.01.01M2 12h.01M22 12h.01M4.22 19.78l.01-.01M19.77 4.22l.01-.01"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.8"
            />
          </svg>
          <svg v-else viewBox="0 0 24 24" class="theme-toggle__icon" aria-hidden="true">
            <path
              d="M20.2 15.3A8 8 0 0 1 8.7 3.8a8.5 8.5 0 1 0 11.5 11.5Z"
              fill="currentColor"
            />
          </svg>
        </button>
        <AuthBadge />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import AuthBadge from './AuthBadge.vue';
import { useTheme } from '../../composables/useTheme';

const { isDark, themeLabel, toggleTheme } = useTheme();
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 40;
  height: var(--navbar-height);
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
}

.navbar__inner {
  width: 100%;
  height: 100%;
  padding: 0 var(--space-6);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar__brand {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  color: var(--color-text-primary);
  letter-spacing: -0.02em;
}

.navbar__logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(79, 70, 229, 0.18);
  flex-shrink: 0;
}

.navbar__logo-svg {
  width: 42px;
  height: 42px;
  display: block;
}

.navbar__brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.05;
}

.navbar__brand-title {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-text-primary);
}

.navbar__brand-subtitle {
  font-size: var(--font-size-xs);
  font-weight: 500;
  letter-spacing: 0.04em;
  color: var(--color-text-muted);
}

.navbar__brand:hover {
  text-decoration: none;
  opacity: 0.85;
}

.navbar__actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.theme-toggle {
  width: 38px;
  height: 38px;
  border-radius: var(--radius-full);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  background: var(--color-surface-alt);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
}

.theme-toggle:hover {
  color: var(--color-text-primary);
  background: var(--color-accent-light);
  border-color: var(--color-accent-light);
}

.theme-toggle__icon {
  width: 18px;
  height: 18px;
  display: block;
}
</style>
