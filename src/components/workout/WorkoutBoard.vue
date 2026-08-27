<script setup>
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useProgramStore } from '@/stores/program'
import draggable from 'vuedraggable' 
import ExerciseCard from './ExerciseCard.vue'
import iconJournal from '@/assets/icons/journal.png'
import iconEdit from '@/assets/icons/edit.png'
import iconLogout from '@/assets/icons/logout.png'
import '@/styles/shared.css'

const auth = useAuthStore();
const program = useProgramStore();
const isEditMode = ref(false);
const draggableBlocks = ref([]);
const newExerciseName = ref('');
const activeDayIndex = ref(0);

let renameTimer = null;

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

function renameDay(day) {
  clearTimeout(renameTimer);
  renameTimer = setTimeout(() => {
    program.updateDayName(day.id, day.name)
  }, 600);
}

async function addNewDay() {
  await program.addDay();
  activeDayIndex.value = days.value.length - 1
}

async function removeCurrentDay() {
  const dayId = activeDay.value.id;
  await program.deleteDay(dayId);
  if (activeDayIndex.value >= days.value.length) {
    activeDayIndex.value = Math.max(0, days.value.length - 1)
  }
}

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
        <button
          class="icon-btn"
          aria-label="Log out"
          @click="auth.signOut()"
        >
          <img :src="iconLogout" alt="" />
        </button>
      </div>
    </header>

    <div class="day-tabs">
      <button
        v-for="(day, index) in days"
        :key="day.id"
        class="day-tab"
        :class="{
          active: activeDayIndex === index,
          'day-tab__editing': isEditMode && activeDayIndex === index
        }"
        @click="activeDayIndex = index"
      >
        {{ day.name }}
      </button>
    </div>

    <div
      v-if="isEditMode && activeDay"
      class="day-title"
    >
      <input 
        v-model="activeDay.name"
        class="day-title__input"
        type="text"
        maxlength="20"
        @input="renameDay(activeDay)"
      />
      <div class="day-title__line"/>
    </div>

    <div
      v-if="isEditMode"
      class="day-actions"
    >
      <button
        class="day-actions__add"
        @click="addNewDay"
      >
        + Add day
      </button>
      <button
        v-if="isEditMode && activeDay"
        class="day-actions__remove"
        @click="removeCurrentDay"
      >
        ✕ Remove
      </button>
    </div>

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
  </div>
</template>

<style scoped>
.board {
  max-width: 430px;
  margin: 0 auto;
  padding: 90px 24px 40px;
}

.board__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
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

.day-tabs {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  margin-bottom: 8px;
}

.day-tab {
  flex: none;
  padding: 8px 14px;
  border-radius: 10px;
  background: var(--bg-card);
  border: 1.5px solid var(--border);
  color: var(--text-secondary);
  font-family: var(--font);
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  cursor: pointer;
}

.day-tab.active {
  background: var(--accent-soft);
  border-color: var(--accent);
  color: var(--accent);
}

.day-tab__editing {
  background: var(--accent-soft);
  border-style: dashed;
  border-color: var(--accent);
  color: var(--accent);
}

.day-title {
  margin-top: 18px;
}

.day-title__input {
  width: 100%;
  padding: 0;
  background: none;
  border: none;
  outline: none;
  color: var(--accent);
  font-family: var(--display);
  font-size: 32px;
  font-weight: 400;
  letter-spacing: .5px;
  line-height: 1.05;
  text-transform: lowercase;
}

.day-title__line {
  height: 2px;
  border-radius: 1px;
  margin-top: 7px;
  background: linear-gradient(90deg, var(--accent), transparent);
}

.day-actions {
  display: flex;
  gap: 10px;
  margin: 18px 0 0;
}

.day-actions__add {
  flex: 1;
  padding: 13px;
  border-radius: 14px;
  border: 1.5px dashed var(--border);
  background: none;
  color: var(--text-muted);
  font-family: var(--mono);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  cursor: pointer;
}

.day-actions__remove {
  flex: 1;
  padding: 13px;
  border-radius: 14px;
  border: 1.5px dashed rgba(239, 68, 68, .55);
  background: rgba(239, 68, 68, .06);
  color: var(--error-red);
  font-family: var(--mono);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  cursor: pointer;
}

.day-progress {
  height: 4px;
  border-radius: 2px;
  background: var(--border);
  overflow: hidden;
  margin-top: 26px;
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
</style>
