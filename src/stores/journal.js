import { ref } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'

export const useJournalStore = defineStore('journal', () => {
  const logs = ref([]);
  const loaded = ref(false);
  const error = ref(null);

  async function updateLogExercise(logExercise) {
    const { error: updateLogError } = await supabase
      .from('workout_log_exercises')
      .update({ sets_data: logExercise.sets_data })
      .eq('id', logExercise.id)

    if (updateLogError) throw updateLogError
  }

  async function fetchLogs() {
    error.value = null;

    try {
      const { data, error: fetchError } = await supabase
        .from('workout_logs')
        .select('*, workout_log_exercises(*)')
        .order('finished_at', { ascending: false })
        .order('order_index', { ascending: true, foreignTable: 'workout_log_exercises' })

      if (fetchError) throw fetchError
      logs.value = data;
      loaded.value = true;
    } catch(e) {
      error.value = e.message;
      loaded.value = true;
    }
  }

  return {
    logs,
    loaded,
    error,
    updateLogExercise,
    fetchLogs
  }
});
