import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'

export const useProgramStore = defineStore('program', () => {
  const days = ref([]);
  const loaded = ref(false);
  const error = ref(null);

  const hasDays = computed(() => days.value.length > 0);
 
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
    fetchDays
  }
});
