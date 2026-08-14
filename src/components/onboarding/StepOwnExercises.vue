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

const canFinish = computed(() => {
  props.days.every((day) => day.exercises.length > 0);
});



</script>

<template>
  <div>Step 3</div>
</template>

<style scoped>

</style>