import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', () => {
  const introShown = ref(false);
  const isPanelVisible = ref(false);

  function markIntroShown() {
    introShown.value = true;
  }

  function resetIntro() {
    introShown.value = false;
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
    introShown,
    isPanelVisible,
    markIntroShown,
    resetIntro,
    showPanel,
    hidePanel,
    togglePanel
  }
});
