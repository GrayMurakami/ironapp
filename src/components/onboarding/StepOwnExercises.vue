<script setup>
import { ref, computed } from 'vue'
import '@/styles/step.css'

const props = defineProps({
  days: { type: Array, required: true },
});

const emit = defineEmits(['back', 'finish']);

const activeDayIndex = ref(0);
const isAdding = ref(false);
const newExerciseName = ref('');
const newExerciseTip = ref('');
const newExerciseTag = ref('');

const canFinish = computed(() => 
  props.days.every((day) => day.exercises.length > 0)
);

function startAdding() {
  isAdding.value = true;
}

function cancelAdding() {
  isAdding.value = false;
  newExerciseName.value = '';
  newExerciseTip.value = '';
  newExerciseTag.value = '';
}

function confirmAdd() {
  if (!newExerciseName.value.trim()) return

  const day = props.days[activeDayIndex.value];
  day.exercises.push({
    name: newExerciseName.value.trim(),
    muscleTag: newExerciseTag.value.trim() || null,
    tip: newExerciseTip.value.trim() || null,
    sets: 3,
    restSeconds: 90,
  });

  cancelAdding();
}

function removeExercise(index) {
  props.days[activeDayIndex.value].exercises.splice(index, 1);
}
</script>

<template>
  <div class="step">
    <div class="step__progress">
      <div class="step__label">
        setup 3 / 3
      </div>
      <div class="step__bar">
        <div class="seg seg--on" />
        <div class="seg seg--on" />
        <div class="seg seg--on" />
      </div>
    </div>

    <h1 class="step__title">
      BUILD<br />YOUR DAYS
    </h1>
    <p class="step__sub">
      Name each day and add your own exercises. Weights, sets and rest you set on the workout screen.
    </p>

    <div class="day-tabs">
      <button
        v-for="(day, index) in days"
        :key="index"
        class="day-tab"
        :class="{ active: activeDayIndex === index }"
        @click="activeDayIndex = index"
      >
        {{ day.name }}
      </button>
    </div>

    <div class="day-card">
      <input
        v-model="days[activeDayIndex].name"
        class="day-card__name"
        type="text"
      />

      <p 
        v-if="days[activeDayIndex].exercises.length === 0"
        class="day-card__empty"
      >
        Nothing here yet — add your first exercise.
      </p>

      <div 
        v-else 
        class="exercise-list"
      >
        <div
          v-for="(exercise, index) in days[activeDayIndex].exercises"
          :key="index"
          class="exercise-row"
        >
          <span class="exercise-row__name">
            {{ exercise.name }}
          </span>
          <button 
            class="exercise-row__remove" 
            @click="removeExercise(index)"
          >
            ✕
          </button>
        </div>
      </div>

      <div 
        v-if="!isAdding"
        class="add-btn"
        @click="startAdding"
      >
        + add my own
      </div>

      <div 
        v-else 
        class="add-form"
      >
        <input 
          v-model="newExerciseName" 
          type="text" 
          placeholder="Exercise name" 
        />
        <input 
          v-model="newExerciseTag" 
          type="text" 
          placeholder="Muscle group (optional)" 
        />
        <input 
          v-model="newExerciseTip" 
          type="text" 
          placeholder="Tip (optional)" 
        />
        <div class="add-form__actions">
          <button 
            class="add-form__cancel"
            @click="cancelAdding"
          >
            Cancel
          </button>
          <button 
            class="add-form__confirm"
            @click="confirmAdd"
          >
            Add
          </button>
        </div>
      </div>
    </div>

    <div class="step__footer">
      <button 
        class="back"
        @click="emit('back')"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M11 6L5 12L11 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M18 6L12 12L18 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        Back
      </button>
      <button 
        class="continue" 
        :disabled="!canFinish"
        @click="emit('finish')"
      >
        Start training
      </button>
    </div>
  </div>
</template>

<style scoped>
.day-card {
  border-radius: 16px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-card);
  padding: 16px;
  margin-bottom: 20px;
}

.day-card__name {
  width: 100%;
  padding: 12px 14px;
  border-radius: 10px;
  background: var(--bg);
  border: 1.5px solid var(--border);
  color: var(--text);
  font-family: var(--font);
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 14px;
  outline: none;
}

.day-card__empty {
  font-size: 13px;
  color: var(--text-muted);
  text-align: center;
  padding: 14px 0;
}

.exercise-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 14px;
}

.exercise-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: 10px;
  background: var(--bg);
  border: 1px solid var(--border);
}

.exercise-row__name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
}

.exercise-row__remove {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 13px;
  cursor: pointer;
  padding: 4px 8px;
}

.exercise-row__remove:hover {
  color: var(--error-red);
}

.add-btn {
  padding: 13px;
  border-radius: 10px;
  border: 1.5px dashed var(--border);
  color: var(--text-muted);
  text-align: center;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.add-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.add-form input {
  width: 100%;
  padding: 12px 14px;
  border-radius: 10px;
  background: var(--bg);
  border: 1.5px solid var(--border);
  color: var(--text);
  font-family: var(--font);
  font-size: 14px;
}

.add-form__actions {
  display: flex;
  gap: 8px;
  margin-top: 4px;
}

.add-form__cancel {
  flex: 1;
  padding: 11px;
  border-radius: 10px;
  background: none;
  border: 1.5px solid var(--border);
  color: var(--text-secondary);
  font-family: var(--font);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.add-form__confirm {
  flex: 1;
  padding: 11px;
  border-radius: 10px;
  border: none;
  background: var(--accent);
  color: var(--on-accent);
  font-family: var(--font);
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
}
</style>