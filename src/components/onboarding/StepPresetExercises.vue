<script setup>
import { ref } from 'vue'
import { exercisePresets } from '@/data/exercisePresets.js'

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
      <span class="day-header__name">
        {{ days[activeDayIndex].name }}
      </span>
      <span class="day-header__count">
        {{ days[activeDayIndex].exercises.length }} added
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
            ⌄
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
        ← Back
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

</style>