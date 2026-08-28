<script setup>
const props = defineProps({
  data: { type: Object, required: true },
});

const emit = defineEmits(['close']);

function formatDuration(ms) {
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? `${hours} h ${minutes} min` : `${minutes} min`
}

function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', { 
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  }).format(date);
}
</script>

<template>
  <div class="finish-overlay">
    <div class="finish-phrase">
      <span class="finish-phrase__emoji">
        🔥
      </span>
      <h1 class="finish-phrase__text">
        {{ data.phrase }}
      </h1>
    </div>

    <div class="finish-meta">
      <span class="finish-meta__day">
        {{ data.dayName }}
      </span>
      <span class="finish-meta__date">
        {{ formatDate(new Date()) }}
      </span>
    </div>

    <span class="finish__divider" />

    <div class="finish-duration">
      <span class="finish-duration__label">
        Workout time: 
      </span>
      <span class="finish-duration__value">
        {{ formatDuration(data.durationMs) }}
      </span>
    </div>

    <div class="finish-stats">
      <div class="finish-stat">
        <span class="finish-stat__value">
          {{ data.exercisesDone }} / {{ data.exerciseCount }}
        </span>
        <span class="finish-stat__label">
          Exercises
        </span>
      </div>
      <div class="finish-stat">
        <span class="finish-stat__value">
          {{ data.setsDone }} / {{ data.setsTotal }}
        </span>
        <span class="finish-stat__label">
          Sets done
        </span>
      </div>
      <div class="finish-stat">
        <span class="finish-stat__value">
          {{ data.volume }}
        </span>
        <span class="finish-stat__label">
          kg volume
        </span>
      </div>
    </div>

    <button 
      class="finish-close"
      @click="emit('close')"
    >
      Done for today
    </button>
  </div>
</template>

<style scoped>
.finish-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 28px;
  padding: 24px;
  background: var(--bg);
}

.finish-phrase {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
}

.finish-phrase__emoji {
  font-size: 32px;
}

.finish-phrase__text {
  font-family: var(--display);
  font-size: 30px;
  font-weight: 400;
  letter-spacing: .5px;
  text-transform: uppercase;
  color: var(--accent);
  text-shadow: 0 0 30px var(--accent-glow);
  max-width: 320px;
}

.finish-meta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.finish-meta__day {
  font-size: 14px;
  font-weight: 800;
  color: var(--text);
}

.finish-meta__date {
  font-family: var(--mono);
  font-size: 15px;
  color: var(--text-muted);
}

.finish__divider {
  width: 1px;
  height: 20px;
  background: var(--border-strong);
}

.finish-duration {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.finish-duration__value {
  font-family: var(--display);
  font-size: 44px;
  color: var(--text);
}

.finish-duration__label {
  font-family: var(--mono);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--text-muted);
}

.finish-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  width: 100%;
  max-width: 340px;
}

.finish-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 14px 8px;
  border-radius: 12px;
  background: var(--bg-card);
  border: 1px solid var(--border);
}

.finish-stat__value {
  font-family: var(--display);
  font-size: 22px;
  color: var(--text);
}

.finish-stat__label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .5px;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-top: 4px;
}

.finish-close {
  width: 100%;
  max-width: 340px;
  padding: 16px;
  border: none;
  border-radius: 14px;
  background: var(--accent);
  color: var(--on-accent);
  font-family: var(--font);
  font-size: 15px;
  font-weight: 800;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 0 8px 24px var(--accent-glow);
}
</style>