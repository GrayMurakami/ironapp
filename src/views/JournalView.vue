<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useJournalStore } from '@/stores/journal'

const router = useRouter();
const journal = useJournalStore();

const expandedLogId = ref(null);
const editingLogId = ref(null);
const saveTimer = new Map();

function toggleExpand(logId) {
  expandedLogId.value = expandedLogId.value === logId ? null : logId;
}

function toggleEdit(logId) {
  editingLogId.value = editingLogId.value === logId ? null : logId;
}

function scheduleLogSave(exercise) {
  clearTimeout(saveTimer.get(exercise.id));
  const timer = setTimeout(() => {
    journal.updateLogExercise(exercise)
  }, 600);
  saveTimer.set(exercise.id, timer);
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateString));
}

function formatDuration(log) {
  if (!log.finished_at) return '-'

  const ms = new Date(log.finished_at) - new Date(log.started_at);
  const minutes = Math.floor(ms / 60000);
  return `${minutes} min`
}

function calcVolume(log) {
  return log.workout_log_exercises.reduce((sum, exercise) => {
    return sum + exercise.sets_data
      .filter((s) => s.done)
      .reduce((sSum, s) => sSum + (s.weight || 0) * (s.reps || 0), 0)
  }, 0);
}

onMounted(() => {
  journal.fetchLogs();
});
</script>

<template>
  <div class="journal">
    <header class="journal__head">
      <h1 class="journal__title">
        Journal
      </h1>
    </header>

    <div
      v-if="!journal.loaded"
      class="journal__loading"
    >
      Loading・・・
    </div>

    <div
      v-else-if="journal.error"
      class="journal__error"
    >
      {{ journal.error }}
      <button @click="journal.fetchLogs()">
        Try again!
      </button>
    </div>

    <div 
      v-else-if="journal.logs.length === 0"
      class="journal__empty"
    >
      No workouts logged yet. Finish your first one to see it here.
    </div>

    <div
      v-else
      class="journal__list"
    >
      <div
        v-for="log in journal.logs"
        :key="log.id"
        class="log-card"
      >
        <button
          class="log-card__head"
          @click="toggleExpand(log.id)"
        >
          <div class="log-card__head-left">
            <span class="log-card__day">
              {{ log.day_name }}
            </span>
            <span class="log-card__date">
              {{  formatDate(log.finished_at ?? log.started_at) }}
            </span>
          </div>
          <div class="log-card__head-right">
            <button
              v-if="expandedLogId === log.id"
              class="log-card__edit"
              @click.stop="toggleEdit(log.id)"
            >
              {{ editingLogId === log.id ? 'Done' : 'Edit' }}
            </button>
            <span class="log-card__duration">
              {{ formatDuration(log) }}
            </span>
            <span 
              class="log-card__arrow"
              :class="{ open: expandedLogId === log.id }"
            >
              ▼
            </span>
          </div>
        </button>

        <div
          v-if="expandedLogId === log.id"
          class="log-card__body"
        >
          <div class="log-card__stats">
            <span>
              {{ log.workout_log_exercises.length }} exercises
            </span>
            <span>
              {{ calcVolume(log) }} kg volume
            </span>
          </div>

          <div
            v-for="exercise in log.workout_log_exercises"
            :key="exercise.id"
            class="log-exercise"
          >
            <span class="log-exercise__name">
              {{ exercise.name }}
            </span>

            <div 
              v-if="editingLogId !== log.id"
              class="log-exercise__sets"
            >
              <span
                v-for="(set, i) in exercise.sets_data"
                :key="i"
                class="log-set"
                :class="{ done: set.done }"
              >
                {{ set.weight ?? '-' }} × {{ set.reps ?? '-' }}
              </span>
            </div>

            <div 
              v-else
              class="log-exercise__edit"
            >
              <div
                v-for="(set, i) in exercise.sets_data"
                :key="i"
                class="log-set-edit"
              >
                <span class="log-set__label">
                  kg:
                </span>
                <input
                  v-model.number="set.weight"
                  type="number"
                  inputmode="decimal"
                  placeholder="kg"
                  @input="scheduleLogSave(exercise)"
                />
                <span class="log-set__label">
                  reps:
                </span>
                <input
                  v-model.number="set.reps"
                  type="number"
                  inputmode="numeric"
                  placeholder="reps"
                  @input="scheduleLogSave(exercise)"                
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <button
      class="journal__back"
      @click="router.push('/')"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M11 6L5 12L11 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M18 6L12 12L18 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
        Back
    </button>
  </div>
</template>

<style scoped>
.journal {
  max-width: 430px;
  margin: 0 auto;
  padding: 90px 24px 40px;
}

.journal__head {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
}

.journal__title {
  font-family: var(--display);
  font-size: 28px;
  font-weight: 400;
  margin: 0 auto;
  letter-spacing: .5px;
  text-transform: uppercase;
  color: var(--accent);
}

.journal__loading,
.journal__empty {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-muted);
  font-size: 14px;
}

.journal__error {
  text-align: center;
  padding: 40px 20px;
  color: var(--error-red);
}

.journal__error button {
  display: block;
  margin: 12px auto 0;
  padding: 10px 20px;
  border-radius: 10px;
  border: 1.5px solid var(--border);
  background: var(--bg-card);
  color: var(--text);
  cursor: pointer;
}

.journal__list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.log-card {
  border-radius: 16px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-card);
  overflow: hidden;
}

.log-card__head {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: none;
  border: none;
  cursor: pointer;
}

.log-card__head-left {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 3px;
}

.log-card__day {
  font-size: 15px;
  font-weight: 800;
  color: var(--text);
}

.log-card__date {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--text-muted);
}

.log-card__head-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.log-card__duration {
  font-family: var(--mono);
  font-size: 12px;
  font-weight: 700;
  color: var(--accent);
}

.log-card__arrow {
  font-size: 12px;
  color: var(--text-muted);
  transition: transform .2s;
}

.log-card__arrow.open {
  transform: rotate(180deg);
}

.log-card__body {
  padding: 0 16px 16px;
  border-top: 1px solid var(--border);
}

.log-card__stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 12px 0;
  font-size: 14px;
  color: var(--text-secondary);
}

.log-exercise {
  padding: 10px 0;
  border-top: 1px solid var(--border);
}

.log-exercise__name {
  display: block;
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 6px;
}

.log-exercise__sets {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
}

.log-set {
  padding: 4px 8px;
  border-radius: 8px;
  background: var(--bg);
  border: 1px solid var(--border);
  font-family: var(--mono);
  font-size: 11px;
  color: var(--text-muted);
}

.log-set.done {
  border-color: var(--green);
  color: var(--green);
}

.log-card__edit {
  padding: 5px 10px;
  border-radius: 8px;
  background: var(--bg);
  border: 1.5px solid var(--border);
  color: var(--text-secondary);
  font-family: var(--mono);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .5px;
  text-transform: uppercase;
  cursor: pointer;
}

.log-exercise__edit {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
}

.log-set-edit {
  display: flex;
  align-items: center;
  gap: 6px;
}

.log-set__label {
  font-family: var(--mono);
  font-size: 10px;
  font-weight: 700;
  margin-left: 10px;
  letter-spacing: .5px;
  text-transform: uppercase;
  color: var(--text-muted);
}

.log-set-edit input {
  width: 52px;
  padding: 6px 8px;
  border-radius: 8px;
  background: var(--bg);
  border: 1.5px solid var(--border);
  color: var(--text);
  font-family: var(--font);
  font-size: 13px;
  text-align: center;
  -moz-appearance: textfield;
  appearance: textfield;
}

.log-set-edit input::-webkit-outer-spin-button,
.log-set-edit input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.journal__back {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  margin-top: 20px;
  padding: 8px 14px;
  border-radius: 10px;
  background: var(--bg-card);
  color: var(--text-secondary);
  font-family: var(--font);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}
</style>