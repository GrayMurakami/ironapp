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

function toggleSetDone(exercise, setIndex) {
  exercise.sets_data[setIndex].done = !exercise.sets_data[setIndex].done;
}

function updateSetsCount(exercise, newCount) {
  const count = Math.max(1, Math.min(10, newCount || 1));
  const current = exercise.sets_data.length

  if (count > current) {
    const toAdd = count - current;
    for (let i = 0; i < toAdd; i++) {
      exercise.sets_data.push({ weight: null, reps: null, done: false })
    }
  } else if (count < current) {
    exercise.sets_data.splice(count)
  }

  exercise.sets = count;
}

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
      class="day-progress"
    >
      <div
        class="day-progress__fill"
        :style="{ width: progressPercent + '%' }"
      />
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

    <div
      v-if="activeDay"
      class="exercises"
    >
      <div
        v-for="(exercise, exIndex) in activeDay.program_exercises"
        :key="exercise.id"
        class="exercise-card"
      >
        <div class="exercise-card__head">
          <span class="exercise-card__num">
            {{ String(exIndex + 1).padStart(2, '0') }}
          </span>
          <div class="exercise-card__title">
            <span class="exercise-card__name">
              {{ exercise.name }}
            </span>
          </div>
        </div>

        <div class="exercise-card__grid">
          <span class="exercise-card__label exercise-card__label--sets">
            sets
          </span>
          <div class="exercise-card__box">
            <input
              class="exercise-card__input"
              :value="exercise.sets"
              type="number"
              inputmode="numeric"
              @input="updateSetsCount(exercise, Number($event.target.value))"
            />
          </div>

          <span class="exercise-card__label exercise-card__label--rest">
           rest
          </span>
          <div class="exercise-card__box">
            <input
              class="exercise-card__input"
              v-model.number="exercise.rest_seconds"
              type="number"
              inputmode="numeric"
            />
          </div>
          <span class="exercise-card__unit">
            sec
          </span>
          
          <div class="exercise-card__divider" />

          <template
            v-for="(set, setIndex) in exercise.sets_data"
            :key="setIndex"
          >
            <span class="exercise-card__label exercise-card__label--weight">
              kg
            </span>
            <div class="exercise-card__box">
              <input
                class="exercise-card__input"
                v-model.number="set.weight"
                type="number"
                inputmode="decimal"
                placeholder="-"  
              />
            </div>
            
            <span class="exercise-card__label exercise-card__label--reps">
              reps
            </span>
            <div class="exercise-card__box">
              <input
                class="exercise-card__input"
                v-model.number="set.reps"
                type="number"
                inputmode="numeric"
                placeholder="-"  
              />
            </div>

            <button
              class="exercise-card__check"
              :class="{ 'exercise-card__check--done': set.done }"
              @click="toggleSetDone(exercise, setIndex)"
            >
              {{ set.done ? '✓' : setIndex + 1 }}
            </button>
          </template>
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

.day-progress {
  height: 4px;
  border-radius: 2px;
  background: var(--border);
  overflow: hidden;
  margin-bottom: 16px;
}

.day-progress__fill {
  height: 100%;
  background: var(--accent);
  transition: width .3s ease;
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

.exercises {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.exercise-card {
  border-radius: 16px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-card);
  padding: 16px;
}

.exercise-card__head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

.exercise-card__num {
  flex: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1.5px solid var(--error-red);
  color: var(--error-red);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--mono);
  font-size: 12px;
  font-weight: 700;
}

.exercise-card__title {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.exercise-card__name {
  font-size: 15px;
  font-weight: 800;
  color: var(--text);
}

.exercise-card__grid {
  display: grid;
  grid-template-columns: auto 68px auto 68px 40px;
  gap: 8px 6px;
  align-items: center;
  justify-content: center;
}

.exercise-card__divider {
  grid-column: 1 / -1;
  height: 1px;
  background: var(--border);
  margin: 4px 0;
}

.exercise-card__label {
  font-family: var(--mono);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.exercise-card__label--sets { color: var(--accent) }
.exercise-card__label--rest { color: var(--green); margin-left: 16px }
.exercise-card__label--weight { color: var(--gold) }
.exercise-card__label--reps { color: var(--cyan); margin-left: 16px }

.exercise-card__unit {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--text-muted);
  align-self: end;
  padding-bottom: 3px;
}

.exercise-card__box {
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 10px;
  border-radius: 10px;
  background: var(--bg);
  border: 1.5px solid var(--border);
  transition: border-color .2s;
}

.exercise-card__box:focus-within { border-color: var(--accent) }

.exercise-card__input {
  width: 100%;
  min-width: 0;
  background: none;
  border: none;
  outline: none;
  text-align: right;
  font-family: 'Anton', sans-serif;
  font-size: 15px;
  font-weight: 400;
  color: var(--text);
  -moz-appearance: textfield;
}

.exercise-card__input::-webkit-outer-spin-button,
.exercise-card__input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.exercise-card__check {
  width: 40px;
  height: 36px;
  margin-left: 10px;
  border-radius: 10px;
  background: var(--bg);
  border: 1.5px solid var(--border);
  color: var(--text-muted);
  font-family: 'Anton', sans-serif;
  font-size: 16px;
  cursor: pointer;
  transition: all .2s;
}

.exercise-card__check--done {
  background: var(--green-soft);
  border-color: var(--green);
  color: var(--green);
  font-family: var(--mono);
  font-size: 15px;
  font-weight: 700;
}
</style>