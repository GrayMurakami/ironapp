import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'

export const useProgramStore = defineStore('program', () => {
  const days = ref([]);
  const loaded = ref(false);
  const error = ref(null);

  const hasDays = computed(() => days.value.length > 0);
 
  async function saveInitialProgram(newDays) {
    const { data: { user } } = await supabase.auth.getUser();

    for (const day of newDays) {
      const { data: dayRow, error: dayError } = await supabase
        .from('program_days')
        .insert({ name: day.name, order_index: newDays.indexOf(day), user_id: user.id })
        .select()
        .single()

      if (dayError) throw dayError

      if (day.exercises.length > 0) {
        const rows = day.exercises.map((exercise, index) => ({
          day_id: dayRow.id,
          name: exercise.name,
          sets: exercise.sets,
          rest_seconds: exercise.restSeconds,
          order_index: index,
          sets_data: Array.from({ length: exercise.sets }, () => ({weight: null, reps: null, done: false})),
        }))

        const { error: exercisesError } = await supabase
          .from('program_exercises')
          .insert(rows)

        if (exercisesError) throw exercisesError
      }
    }

    await fetchDays();
  }

  async function updateExercise(exercise) {
    const { error: updateError } = await supabase
      .from('program_exercises')
      .update({
        sets: exercise.sets,
        rest_seconds: exercise.rest_seconds,
        sets_data: exercise.sets_data,
      })
      .eq('id', exercise.id)

    if (updateError) throw updateError
  }

  async function fetchDays() {
    error.value = null;

    try {
      const { data, error: fetchError } = await supabase
        .from('program_days')
        .select('*, program_exercises(*)')
        .order('order_index', { ascending: true })

      if (fetchError) throw fetchError
      days.value = data;
      loaded.value = true;
    } catch(e) {
      error.value = e.message;
      loaded.value = true;
    }
  }

  return {
    days,
    loaded,
    error,
    hasDays,
    saveInitialProgram,
    updateExercise,
    fetchDays
  }
});
