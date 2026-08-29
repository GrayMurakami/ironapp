<script setup>
import { nextTick } from 'vue'
import { useProgramStore } from '@/stores/program'

const props = defineProps({
  days: { type: Array, required: true },
  activeDayIndex: { type: Number, required: true },
  activeDay: { type: Object, default: null },
  isEditMode: { type: Boolean, default: false },
});

const emit = defineEmits(['update:activeDayIndex']);

const program = useProgramStore();
let renameTimer = null;

function selectDay(index) {
  emit('update:activeDayIndex', index)
}

function renameDay(day) {
  clearTimeout(renameTimer);
  renameTimer = setTimeout(() => {
    program.updateDayName(day.id, day.name)
  }, 600);
}

async function addNewDay() {
  await program.addDay();
  await nextTick();
  emit('update:activeDayIndex', props.days.length - 1);
}

async function removeCurrentDay() {
  const dayId = props.activeDay.id;
  await program.deleteDay(dayId);
  if (props.activeDayIndex >= props.days.length - 1) {
    emit('update:activeDayIndex', Math.max(0, props.days.length - 1));
  }
}
</script>

<template>
  <div class="day-tabs">
    <button
      v-for="(day, index) in days"
      :key="day.id"
      class="day-tab"
      :class="{
        active: activeDayIndex === index,
        'day-tab__editing': isEditMode && activeDayIndex === index
      }"
      @click="selectDay(index)"
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
      v-if="activeDay"
      class="day-actions__remove"
      @click="removeCurrentDay"
    >
      ✕ Remove
    </button>
  </div>
</template>

<style scoped>
.day-tabs {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  margin-bottom: 8px;
  scrollbar-width: none;
}

.day-tabs::-webkit-scrollbar {
  display: none;
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
</style>
