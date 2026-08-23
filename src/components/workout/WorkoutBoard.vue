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

        <div class="exercise-card__controls">
          <div class="control-field">
            <span class="control-field__label">
              SETS
            </span>
            <input
              :value="exercise.sets"
              type="number"
              inputmode="numeric"
              @input="updateSetsCount(exercise, Number($event.target.value))"
            />
          </div>

          <div class="control-field">
            <span class="control-field__label">
              REST
            </span>
            <input
              v-model.number="exercise.rest_seconds"
              type="number"
              inputmode="numeric"
            />
            <span class="control-field__unit">
              sec.
            </span>
          </div>
        </div>

        <div class="sets">
          <div
            v-for="(set, setIndex) in exercise.sets_data"
            :key="setIndex"
            class="set-row"
          >
            <div class="set-field">
              <span class="set-field__label">
                KG
              </span>
              <input
                v-model.number="set.weight"
                type="number"
                inputmode="decimal"
                placeholder="-"  
              />
            </div>

            <div class="set-field">
              <span class="set-field__label">
                REPS
              </span>
              <input
                v-model.number="set.reps"
                type="number"
                inputmode="numeric"
                placeholder="-"  
              />
            </div>

            <button
              class="set-check"
              :class="{ done: set.done }"
              @click="toggleSetDone(exercise, setIndex)"
            >
              {{ set.done ? '✓' : setIndex + 1 }}
            </button>
          </div>
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

.exercise-card__controls {
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
}

.control-field {
  flex: none;
  display: flex;
  align-items: center;
  gap: 10px;
}

.control-field__label {
  font-family: var(--mono);
  font-size: 15px;
  font-weight: 700;
  letter-spacing: .5px;
  color: var(--accent);
  flex: none;
}

.control-field input {
  width: 56px;
  height: 40px;
  padding: 0 10px;
  border-radius: 10px;
  background: var(--bg);
  border: 1.5px solid var(--border);
  outline: none;
  color: var(--text);
  font-family: 'Anton', sans-serif;
  font-size: 15px;
  font-weight: 700;
  text-align: right;
  -moz-appearance: textfield;
}

.control-field__unit {
  font-size: 15px;
  color: var(--text-muted);
  flex: none;
  margin-left: -4px;
}

.sets {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.set-row {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 15px;
  align-items: center;
}

.set-field {
  height: 40px;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 15px;
}

.set-field__label {
  font-family: var(--mono);
  font-size: 15px;
  font-weight: 700;
  letter-spacing: .5px;
  flex: none;
}

.set-field:nth-child(1) .set-field__label {
  color: var(--accent);
}

.set-field:nth-child(2) .set-field__label {
  color: var(--green);
}

.set-field input {
  width: 64px;
  flex: none;
  min-width: 0;
  height: 100%;
  padding: 0 10px;
  border-radius: 10px;
  background: var(--bg);
  border: 1.5px solid var(--border);
  outline: none;
  color: var(--text);
  font-family: 'Anton', sans-serif;
  font-size: 15px;
  font-weight: 700;
  text-align: right;
  -moz-appearance: textfield;
}

.set-field input:focus {
  border-color: var(--accent);
}

.set-check {
  flex: none;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--bg);
  border: 1.5px solid var(--border);
  color: var(--text-secondary);
  font-family: var(--mono);
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all .2s;
}

.set-check.done {
  background: var(--green, var(--accent));
  border-color: var(--green, var(--accent));
  color: var(--on-accent);
}

.control-field input::-webkit-outer-spin-button,
.control-field input::-webkit-inner-spin-button,
.set-field input::-webkit-outer-spin-button,
.set-field input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>