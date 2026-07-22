<script setup>
import { ref, watchEffect } from 'vue'

const theme = ref(localStorage.getItem('theme') || 'light');

watchEffect(() => {
  document.documentElement.setAttribute('data-theme', theme.value);
  localStorage.setItem('theme', theme.value);
});

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <div id="app">
    <h1>IRON</h1>

    <button
      class="theme-switch"
      :class="{ 'is-dark': theme === 'dark' }"
      @click="toggleTheme"
      arial-label="Switch Theme"
    >
      <span class="theme-switch__icon">☀️</span>
      <span class="theme-switch__icon">🌙</span>
      <span class="theme-switch__thumb"></span>
    </button>
  </div>
</template>

<style scoped>
.theme-switch {
  position: relative;
  width: 64px;
  height: 34px;
  border-radius: 999px;
  border: 1px solid var(--border-strong);
  background: var(--bg-card);
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0 8px;
  justify-content: space-between;
}

.theme-switch__icon {
  font-size: 14px;
  line-height: 1;
  z-index: 1;
}

.theme-switch__thumb {
  position: absolute;
  top: 3px;
  left: 5px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--accent);
  transition: transform 0.25s ease;
}

.theme-switch.is-dark .theme-switch__thumb {
  transform: translateX(26px);
}
</style>
