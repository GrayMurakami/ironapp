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
  <div class="day-tabs__main">
    <button
      v-for="(day, index) in days"
      :key="day.id"
      class="day-tab__label"
      :class="{
        active: activeDayIndex === index,
        'day-tab__editing': isEditMode && activeDayIndex === index
      }"
      @click="selectDay(index)"
    >
      <span class="day-tab__ghost">
        {{ index + 1 }}
      </span>
      <span class="day-tab__name">
        {{ day.name }}
      </span>
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
.day-tabs__main {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  margin-bottom: 8px;
  scrollbar-width: none;
}

.day-tabs__main::-webkit-scrollbar {
  display: none;
}

.day-tab__label {
  position: relative;
  flex: none;
  display: flex;
  align-items: flex-end;
  min-height: 66px;
  padding: 14px 16px;
  border-radius: 14px;
  overflow: hidden;
  background: var(--bg-card);
  border: 1.5px solid var(--border);
  cursor: pointer;
}

.day-tab__ghost {
  position: absolute;
  top: -10px;
  right: 6px;
  font-family: var(--display);
  font-size: 56px;
  line-height: 1;
  color: rgba(255, 255, 255, .05);
  pointer-events: none;
}

[data-theme="light"] .day-tab__ghost {
  color: rgba(0, 0, 0, .06);
}

.day-tab__name {
  position: relative;
  max-width: 100px;
  font-size: 15px;
  font-weight: 800;
  line-height: 1.25;
  text-align: left;
  text-transform: uppercase;
  white-space: normal;
  word-break: break-word;
  text-wrap: balance;
  color: var(--text-secondary);
}

.day-tab__label.active {
  background: var(--accent-soft);
  border-color: var(--accent);
  box-shadow: 0 0 18px var(--accent-glow);
}

.day-tab__label.active .day-tab__name {
  color: var(--accent);
}

.day-tab__label.active .day-tab__ghost {
  color: var(--accent-glow);
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
