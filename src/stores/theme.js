import { ref, watchEffect } from 'vue'
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', () => {
  const theme = ref(localStorage.getItem('theme') || 'light');

  watchEffect(() => {
    document.documentElement.setAttribute('data-theme', theme.value);
    localStorage.setItem('theme', theme.value)
  });

  function toggle() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  return { 
    theme,
    toggle
  }
});