<script setup>
import { ref } from 'vue'
import StepWorkoutsCount from './StepWorkoutsCount.vue'
import StepPresetExercises from './StepPresetExercises.vue'
import StepOwnExercises from './StepOwnExercises.vue'

const currentStep = ref(1);
const workoutsCount = ref(null);
const days = ref([]);

function goToStep(step) {
  currentStep.value = step;
}

function selectWorkoutsCount(count) {
  workoutsCount.value = count;
  days.value = Array.from({ length: count }, (_, i) => ({
    name: `Day ${i + 1}`,
    exercises: [],
  }));
  goToStep(2);
}
</script>

<template>
  <div class="wizard">
    <StepWorkoutsCount 
      v-if="currentStep === 1"
      @select="selectWorkoutsCount"
    />

    <StepPresetExercises
      v-else-if="currentStep === 2"
      :days="days"
      @back="goToStep(1)"
      @next="goToStep(3)"
    />

    <StepOwnExercises 
      v-else-if="currentStep === 3"
      :days="days"
      @back="goToStep(2)"
    />
  </div>
</template>

<style scoped>
.wizard {
  min-height: 100dvh;
}
</style>