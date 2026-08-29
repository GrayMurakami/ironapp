<script setup>
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore();
</script>

<template>
  <button
    class="switch"
    :class="{ 'is-dark': themeStore.theme === 'dark' }"
    aria-label="Switch theme"
    @click="themeStore.toggle()"
  >
    <span class="switch__icon">
      ☀
    </span>
    <span class="switch__icon">
      ☾
    </span>
    <span class="switch__thumb" />
  </button>
</template>

<style scoped>
.switch {
  position: relative;
  flex: none;
  width: 64px;
  height: 32px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--bg-card);
  box-shadow: var(--shadow-card);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px;
  transition: background .35s, border-color .35s;
}

.switch__icon {
  position: relative;
  z-index: 1;
  width: 23px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* font-size: 12px; */
  line-height: 1;
  color: var(--text-secondary);
  opacity: .35;
  transition: opacity .25s ease, color .25s ease;
}

.switch:not(.is-dark) .switch__icon:first-of-type,
.switch.is-dark .switch__icon:nth-of-type(2) {
  opacity: 1;
  color: var(--on-accent);
}

.switch__thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 2px 8px var(--accent-glow);
  transition: transform .25s ease, background .35s;
}

.switch.is-dark .switch__thumb { 
  transform: translateX(32px) 
}
</style>