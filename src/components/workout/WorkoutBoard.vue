<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useProgramStore } from '@/stores/program'
import '@/styles/shared.css'

const auth = useAuthStore();
const program = useProgramStore();

const { appNameDemo } = storeToRefs(auth);
const { days } = storeToRefs(program);

const activeDayIndex = ref(0);

const activeDay = computed(() => days.value[activeDayIndex.value]);
</script>

<template>
  <div class="board">
    <header class="board__head">
      <h1 class="board__brand">
        {{ appNameDemo }}
      </h1>
      <button
        class="board__logout"
        @click="auth.signOut()"
      >
        Exit
      </button>
    </header>

    <div class="day-tabs">
      <button
        v-for="(day, index) in days"
        :key="day.id"
        class="day-tab"
        :class="{ active: activeDayIndex === index }"
        @click="activeDayIndex = index"
      >
        {{ day.name }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.board {
  max-width: 430px;
  margin: 0 auto;
  padding: 90px 24px 40px;
}

.board__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.board__brand {
  font-family: 'Anton', sans-serif;
  font-size: 32px;
  font-weight: 400;
  letter-spacing: .5px;
  text-transform: uppercase;
  color: var(--accent);
  text-shadow: 0 0 30px var(--accent-glow);
}

.board__logout {
  padding: 8px 14px;
  border-radius: 10px;
  background: var(--bg-card);
  border: 1.5px solid var(--border);
  color: var(--text-secondary);
  font-family: var(--font);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}
</style>