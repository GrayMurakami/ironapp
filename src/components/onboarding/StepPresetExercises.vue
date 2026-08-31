<script setup>
import { ref } from 'vue'
import { exercisePresets } from '@/data/exercisePresets.js'
import '@/styles/shared.css'

const props = defineProps({
  days: { type: Array, required: true },
});

const emit = defineEmits(['back', 'next']);

const activeDayIndex = ref(0);
const openGroup = ref(exercisePresets[0].group);

function toggleGroup(group) {
openGroup.value = openGroup.value === group
  ? null
  : group
}

function isAdded(exerciseName) {
  const day = props.days[activeDayIndex.value];
  return day.exercises.some((e) => e.name === exerciseName);
}

function toggleExercise(exercise) {
  const day = props.days[activeDayIndex.value];
  const index = day.exercises.findIndex((e) => e.name === exercise.name);
  if (index === -1) {
      day.exercises.push({ ...exercise, sets: 3, restSeconds: 90 });
  } else {
      day.exercises.splice(index, 1);
  }
}
</script>

<template>
  <div class="step">
    <div class="step__progress">
      <div class="step__label">
        setup 2 / 3
      </div>
      <div class="step__bar">
        <div class="seg seg--on" />
        <div class="seg seg--on" />
        <div class="seg" />
      </div>
    </div>

    <h1 class="step__title">
      PICK YOUR<br />EXERCISES
    </h1>
    <p class="step__sub">
      Choose a muscle group, tap exercises to add them to the selected day. Add as many groups as you like.
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

    <div class="day-header">   
      <span class="day-header__count">
        <b class="day-header__num">
          {{ days[activeDayIndex].exercises.length }}
        </b>
          exercises added
      </span>
    </div>

    <div class="groups">
      <div
        v-for="group in exercisePresets"
        :key="group.group"
        class="group"      
      >
        <button
          class="group__head"
          @click="toggleGroup(group.group)"
        >
          <span>
            {{ group.group }}
          </span>
          <span
            class="group__arrow"
            :class="{ open: openGroup === group.group }"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.41 7.59L4 9l8 8 8-8-1.41-1.41L12 14.17" fill="currentColor" />
            </svg>
          </span>
        </button>

        <div
          v-if="openGroup === group.group"
          class="group__exercises"        
        >
          <button
            v-for="exercise in group.exercises"
            :key="exercise.name"
            class="exercise-chip"
            :class="{ active: isAdded(exercise.name) }"
            @click="toggleExercise(exercise)"
          >
            {{ isAdded(exercise.name) ? '✓' : '+' }} {{ exercise.name }}
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
        @click="emit('next')"
      >
        Continue
      </button>
    </div>
  </div>
</template>

<style scoped>
.day-header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 2px;
  margin-bottom: 12px;
}

.day-header__count {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-radius: 8px;
  background: var(--accent-soft);
  font-family: var(--mono);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .6px;
  color: var(--accent);
}

.day-header__num { 
  font-size: 15px 
}

.groups { 
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px
}

.group {
  border-radius: 14px;
  overflow: hidden;
  background: var(--bg-card);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-card);
}

.group__head {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 11px;
  padding: 14px 15px;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  font-size: 14.5px;
  font-weight: 800;
  color: var(--text);
}

.group__head span:first-child { 
  flex: 1 
}

.group__arrow { 
  font-size: 11px;
  color: var(--text-muted);
  transition: transform .2s 
}

.group__arrow.open { 
  transform: rotate(180deg) 
}

.group__exercises {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 0 15px 14px;
}

.exercise-chip {
  padding: 8px 12px;
  border-radius: 9px;
  background: var(--bg);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  font-family: var(--font);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.exercise-chip.active {
  background: var(--accent-soft);
  border-color: var(--accent);
  color: var(--accent);
}
</style>
