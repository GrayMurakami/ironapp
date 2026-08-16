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
        ← Back
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

</style>