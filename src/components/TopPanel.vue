<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import ThemeSwitch from '@/components/ThemeSwitch.vue'

const auth = useAuthStore();

const isVisible = ref(true);
let hideTimer = null;
let touchStartY = 0;

function sheduleHide() {
  clearTimeout(hideTimer);
  hideTimer = setTimeout(() => {
    isVisible.value = false;
  }, 3000);
}

function showPanel() {
  isVisible.value = true;
  sheduleHide();
}

function hideNow() {
  clearTimeout(hideTimer);
  isVisible.value = false;
}

function onTouchStart(e) {
  touchStartY = e.touches[0].clientY;
}

function onTouchEnd(e) {
  const touchEndY = e.changedTouches[0].clientY;
  const swipedDown = touchEndY - touchStartY > 50;
  const startedNearTop = touchStartY < 40;

  if (swipedDown && startedNearTop && !isVisible.value) {
    showPanel();
  }
}

onMounted(() => {
  window.addEventListener('touchstart', onTouchStart);
  window.addEventListener('touchend', onTouchEnd);
  sheduleHide();
});
</script>

<template>
  <div
    class="top-panel"
    :class="{ 'top-panel--hidden': !isVisible }"
  >
    <ThemeSwitch
      @click="hideNow"
    />
    <button
      v-if="auth.user"
      class="top-panel__exit"
      aria-label="Log out"
      @click="auth.signOut()"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M16 17l5-5-5-5M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.top-panel {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 20;
  max-width: 430px;
  margin: 0 auto;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: color-mix(in srgb, var(--bg) 70%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  transition: transform 0.35s ease, opacity 0.35s ease;
}

.top-panel--hidden {
  transform: translateY(-120%);
  opacity: 0;
  pointer-events: none;
}

.top-panel__exit {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-card);
  border: 1.5px solid var(--border);
  color: var(--text-secondary);
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
}

.top-panel__exit:hover {
  border-color: var(--error-red);
  color: var(--error-red);
}
</style>