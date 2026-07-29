<script setup>
import { useRouter } from 'vue-router'

const router = useRouter();
</script>

<template>
  <div class="not-found">
    <h1>404</h1>
    <p>There is no such page!</p>
    <button @click="router.push('/')">
      Back to home page
    </button>
  </div>
</template>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  text-align: center;
}
.not-found h1 {
  font-size: 64px;
  color: var(--accent);
}
.not-found p {
  color: var(--text-secondary);
}
.not-found button {
  padding: 10px 20px;
  border-radius: var(--radius-sm);
  border: none;
  background: var(--accent);
  color: #fff;
  font-weight: 600;
}
</style>