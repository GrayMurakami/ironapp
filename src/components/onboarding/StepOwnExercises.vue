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
  <div>Step 3</div>
</template>

<style scoped>

</style>