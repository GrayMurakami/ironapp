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

const totalSets = computed(() => {
  if (!activeDay.value) return 0
  return activeDay.value.program_exercises.reduce(
    (sum, exercise) => sum + exercise.sets_data.length,
    0
  )
});

const doneSets = computed(() => {
  if (!activeDay.value) return 0
  return activeDay.value.program_exercises.reduce(
    (sum, exercise) => sum + exercise.sets_data.filter((s) => s.done).length,
    0
  )
});

const volume = computed(() => {
  if (!activeDay.value) return 0
  return activeDay.value.program_exercises.reduce((sum, exercise) => {
    const exerciseVolume = exercise.sets_data
      .filter((s) => s.done)
      .reduce((sSum, s) => sSum + (s.weight || 0) * (s.reps || 0), 0)
    return sum + exerciseVolume;
  }, 0)
});

const progressPercent = computed(() => {
  if (totalSets.value === 0) return 0
  return Math.round((doneSets.value / totalSets.value) * 100)
});
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

    <div
      v-if="activeDay"
      class="stats-row"
    >
      <div class="progress-info">
        <span class="progress-info__label">
          {{ doneSets }} of {{ totalSets }} sets
        </span>
        <span class="progress-info__percent">
          {{ progressPercent }}%
        </span>
      </div>

      <div class="stat-cards">
        <div class="stat-card">
          <span class="stat-card__value">
            {{ activeDay.program_exercises.length }}
          </span>
          <span class="stat-card__label">
            exercises
          </span>
        </div>
        <div class="stat-card">
          <span class="stat-card__value">
            {{ volume }}
          </span>
          <span class="stat-card__label">
            kg volume
          </span>
        </div>
        <div class="stat-card">
          <span class="stat-card__value">
            {{ doneSets }}
          </span>
          <span class="stat-card__label">
            done
          </span>
        </div>
      </div>
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

.stats-row {
  margin: 20px 0 18px;
}

.progress-info {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 10px;
}

.progress-info__label {
  font-size: 13px;
  color: var(--text-secondary);
}

.progress-info__percent {
  font-family: var(--mono);
  font-size: 18px;
  font-weight: 700;
  color: var(--accent);
}

.stat-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 14px 8px;
  border-radius: 12px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-card);
}

.stat-card__value {
  font-family: var(--mono);
  font-size: 22px;
  font-weight: 700;
  color: var(--text);
}

.stat-card__label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .5px;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-top: 2px;
}
</style>