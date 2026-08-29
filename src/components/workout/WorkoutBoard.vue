<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useProgramStore } from '@/stores/program'
import { getRandomPhrase } from '@/data/motivationalPhrases'
import FinishSummary from './FinishSummary.vue'
import ExerciseCard from './ExerciseCard.vue'
import DayTabs from './DayTabs.vue'
import RestTimer from './RestTimer.vue'
import draggable from 'vuedraggable' 
import iconJournal from '@/assets/icons/journal.png'
import iconEdit from '@/assets/icons/edit.png'
import '@/styles/shared.css'

const auth = useAuthStore();
const router = useRouter();
const program = useProgramStore();
const isEditMode = ref(false);
const draggableBlocks = ref([]);
const newExerciseName = ref('');
const activeDayIndex = ref(0);

const restSeconds = ref(null);
const restExerciseName = ref('');
const restExerciseIndex = ref(0);

const workoutStartedAt = ref(null);
const showSummary = ref(false);
const summaryData = ref(null);
const isFinishing = ref(false);

const { appNameDemo } = storeToRefs(auth);
const { days } = storeToRefs(program);

const activeDay = computed(() => days.value[activeDayIndex.value]);

const totalSets = computed(() => {
  if (!activeDay.value) return 0
  return activeDay.value.program_exercises.reduce(
    (sum, exercise) => sum + exercise.sets_data.length,
    0
  )
});

const doneSets = computed(() => {
  if (!activeDay.value) return 0
  return activeDay.value.program_exercises.reduce(
    (sum, exercise) => sum + exercise.sets_data.filter((s) => s.done).length,
    0
  )
});

const volume = computed(() => {
  if (!activeDay.value) return 0
  return activeDay.value.program_exercises.reduce((sum, exercise) => {
    const exerciseVolume = exercise.sets_data
      .filter((s) => s.done)
      .reduce((sSum, s) => sSum + (s.weight || 0) * (s.reps || 0), 0)
    return sum + exerciseVolume;
  }, 0)
});

const progressPercent = computed(() => {
  if (totalSets.value === 0) return 0
  return Math.round((doneSets.value / totalSets.value) * 100)
});

function markWorkoutStarted() {
  if (!workoutStartedAt.value) {
    workoutStartedAt.value = new Date();
  }
}

function startRest({ seconds, name, index }) {
  restSeconds.value = seconds;
  restExerciseName.value = name;
  restExerciseIndex.value = index;
}

function closeRest() {
  restSeconds.value = null;
}

function toggleEditMode() {
  isEditMode.value = !isEditMode.value;
}

function buildBlocks() {
  if (!activeDay.value) return []

  const exercises = activeDay.value.program_exercises;
  const blocks = [];
  const seen = new Set();

  for (const exercise of exercises) {
    if (seen.has(exercise.id)) continue

    if (exercise.superset_group) {
      const partner = exercises.find(
        (e) => e.id !== exercise.id && e.superset_group === exercise.superset_group
      )
      if (partner) {
        blocks.push({ type: 'superset', exercises: [exercise, partner] })
        seen.add(exercise.id)
        seen.add(partner.id)
        continue
      }
    }

    blocks.push({ type: 'single', exercises: [exercise] })
    seen.add(exercise.id)
  }

  return blocks
}

watch(
  () => [activeDay.value, activeDay.value?.program_exercises.length, activeDay.value?.program_exercises.map((e) => e.superset_group).join()],
  () => {
    draggableBlocks.value = buildBlocks()
  },
  { immediate: true }
);

async function addExercise() {
  if (!newExerciseName.value.trim()) return
  await program.addExercise(activeDay.value.id, newExerciseName.value.trim());
  newExerciseName.value = '';
}

async function removeExercise(exerciseId) {
  await program.deleteExercise(exerciseId);
}

function linkExercises(exerciseA, exerciseB) {
  program.linkExercises(exerciseA, exerciseB);
}

function unlinkExercise(exercise) {
  program.unlinkExercise(exercise);
}

function getNextExercise(block) {
  const blocks = draggableBlocks.value;
  const currentIndex = blocks.indexOf(block);
  const next = blocks[currentIndex + 1];
  return next && next.type === 'single' ? next.exercises[0] : null
}

function onExercisesReorder() {
  const flatExercises = draggableBlocks.value.flatMap((block) => block.exercises);
  program.reorderExercises(activeDay.value.id, flatExercises) 
}

async function finishWorkout() {
  if (!activeDay.value || isFinishing.value) return

  isFinishing.value = true;
  const startedAt = workoutStartedAt.value ?? new Date();
  const finishedAt = new Date();

  const exercises = activeDay.value.program_exercises;
  const touchedExercises = exercises.filter((e) => e.sets_data.some((s) => s.done)).length;

  const snapshot = {
    phrase: getRandomPhrase(),
    dayName: activeDay.value.name,
    durationMs: finishedAt - startedAt,
    exerciseCount: exercises.length,
    exercisesDone: touchedExercises,
    setsTotal: totalSets.value,
    setsDone: doneSets.value,
    volume: volume.value,
  }

  try {
    await program.saveWorkoutLog({
      dayId: activeDay.value.id,
      dayName: activeDay.value.name,
      startedAt: startedAt.toISOString(),
      exercises,
    });

    summaryData.value = snapshot;
    showSummary.value = true;
    workoutStartedAt.value = null;
  } finally {
    isFinishing.value = false;
  }
}

function closeSummary() {
  showSummary.value = false;
  summaryData.value = null;
}
</script>

<template>
  <div class="board">
    <header class="board__head">
      <h1 class="board__brand">
        {{ appNameDemo }}
      </h1>

      <div class="board__actions">
        <button
          class="icon-btn"
          aria-label="Journal"
          @click="router.push('/journal')"
        >
          <img :src="iconJournal" alt="" />
        </button>
        <button
          class="icon-btn"
          :class="{ active: isEditMode }"
          aria-label="Edit"
          @click="toggleEditMode"
        >
          <img :src="iconEdit" alt="" />
        </button>
      </div>
    </header>

    <DayTabs 
      :days="days"
      v-model:active-day-index="activeDayIndex"
      :active-day="activeDay"
      :is-edit-mode="isEditMode"
    />

    <div
      v-if="activeDay"
      class="day-progress"
    >
      <div
        class="day-progress__fill"
        :style="{ width: progressPercent + '%' }"
      />
    </div>

    <div
      v-if="activeDay"
      class="stats-row"
    >
      <div class="progress-info">
        <span class="progress-info__label">
          {{ doneSets }} of {{ totalSets }} sets
        </span>
        <span class="progress-info__percent">
          {{ progressPercent }} %
        </span>
      </div>

      <div class="stat-cards">
        <div class="stat-card">
          <span class="stat-card__value">
            {{ activeDay.program_exercises.length }}
          </span>
          <span class="stat-card__label">
            exercises
          </span>
        </div>
        <div class="stat-card">
          <span class="stat-card__value">
            {{ volume }}
          </span>
          <span class="stat-card__label">
            kg volume
          </span>
        </div>
        <div class="stat-card">
          <span class="stat-card__value">
            {{ doneSets }}
          </span>
          <span class="stat-card__label">
            done
          </span>
        </div>
      </div>
    </div>

    <draggable
      v-if="activeDay"
      v-model="draggableBlocks"
      item-key="0"
      tag="div"
      class="exercises"
      :handle="isEditMode ? '.exercise-card__drag' : undefined"
      :delay="isEditMode ? 0 : 500"
      :delay-on-touch-only="true"
      :touch-start-threshold="10"
      :force-fallback="true"
      :animation="200"
      @end="onExercisesReorder"
    >
      <template #item="{ element: block }">
        <div
          v-if="block.type === 'superset'"
          class="superset"
        >
          <div class="superset__tag">
            <span
              v-if="isEditMode"
              class="exercise-card__drag"
            >
              ⠿
            </span>
              Superset · rest between sets optional
          </div>
          <ExerciseCard
            v-for="(exercise, i) in block.exercises"
            :key="exercise.id"
            :exercise="exercise"
            :index="activeDay.program_exercises.indexOf(exercise)"
            :is-edit-mode="isEditMode"
            :is-superset-first="i === 0"
            @remove="removeExercise(exercise.id)"
            @unlink="unlinkExercise(exercise)"
            @start-rest="startRest"
            @activity="markWorkoutStarted"
          />
        </div>

        <ExerciseCard
          v-else
          :exercise="block.exercises[0]"
          :index="activeDay.program_exercises.indexOf(block.exercises[0])"
          :is-edit-mode="isEditMode"
          :next-exercise="getNextExercise(block)"
          @remove="removeExercise(block.exercises[0].id)"
          @link="linkExercises(block.exercises[0], $event)"
          @start-rest="startRest"
          @activity="markWorkoutStarted"
        />
      </template>
    </draggable>

    <div
      v-if="activeDay && isEditMode"
      class="add-exercise"
    >
      <input
        v-model="newExerciseName"
        type="text"
        placeholder="Exercise name"
        @keyup.enter="addExercise"
      />
      <button @click="addExercise">
        + add exercise
      </button>
    </div>

    <button
      v-if="activeDay"
      class="finish-btn"
      :disabled="isFinishing"
      @click="finishWorkout"
    >
      {{ isFinishing ? 'Saving・・・' : 'Finish workout' }}
    </button>
  </div>

  <RestTimer
    v-if="restSeconds !== null"
    :seconds="restSeconds"
    :exercise-name="restExerciseName"
    :exercise-index="restExerciseIndex"
    @close="closeRest"
  />

  <FinishSummary
    v-if="showSummary"
    :data="summaryData"
    @close="closeSummary"
  />
</template>

<style scoped>
.board {
  max-width: 430px;
  margin: 0 auto;
  padding: 35px 24px 40px;
}

.board__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40px;
}

.board__brand {
  font-family: var(--display);
  font-size: 32px;
  font-weight: 400;
  letter-spacing: .5px;
  text-transform: uppercase;
  color: var(--accent);
  text-shadow: 0 0 30px var(--accent-glow);
}

.board__actions {
  display: flex;
  gap: 8px;
}

.icon-btn {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: var(--bg-card);
  border: 1.5px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
}

.icon-btn img {
  width: 18px;
  height: 18px;
  object-fit: contain;
}

.icon-btn.active {
  background: var(--accent-soft);
  border-color: var(--accent);
}

.day-progress {
  height: 4px;
  border-radius: 2px;
  background: var(--border);
  overflow: hidden;
  margin-top: 36px;
  margin-bottom: 16px;
}

.day-progress__fill {
  height: 100%;
  background: var(--green);
  transition: width .3s ease;
}

.stats-row {
  margin: 20px 0 18px;
}

.progress-info {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 10px;
}

.progress-info__label {
  font-size: 13px;
  font-family: var(--mono);
  letter-spacing: 0.5px;
  color: var(--text-secondary);
}

.progress-info__percent {
  font-family: var(--display);
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 1px;
  color: var(--green);
}

.stat-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-top: 15px;
  gap: 8px;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 8px;
  border-radius: 12px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-card);
}

.stat-card__value {
  font-family: var(--display);
  font-size: 25px;
  font-weight: 700;
  letter-spacing: 1px;
  color: var(--text);
}

.stat-card__label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .5px;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-top: 7px;
}

.exercises {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.superset {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px;
  border-radius: 18px;
  border: 1.5px dashed var(--accent);
  background: var(--accent-soft);
}

.superset__tag {
  font-family: var(--mono);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--accent);
  padding: 0 4px;
}

.add-exercise {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
}

.add-exercise input {
  padding: 12px 14px;
  border-radius: 12px;
  background: var(--bg-card);
  border: 1.5px solid var(--border);
  color: var(--text);
  font-family: var(--font);
  font-size: 14px;
}

.add-exercise button {
  padding: 13px;
  border-radius: 12px;
  border: 1.5px dashed var(--border);
  background: none;
  color: var(--text-muted);
  font-family: var(--font);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.finish-btn {
  width: 100%;
  margin-top: 40px;
  padding: 16px;
  border: none;
  border-radius: 14px;
  background: var(--accent);
  color: var(--on-accent);
  font-family: var(--font);
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 8px 24px var(--accent-glow);
}

.finish-btn:disabled {
  opacity: .6;
  cursor: default;
}
</style>
