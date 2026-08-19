<script setup>
import ThemeSwitch from '@/components/ThemeSwitch.vue'
</script>

<template>
  <div id="app">
    <ThemeSwitch class="app-theme-switch" />
    <router-view />
  </div>
</template>

<style scoped>
.app-theme-switch {
  position: fixed; 
  top: 30px; 
  left: 50%;
  transform: translateX(calc(195px - 100%));
  z-index: 10 
}
</style>
