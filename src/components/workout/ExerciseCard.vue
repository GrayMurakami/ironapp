<script setup>
import { ref } from 'vue'
import { useProgramStore } from '@/stores/program'

const props = defineProps({
  exercise: { type: Object, required: true },
  index: { type: Number, required: true },
  isEditMode: { type: Boolean, default: false },
  isSupersetFirst: { type: Boolean, default: false },
  nextExercise: { type: Object, default: null },
});

const emit = defineEmits(['remove', 'link', 'unlink']);

const program = useProgramStore();
let saveTimer = null;

function scheduleSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    program.updateExercise(props.exercise)
  }, 600);
}

function toggleSetDone(setIndex) {
  props.exercise.sets_data[setIndex].done = !props.exercise.sets_data[setIndex].done;
  scheduleSave();
}

function updateName() {
  scheduleSave();
}

function updateSetsCount(newCount) {
  const count = Math.max(1, Math.min(10, newCount || 1));
  const current = props.exercise.sets_data.length

  if (count > current) {
    const toAdd = count - current;
    for (let i = 0; i < toAdd; i++) {
      props.exercise.sets_data.push({ weight: null, reps: null, done: false })
    }
  } else if (count < current) {
    props.exercise.sets_data.splice(count)
  }

  props.exercise.sets = count;
  scheduleSave();
}
</script>

<template>
  <div
    class="exercise-card"
    :class="{ 'exercise-card__edit': isEditMode }"
  >
    <div class="exercise-card__head">
      <div class="exercise-card__head-start">
        <span
          v-if="isEditMode"
          class="exercise-card__drag"
        >
          ⠿
        </span>
        <span class="exercise-card__num">
          {{ String(index + 1).padStart(2, '0') }}
        </span>
      </div>
      <div class="exercise-card__title">
        <span
          v-if="!isEditMode" 
          class="exercise-card__name"
        >
          {{ exercise.name }}
        </span>
        <input
          v-else
          v-model="exercise.name"
          class="exercise-card__name-input"
          type="text"
          maxlength="40"
          @input="updateName"
        />
      </div>

    </div>

    <div class="exercise-card__grid">
      <span class="exercise-card__label exercise-card__label--sets">
        sets
      </span>
      <div class="exercise-card__box">
        <input
          class="exercise-card__input"
          :value="exercise.sets"
          type="number"
          inputmode="numeric"
          @input="updateSetsCount(Number($event.target.value))"
        />
      </div>

      <span 
        class="exercise-card__label exercise-card__label--rest"
        :class="{ 'is-done': isSupersetFirst }"      
      >
        rest
      </span>
      <div 
        class="exercise-card__box"
        :class="{ 'is-done': isSupersetFirst }"  
      >
        <input
          class="exercise-card__input"
          v-model.number="exercise.rest_seconds"
          type="number"
          inputmode="numeric"
          @input="scheduleSave"
        />
      </div>
      <span class="exercise-card__unit">
        sec
      </span>
      
      <div class="exercise-card__divider" />

      <template
        v-for="(set, setIndex) in exercise.sets_data"
        :key="setIndex"
      >
        <span 
          class="exercise-card__label exercise-card__label--weight"
          :class="{ 'is-done': set.done }"
        >
          kg
        </span>
        <div 
          class="exercise-card__box"
          :class="{ 'is-done': set.done }"
        >
          <input
            class="exercise-card__input"
            v-model.number="set.weight"
            type="number"
            inputmode="decimal"
            placeholder="-"
            @input="scheduleSave"
          />
        </div>
        
        <span
          class="exercise-card__label exercise-card__label--reps"
          :class="{ 'is-done': set.done }"
        >
          reps
        </span>
        <div 
          class="exercise-card__box"
          :class="{ 'is-done': set.done }"
        >
          <input
            class="exercise-card__input"
            v-model.number="set.reps"
            type="number"
            inputmode="numeric"
            placeholder="-"
            @input="scheduleSave"
          />
        </div>

        <button
          class="exercise-card__check"
          :class="{ 'exercise-card__check--done': set.done }"
          @click="toggleSetDone(setIndex)"
        >
          {{ set.done ? '✓' : setIndex + 1 }}
        </button>
      </template>
    </div>

    <button
      v-if="isEditMode && nextExercise"
      class="exercise-card__link-btn"
      @click="emit('link', nextExercise)"
    >
      🔗 Link Up
    </button>

    <button
      v-if="isEditMode && isSupersetFirst"
      class="exercise-card__link-btn exercise-card__link-btn--active"
      @click="emit('unlink')"
    >
      🔗 Unlink
    </button>

    <button
      v-if="isEditMode"
      class="exercise-card__remove"
      @click="emit('remove')"
      aria-label="Remove exercise"
    >
      🗑 delete
    </button>
  </div>
</template>

<style scoped>
.exercise-card {
  position: relative;
  border-radius: 16px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-card);
  padding: 13px 13px 17px;
}

.exercise-card__edit {
  padding-bottom: 50px;
}

.exercise-card__head {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 17px;
}

.exercise-card__head-start {
  display: flex;
  align-items: center;
  gap: 6px;
}

.exercise-card__drag {
  flex: none;
  width: 20px;
  text-align: center;
  font-size: 18px;
  color: var(--text-muted);
  cursor: grab;
  touch-action: none;
}

.exercise-card__drag:active {
  cursor: grabbing;
}

.exercise-card__num {
  flex: none;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  border: 2px solid var(--error-red);
  color: var(--error-red);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--mono);
  font-size: 18px;
  font-weight: 700;
}

.exercise-card__title {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.exercise-card__name {
  display: -webkit-box;
  word-break: break-word;
  font-size: 20px;
  font-weight: 800;
  color: var(--text);
  overflow: hidden;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.exercise-card__name-input {
  width: 100%;
  padding: 6px 0;
  background: none;
  border: none;
  border-bottom: 1.5px solid var(--border);
  outline: none;
  color: var(--text);
  font-family: var(--font);
  font-size: 20px;
  font-weight: 800;
}

.exercise-card__name-input:focus {
  border-bottom-color: var(--accent);
}


.exercise-card__grid {
  display: grid;
  grid-template-columns: auto minmax(0, 68px) auto minmax(0, 68px) 40px;
  gap: 8px;
  align-items: center;
  justify-content: center;
}

.exercise-card__divider {
  grid-column: 1 / -1;
  height: 1px;
  background: var(--border);
  margin: 4px 0;
}

.exercise-card__label {
  font-family: var(--mono);
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  text-align: right;
}

.exercise-card__label--sets { 
  color: var(--accent);
}

.exercise-card__label--rest { 
  color: var(--green);
  margin-left: 14px;
}

.exercise-card__label--weight { 
  color: var(--gold);
}

.exercise-card__label--reps {
  color: var(--cyan);
  margin-left: 25px;
}

.exercise-card__unit {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--text-muted);
  align-self: end;
  padding-bottom: 3px;
}

.exercise-card__box {
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 10px;
  border-radius: 10px;
  background: var(--bg);
  border: 1.5px solid var(--border);
  transition: border-color .2s;
}

.exercise-card__box:focus-within { 
  border-color: var(--accent)
}

.exercise-card__input {
  width: 100%;
  min-width: 0;
  background: none;
  border: none;
  outline: none;
  text-align: center;
  font-family: var(--display);
  font-size: 17px;
  font-weight: 400;
  letter-spacing: 1px;
  color: var(--text);
  -moz-appearance: textfield;
  appearance: textfield;
}

.exercise-card__input::-webkit-outer-spin-button,
.exercise-card__input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.exercise-card__check {
  width: 40px;
  height: 36px;
  margin-left: 7px;
  border-radius: 8px;
  background: var(--bg);
  border: 2px solid var(--border);
  color: var(--text-muted);
  font-family: var(--display);
  font-size: 20px;
  cursor: pointer;
  transition: all .2s;
}

.exercise-card__check--done {
  background: var(--green-soft);
  border-color: var(--green);
  color: var(--green);
  font-family: var(--mono);
  font-size: 15px;
  font-weight: 700;
}

.exercise-card__label.is-done,
.exercise-card__box.is-done {
  opacity: .4;
}

.exercise-card__link-btn,
.exercise-card__remove {
  position: absolute;
  bottom: 0;
  padding: 9px 16px;
  background: none;
  border: 1.5px dashed var(--border);
  border-bottom: none;
  font-family: var(--mono);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .5px;
  text-transform: uppercase;
  cursor: pointer;
}

.exercise-card__link-btn {
  left: 0;
  border-left: none;
  border-radius: 0 12px 0 15px;
  color: var(--text-muted);
}

.exercise-card__link-btn--active {
  border: 1.5px solid var(--accent);
  border-left: none;
  border-bottom: none;
  background: var(--accent-soft);
  color: var(--accent);
}

.exercise-card__remove {
  right: 0;
  border-right: none;
  border-radius: 12px 0 15px 0;
  border-color: rgba(239, 68, 68, .4);
  color: var(--error-red);
}
</style>
