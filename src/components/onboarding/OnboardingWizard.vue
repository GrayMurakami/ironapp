<script setup>
import { ref } from 'vue'
import { useProgramStore } from '@/stores/program'
import StepWorkoutsCount from './StepWorkoutsCount.vue'
import StepPresetExercises from './StepPresetExercises.vue'
import StepOwnExercises from './StepOwnExercises.vue'

const program = useProgramStore();

const currentStep = ref(1);
const workoutsCount = ref(null);
const days = ref([]);
const isSaving = ref(false);
const saveError = ref(null);

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

async function finishOnboarding() {
  saveError.value = null;
  isSaving.value = true;

  try {
    await program.saveInitialProgram(days.value);
  } catch (e) {
    saveError.value = e.message;
  } finally {
    isSaving.value = false;
  }
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
      :is-saving="isSaving"
      @back="goToStep(2)"
      @finish="finishOnboarding"
    />

    <p
      v-if="saveError"
      class="wizard__error"
    >
      {{ saveError }}
    </p>
  </div>
</template>

<style scoped>
.wizard {
  min-height: 100dvh;
}

.wizard__error {
  padding: 12px 24px;
  color: var(--error-red);
  font-size: 13px;
}
</style>
