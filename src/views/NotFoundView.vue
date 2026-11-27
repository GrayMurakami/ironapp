<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter();
const route = useRoute();

const image = '/404.jpg'
</script>

<template>
  <div class="nf">
    <div class="nf__halo" />
    <div class="nf__noise" />

    <div class="nf__inner">
      <header class="nf__head">
        <div class="nf__tagline">
          dead end
        </div>
      </header>

      <div class="nf__body">
        <div>
          <div class="nf__code">404</div>
          <div class="nf__sub">
            <span>
              set not found
            </span>
            <span class="nf__caret">
              ▮
            </span>
          </div>
        </div>

        <div class="figure">
          <div class="figure__stripes" />
          <div 
            class="figure__photo" 
            :style="{ backgroundImage: `url(${image})` }" 
          />
        </div>

        <div>
          <h1 class="nf__title">
            Wrong route
            <br/>
            Follow the white rabbit
          </h1>
          <p class="nf__text">
            This page doesn't exist. 
            The barbell is waiting back on the home screen.
          </p>
        </div>

        <div class="meta">
          <div class="meta__row">
            <span class="meta__key">
              route
            </span>
            <span class="meta__val">
              {{ route.fullPath }}
            </span>
          </div>
          <i class="meta__hr" />
          <div class="meta__row">
            <span class="meta__key">
              status
            </span>
            <span class="meta__val meta__val--acc">
              404 / not_found
            </span>
          </div>
        </div>
      </div>

      <button 
        type="button" 
        class="submit" 
        @click="router.push('/')"
      >
        Back to training
      </button>
    </div>
  </div>
</template>

<style scoped>
.nf {
  position: relative;
  min-height: 100dvh;
  background: var(--bg);
  color: var(--text);
  overflow: hidden;
  transition: background .45s ease, color .45s ease;
}

.nf__halo {
  position: absolute;
  top: -160px;
  left: 50%;
  transform: translateX(-50%);
  width: 460px;
  height: 340px;
  pointer-events: none;
  background: radial-gradient(ellipse, var(--accent-halo) 0%, transparent 70%);
  animation: glowPulse 6s ease-in-out infinite;
}

.nf__noise {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: .035;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

@keyframes glowPulse { 
  0%, 100% { opacity: .5 } 50% { opacity: .9 } 
}

@keyframes drift { 
  0%, 100% { transform: translateY(0) } 50% { transform: translateY(-6px) } 
}

@keyframes blink { 
  0%, 92%, 100% { opacity: 1 } 95% { opacity: .25 } 
}

.nf__inner {
  position: relative;
  z-index: 2;
  max-width: 390px;
  min-height: 100dvh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  padding: 54px 26px 30px;
}

.nf__head {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 14px;
  padding: 26px 78px 10px 0;
}

.nf__tagline {
  font-family: var(--mono);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--text-muted);
}

.nf__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 24px;
  min-height: 0;
}

.nf__code {
  font-family: 'Anton', sans-serif;
  font-size: 112px;
  font-weight: 400;
  line-height: .82;
  letter-spacing: 2px;
  color: var(--brand, var(--text));
  text-shadow: 0 0 60px var(--brand-glow, var(--accent-glow));
}

.nf__sub {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
  font-family: var(--mono);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: var(--accent);
}

.nf__caret { 
  animation: blink 3.2s steps(1, end) infinite 
}

.figure {
  position: relative;
  height: 190px;
  border-radius: 18px;
  overflow: hidden;
  background: var(--bg-card);
  border: 1.5px dashed var(--border);
  box-shadow: var(--shadow-card);
  animation: drift 7s ease-in-out infinite;
}

.figure__stripes {
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(
    135deg,
    var(--stripe, rgba(255, 255, 255, .055)) 0 8px,
    transparent 8px 16px
  );
}

.figure__photo {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
}

.nf__title {
  font-size: 21px;
  font-weight: 800;
  line-height: 1.25;
  letter-spacing: -.3px;
  color: var(--text);
  text-wrap: pretty;
}

.nf__text {
  margin-top: 10px;
  font-size: 14px;
  line-height: 1.5;
  color: var(--text-secondary);
  max-width: 290px;
  text-wrap: pretty;
}

.meta {
  display: flex;
  flex-direction: column;
  gap: 9px;
  padding: 13px 15px;
  border-radius: 14px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-card);
  font-family: var(--mono);
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: .6px;
  text-transform: uppercase;
}

.meta__row { 
  display: flex; 
  justify-content: space-between; 
  gap: 12px 
}

.meta__hr { 
  height: 1px; 
  background: var(--border) 
}

.meta__key { 
  color: var(--text-muted) 
}

.meta__val { 
  color: var(--text-secondary); 
  overflow: hidden; 
  text-overflow: ellipsis; 
  white-space: nowrap 
}

.meta__val--acc { 
  color: var(--accent) 
}

.submit {
  flex: none;
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 14px;
  background: var(--accent);
  color: var(--on-accent);
  font-family: var(--font);
  font-size: 15px;
  font-weight: 800;
  letter-spacing: .3px;
  cursor: pointer;
  box-shadow: var(--shadow-accent);
  transition: transform .15s ease;
}

.submit:active { 
  transform: scale(.98) 
}
</style>