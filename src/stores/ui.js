import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', () => {
  const isPanelVisible = ref(false);

  function shouldShowIntro(userId) {
    if (!userId) return false
    return !localStorage.getItem(`intro_shown_${userId}`);
  }

  function markIntroShown(userId) {
    if (!userId) return
    localStorage.setItem(`intro_shown_${userId}`, 'true')
  }

  function resetIntro(userId) {
    if (!userId) return
    localStorage.removeItem(`intro_shown_${userId}`)
  }

  function showPanel() {
    isPanelVisible.value = true;
  }

  function hidePanel() {
    isPanelVisible.value = false;
  }

  function togglePanel() {
    isPanelVisible.value = !isPanelVisible.value;
  }

  return {
    isPanelVisible,
    shouldShowIntro,
    markIntroShown,
    resetIntro,
    showPanel,
    hidePanel,
    togglePanel
  }
});
