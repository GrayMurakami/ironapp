<script setup>
import { watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useProgramStore } from '@/stores/program'
import { useUiStore } from '@/stores/ui'
import ThemeSwitch from '@/components/ThemeSwitch.vue'

const auth = useAuthStore();
const router = useRouter();
const program = useProgramStore();
const ui = useUiStore();

let hideTimer = null;

function sheduleHide() {
  clearTimeout(hideTimer);
  hideTimer = setTimeout(() => {
    ui.hidePanel();
  }, 2666);
}

watch(
  () => ui.isPanelVisible,
  (visible) => {
    if (visible) {
      sheduleHide();
    } else {
      clearTimeout(hideTimer);
    }
  }
);

async function handleSignOut() {
  const isDemo = auth.user?.email === import.meta.env.VITE_DEMO_EMAIL;

  if (isDemo) {
    await program.resetDemoProgram();
    ui.resetIntro(auth.user?.id);
  }

  await auth.signOut();
  router.push('/login');
}

onMounted(() => {
  if (ui.shouldShowIntro(auth.user?.id)) {
    ui.showPanel();
    ui.markIntroShown(auth.user?.id);
  }
});

onUnmounted(() => {
  clearTimeout(hideTimer)
});
</script>

<template>
  <div
    class="top-panel"
    :class="{ 'top-panel--hidden': !ui.isPanelVisible }"
  >
    <ThemeSwitch
      @click="ui.hidePanel()"
    />

    <button
      class="top-panel__edit"
      :class="{ 'top-panel__edit--active': program.isEditMode }"
      aria-label="Edit mode"
      @click="program.toggleEditMode(); ui.showPanel()"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <path d="M17 3a2.83 2.83 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <span class="top-panel__edit-label">
        edit mode
      </span>
    </button>

    <button
      v-if="auth.user"
      class="top-panel__exit"
      aria-label="Log out"
      @click="handleSignOut"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M9 21H4a2 2 0 01-2-2V5a2 2 0 012-2h5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M16 17l5-5-5-5M21 12H9" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
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
  -webkit-backdrop-filter: blur(17px);
  border-bottom: 1px solid var(--border);
  transition: transform 0.35s ease, opacity 0.35s ease;
}

.top-panel--hidden {
  transform: translateY(-120%);
  opacity: 0;
  pointer-events: none;
}

.top-panel__edit {
  display: flex;
  align-items: center;
  gap: 0;
  height: 44px;
  padding: 0 14px;
  border-radius: 13px;
  background: var(--bg-card);
  border: 1.5px solid var(--border);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all .3s cubic-bezier(.4, 0, .2, 1);
}

.top-panel__edit svg {
  flex: none;
}

.top-panel__edit-label {
  max-width: 0;
  overflow: hidden;
  white-space: nowrap;
  font-family: var(--mono);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  transition: max-width .3s cubic-bezier(.4, 0, .2, 1);
}

.top-panel__edit--active {
  gap: 9px;
  padding: 0 20px;
  background: color-mix(in srgb, var(--cyan) 12%, transparent);
  border-color: var(--cyan);
  color: var(--cyan);
  box-shadow: 0 0 24px color-mix(in srgb, var(--cyan) 25%, transparent);
}

.top-panel__edit--active .top-panel__edit-label {
  max-width: 78px;
}

.top-panel__exit {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-color: var(--error-red);
  background: var(--bg-card);
  color: var(--error-red);
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
}
</style>