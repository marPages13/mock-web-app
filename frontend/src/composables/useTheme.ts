import { computed, ref } from 'vue';

const THEME_KEY = 'theme';

const initialDark = (() => {
  if (typeof window === 'undefined') return false;

  const stored = window.localStorage.getItem(THEME_KEY);
  if (stored === 'dark') return true;
  if (stored === 'light') return false;

  return window.matchMedia('(prefers-color-scheme: dark)').matches;
})();

const isDark = ref(initialDark);

function applyTheme(value: boolean) {
  if (typeof document === 'undefined') return;

  document.documentElement.dataset.theme = value ? 'dark' : 'light';
  window.localStorage.setItem(THEME_KEY, value ? 'dark' : 'light');
}

applyTheme(isDark.value);

export function useTheme() {
  function toggleTheme() {
    isDark.value = !isDark.value;
    applyTheme(isDark.value);
  }

  function setTheme(value: 'light' | 'dark') {
    isDark.value = value === 'dark';
    applyTheme(isDark.value);
  }

  return {
    isDark: computed(() => isDark.value),
    themeLabel: computed(() => (isDark.value ? 'Passer en mode clair' : 'Passer en mode sombre')),
    toggleTheme,
    setTheme,
  };
}