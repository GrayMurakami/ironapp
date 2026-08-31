<script setup>
import { useRoute } from 'vue-router'
import { useProgramStore } from '@/stores/program'
import ThemeSwitch from '@/components/ThemeSwitch.vue'
import TopPanel from '@/components/TopPanel.vue'

const route = useRoute();
const program = useProgramStore();
</script>

<template>
  <div id="app">
    <ThemeSwitch 
      v-if="route.name === 'login'"
      class="app-theme-switch"
    />
    <TopPanel
      v-if="route.name === 'home' && program.hasDays"
    />
    <router-view />
  </div>
</template>

<style scoped>
.app-theme-switch {
  position: fixed; 
  top: 30px; 
  left: 45%;
  transform: translateX(calc(195px - 100%));
  z-index: 10 
}
</style>
