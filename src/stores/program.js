import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'

export const useProgramStore = defineStore('program', () => {
  const days = ref([]);
  const loaded = ref(false);
  const isEditMode = ref(false);
  const error = ref(null);

  const hasDays = computed(() => days.value.length > 0);
 
  function toggleEditMode() {
    isEditMode.value = !isEditMode.value;
  }

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
          sets_data: Array.from({ length: exercise.sets }, () => ({ weight: null, reps: null, done: false })),
        }))

        const { error: exercisesError } = await supabase
          .from('program_exercises')
          .insert(rows)

        if (exercisesError) throw exercisesError
      }
    }

    await fetchDays();
  }

  async function updateDayName(dayId, name) {
    const { error: renameDayError } = await supabase
      .from('program_days')
      .update({ name })
      .eq('id', dayId)

    if (renameDayError) throw renameDayError
  }

  async function addDay() {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error: insertDayError } = await supabase
      .from('program_days')
      .insert({
        name: `Day ${days.value.length + 1}`,
        order_index: days.value.length,
        user_id: user.id,
      })
      .select()
      .single()

    if (insertDayError) throw insertDayError

    days.value.push({ ...data, program_exercises: [] });
  }

  async function deleteDay(dayId) {
    const { error: deleteDayError } = await supabase
      .from('program_days')
      .delete()
      .eq('id', dayId)

    if (deleteDayError) throw deleteDayError

    const index = days.value.findIndex((d) => d.id === dayId);
    if (index !== -1) {
      days.value.splice(index, 1)
    }
  }

  async function addExercise(dayId, name) {
    const { data, error: insertError } = await supabase
      .from('program_exercises')
      .insert({
        day_id: dayId,
        name,
        sets: 3,
        rest_seconds: 90,
        sets_data: Array.from({ length: 3 }, () => ({ weight: null, reps: null, done: false })),
        order_index: 999,
      })
      .select()
      .single()

    if (insertError) throw insertError

    const day = days.value.find((d) => d.id === dayId);
    if (day) {
      day.program_exercises.push(data)
    }
  }

  async function updateExercise(exercise) {
    const { error: updateError } = await supabase
      .from('program_exercises')
      .update({
        name: exercise.name,
        sets: exercise.sets,
        rest_seconds: exercise.rest_seconds,
        sets_data: exercise.sets_data,
      })
      .eq('id', exercise.id)

    if (updateError) throw updateError
  }

  async function deleteExercise(exerciseId) {
    const { error: deleteExerciseError } = await supabase
      .from('program_exercises')
      .delete()
      .eq('id', exerciseId)

    if (deleteExerciseError) throw deleteExerciseError

    for (const day of days.value) {
      const index = day.program_exercises.findIndex((e) => e.id === exerciseId)
      if (index !== -1) {
        day.program_exercises.splice(index, 1)
        break;
      }
    }
  }

  async function linkExercises(exerciseA, exerciseB) {
    const groupId = crypto.randomUUID();

    const { error: linkError } = await supabase
      .from('program_exercises')
      .update({ superset_group: groupId })
      .in('id', [exerciseA.id, exerciseB.id])

    if (linkError) throw linkError

    const { error: resetRestFieldError } = await supabase
      .from('program_exercises')
      .update({ rest_seconds: 0 })
      .eq('id', exerciseA.id)

    if (resetRestFieldError) throw resetRestFieldError

    exerciseA.superset_group = groupId;
    exerciseA.rest_seconds = 0;
    exerciseB.superset_group = groupId;
  }

  async function unlinkExercise(exercise) {
    const { error: unlinkError } = await supabase
      .from('program_exercises')
      .update({ superset_group: null })
      .eq('superset_group', exercise.superset_group)

    if (unlinkError) throw unlinkError

    const day = days.value.find((d) => d.program_exercises.some((e) => e.id === exercise.id));
    if (day) {
      day.program_exercises.forEach((e) => {
        if (e.superset_group === exercise.superset_group) e.superset_group = null
      });
    }
  }

  async function reorderExercises(dayId, exercises) {
    const day = days.value.find((d) => d.id === dayId);
    if (day) {
      day.program_exercises = exercises
    }

    const updates = exercises.map((exercise, index) => supabase
      .from('program_exercises')
      .update({ order_index: index })
      .eq('id', exercise.id)
    )

    await Promise.all(updates)
  }

  async function saveWorkoutLog({ dayId, dayName, startedAt, exercises }) {
    const { data: { user } } = await supabase.auth.getUser();

    const { data: logRow, error: logError } = await supabase
      .from('workout_logs')
      .insert({
        user_id: user.id,
        day_id: dayId,
        day_name: dayName,
        started_at: startedAt,
        finished_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (logError) throw logError

    const logExerciseRows = exercises.map((exercise, index) => ({
      log_id: logRow.id,
      name: exercise.name,
      sets_data: exercise.sets_data,
      order_index: index,
      superset_group: exercise.superset_group, 
    }));

    const { error: logExercisesError } = await supabase
      .from('workout_log_exercises')
      .insert(logExerciseRows)

    if (logExercisesError) throw logExercisesError

    for (const exercise of exercises) {
      const resetSetsData = exercise.sets_data.map((set) => ({ ...set, done: false }));

      const { error: resetError } = await supabase
        .from('program_exercises')
        .update({ sets_data: resetSetsData })
        .eq('id', exercise.id)

      if (resetError) throw resetError

      exercise.sets_data.forEach((set) => { set.done = false });
    }
  }

  async function fetchDays() {
    error.value = null;

    try {
      const { data, error: fetchError } = await supabase
        .from('program_days')
        .select('*, program_exercises(*)')
        .order('order_index', { ascending: true })
        .order('order_index', { ascending: true, foreignTable: 'program_exercises' })

      if (fetchError) throw fetchError
      days.value = data;
      loaded.value = true;
    } catch(e) {
      error.value = e.message;
      loaded.value = true;
    }
  }

  async function resetDemoProgram() {
    const { data: { user } } = await supabase.auth.getUser();

    const { error: resetDemoError } = await supabase
      .from('program_days')
      .delete()
      .eq('user_id', user.id)

    if (resetDemoError) throw resetDemoError

    days.value = [];
  }

  return {
    days,
    loaded,
    isEditMode,
    error,
    hasDays,
    toggleEditMode,
    saveInitialProgram,
    updateDayName,
    addDay,
    deleteDay,
    addExercise,
    updateExercise,
    deleteExercise,
    linkExercises,
    unlinkExercise,
    reorderExercises,
    saveWorkoutLog,
    resetDemoProgram,
    fetchDays
  }
});
