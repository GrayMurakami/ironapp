<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  seconds: { type: Number, required: true },
  exerciseName: { type: String, default: '' },
  exerciseIndex: { type: Number, default: 0 },
});

const emit = defineEmits(['close']);

const totalSeconds = ref(props.seconds);
const remaining = ref(props.seconds);
let intervalId = null;
let closeTimeoutId = null;

const isFinished = computed(() => remaining.value <= 0);

const displayTime = computed(() => {
  const min = Math.floor(Math.max(remaining.value, 0) / 60);
  const sec = Math.max(remaining.value, 0) % 60;
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}` 
});

const progress = computed(() => {
  if (totalSeconds.value === 0) return 0
  return (remaining.value / totalSeconds.value) * 100
});

const ringColor = computed(() => {
  if (remaining.value <= 0) return 'var(--error-red)'
  return remaining.value <= 10 ? 'var(--gold)' : 'var(--cyan)'
});

const exerciseNumber = computed(() => String(props.exerciseIndex + 1).padStart(2, '0'));

function tick() {
  remaining.value -= 1;
  if (remaining.value <= 0) {
    remaining.value = 0;
    clearInterval(intervalId);
    intervalId = null;
    onFinished();
  }
}

function onFinished() {
  if (navigator.vibrate) {
    navigator.vibrate([400, 200, 400, 200, 400])
  }
  closeTimeoutId = setTimeout(() => emit('close'), 3000);
}

function adjustTime(delta) {
  clearTimeout(closeTimeoutId);
  remaining.value = Math.max(0, remaining.value + delta);
  totalSeconds.value = Math.max(totalSeconds.value, remaining.value);

  if (remaining.value > 0 && !intervalId) intervalId = setInterval(tick, 1000);
}

onMounted(() => {
  intervalId = setInterval(tick, 1000);
});

onUnmounted(() => {
  clearInterval(intervalId);
  clearTimeout(closeTimeoutId);
});
</script>

<template>
  <div class="rest-overlay">
    <div class="rest-ring">
      <svg
        viewBox="0 0 200 200"
        class="rest-ring__svg"
      >
        <circle
          cx="100"
          cy="100"
          r="90"
          class="rest-ring__track"  
        />
        <circle
          cx="100"
          cy="100"
          r="90"
          class="rest-ring__progress"
          :style="{ strokeDashoffset: 565.5 - (565.5 * progress) / 100, stroke: ringColor }" 
        />
      </svg>
      <div class="rest-ring__content">
        <span class="rest-ring__label">
          Rest
        </span>
        <span
          class="rest-ring__time"
          :class="{ 'rest-ring__time--done': isFinished }"
        >
          {{ displayTime }}
        </span>
      </div>
    </div>

    <div
      v-if="exerciseName"
      class="rest-exercise"
    >
      <span
        class="rest-exercise__num"
        :style="{ color: ringColor }"
      >
        {{ exerciseNumber }}
      </span>
      <span class="rest-exercise__divider" />
      <span class="rest-exercise__name">
        {{ exerciseName }}
      </span>
    </div>

    <div class="rest-actions">
      <button
        class="rest-actions__adjust"
        @click="adjustTime(-15)"
      >
        - 15
      </button>
      <button
        class="rest-actions__skip"
        @click="emit('close')"     
      >
        {{ isFinished ? 'Go!' : 'Skip' }}
      </button>
      <button
        class="rest-actions__adjust"
        @click="adjustTime(15)"
      >
        + 15
      </button>
    </div>
  </div>
</template>

<style scoped>
.rest-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  background: var(--bg);
  text-transform: uppercase;
}

.rest-ring {
  position: relative;
  width: 220px;
  height: 220px;
}

.rest-ring__svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.rest-ring__track {
  fill: none;
  stroke: var(--border);
  stroke-width: 10;
}

.rest-ring__progress {
  fill: none;
  stroke-width: 10;
  stroke-linecap: round;
  stroke-dasharray: 565.5;
  transition: stroke-dashoffset 1s linear;
}

.rest-ring__content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.rest-ring__label {
  font-family: var(--mono);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--text-muted);
}

.rest-ring__time {
  font-family: var(--display);
  font-size: 66px;
  font-weight: 400;
  font-variant-numeric: tabular-nums;
  letter-spacing: 1px;
  color: var(--text);
}

.rest-ring__time--done {
  color: var(--error-red);
}

.rest-exercise {
  display: flex;
  align-items: center;
  gap: 10px;
}

.rest-exercise__num {
  font-family: var(--mono);
  font-size: 10px;
  font-weight: 700;
  transition: color .35s ease;
}

.rest-exercise__divider {
  width: 1px;
  height: 13px;
  background: var(--border-strong);
}

.rest-exercise__name {
  font-size: 14px;
  font-weight: 800;
  letter-spacing: .4px;
  color: var(--text);
}

.rest-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.rest-actions__adjust {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--bg-card);
  border: 1.5px solid var(--border);
  color: var(--text-secondary);
  font-family: var(--font);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.rest-actions__skip {
  padding: 16px 32px;
  border-radius: 999px;
  border: none;
  background: var(--accent);
  color: var(--on-accent);
  font-family: var(--font);
  font-size: 15px;
  font-weight: 800;
  text-transform: uppercase;
  cursor: pointer;
}
</style>
