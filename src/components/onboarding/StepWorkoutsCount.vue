<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['select']);

const selected = ref(null);
const options = [1, 2, 3, 4, 5, 6];

const canContinue = computed(() => selected.value !== null);

function pick(count) {
  selected.value = count;
}

function submit() {
  if (!canContinue.value) return
  emit('select', selected.value);
}
</script>

<template>
  <div class="step">
    <div class="step__progress">
      <div class="step__label">
          setup 1 / 3
      </div>
      <div class="step__bar">
        <div class="seg seg--on" />
        <div class="seg" />
        <div class="seg" />
      </div>
    </div>

    <h1 class="step__title">
      HOW MANY<br />WORKOUTS?
    </h1>
    <p class="step__sub">
      Different workouts in your rotation — not fixed weekdays. Train whenever you make it to the gym.
    </p>

    <div class="options">
      <button
        v-for="count in options"
        :key="count"
        class="option"
        :class="{ active: selected === count }"
        @click="pick(count)"
      >
        <span class="option__num">
          {{ count }}
        </span>
        <span class="option__label">
          {{ count === 1 ? 'day' : 'days' }}
        </span>
      </button>
    </div>

    <div class="step__footer">
      <button
        class="continue"
        :disabled="!canContinue"
        @click="submit"
      >
        Continue
      </button>
    </div>
  </div>
</template>

<style scoped>
.step { 
  padding: 0 24px 34px;
  display: flex;
  flex-direction: column;
  min-height: 100dvh 
}

.step__progress { 
  padding: 60px 0 16px 
}

.step__label {
  font-family: var(--mono);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 14px;
}

.step__bar { 
  display: flex;
  gap: 6px;
  margin-bottom: 20px 
}

.seg { 
  flex: 1;
  height: 3px;
  border-radius: 2px;
  background: var(--border) 
}

.seg--on { 
  background: var(--accent) 
}

.step__title {
  font-family: 'Anton', sans-serif;
  font-size: 38px;
  font-weight: 400;
  line-height: .95;
  letter-spacing: .5px;
  text-transform: uppercase;
  color: var(--brand);
  margin: 0;
}

.step__sub {
  margin: 12px 0 24px;
  font-size: 14px;
  line-height: 1.5;
  color: var(--text-secondary);
  max-width: 290px;
  text-wrap: pretty;
}

.options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 16px 8px;
  border-radius: 14px;
  cursor: pointer;
  background: var(--bg-card);
  border: 1.5px solid var(--border);
  box-shadow: var(--shadow-card);
  color: var(--text-secondary);
  transition: all .2s ease;
}

.option.active {
  background: var(--accent-soft);
  border-color: var(--accent);
  color: var(--accent);
  box-shadow: none;
}

.option__num {
  font-family: var(--mono);
  font-size: 26px;
  font-weight: 700;
  line-height: 1;
}

.option__label { 
  font-size: 11px;
  font-weight: 700;
  opacity: .7 
}

.step__footer { 
  margin-top: auto;
  padding-top: 14px;
  padding-bottom: 6px
}

.continue {
  width: 100%;
  padding: 15px;
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

.continue:disabled { 
  opacity: .45;
  cursor: default 
}
</style>