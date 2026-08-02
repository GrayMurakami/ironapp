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
  top: 106px; 
  right: 26px; 
  z-index: 10 
}
</style>
