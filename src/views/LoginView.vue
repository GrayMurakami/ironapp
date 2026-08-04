<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const auth = useAuthStore();

const awaitingConfirmation = ref(false);

const mode = ref('signin');
const gender = ref('male');
const email = ref('');
const password = ref('');
const showPass = ref(false);
const isLoading = ref(false);
const error = ref('');

const isSignUp = computed(() => 
  mode.value === 'signup'
);
const tagLine = computed(() => 
  isSignUp.value
    ? 'new profile'
    : 'welcome back'
);
const appName = computed(() => 
  isSignUp.value && gender.value === 'female'
    ? 'IRONWOMAN'
    : 'IRONMAN'
);
const subtitle = computed(() => 
  isSignUp.value
    ? 'Build your program, log sets and weights right between rounds.'
    : 'Your gym, your weights. Be the best version of yourself!'
);
const submitLabel = computed(() => 
  isLoading.value 
    ? '\u2022 \u2022 \u2022'
    : isSignUp.value
      ? 'Create account'
      : 'Log in'
);

async function submit() {
  error.value = ''
  isLoading.value = true;

  try {
    if (isSignUp.value) {
      await auth.signUp(email.value, password.value, gender.value);
      if (!data.session) {
        awaitingConfirmation.value = true;
        return
      }
    } else {
      await auth.signIn(email.value, password.value);
    }
    router.push('/');
  } catch (e) {
    error.value = e.message;
  } finally {
    isLoading.value = false;
  }
}

async function tryDemo() {
  error.value = '';
  isLoading.value = true;

  try {
    await auth.loginAsGuest();
    router.push('/');
  } catch (e) {
    error.value = e.message;
  } finally {
    isLoading.value = false;
  }
}

function resetFields() {
  email.value = '';
  password.value = '';
  error.value = '';
}
</script>

<template>
  <div class="auth">
    <div class="auth__halo" />
    <div class="auth__noise" />

    <div class="auth__inner">
      <header class="auth__head">
        <div class="auth__tagline">
          {{ tagLine }}
        </div>
      </header>

      <h1 class="auth__brand">
        {{ appName }}
      </h1>
      <p class="auth__sub">
        {{ subtitle }}
      </p>

      <div class="tabs">
        <button
          :class="{ active: !isSignUp }"
          @click="mode = 'signin'; resetFields()"  
        >
          SignIn
        </button>
        <button
          :class="{ active: isSignUp }"
          @click="mode = 'signup'; resetFields()"
        >
          SignUp
        </button>
      </div>

      <form @submit.prevent="submit" autocomplete="off">
        <div
          v-if="isSignUp"
          class="gender"  
        >
          <button
            type="button"
            :class="{ active: gender === 'male' }"
            @click="gender = 'male'"
          >
            Man
          </button>
          <button
            type="button"
            :class="{ active: gender === 'female' }"
            @click="gender = 'female'"
          >
            Woman
          </button>
        </div>

        <label class="field">
          <span class="field__label">
            Email
          </span>
          <input 
            v-model="email"
            type="email"
            autocomplete="off"
            placeholder="gray@app.com"
            required
          />
        </label>

        <label class="field">
          <span class="field__label">
            <span>
              Password
            </span>
            <span
              class="field__toggle"
              @click="showPass = !showPass"
            >
              {{ showPass ? 'Hide' : 'Show' }}
            </span>
          </span>
          <input
            v-model="password"
            :type="showPass ? 'text' : 'password'"
            autocomplete="new-password"
            placeholder="At least 6 characters"
            minlength="6"
            required
          />
        </label>

        <p
          v-if="error"
          class="error"
        >
          {{ error }}
        </p>

        <div
          v-if="!isSignUp"
          class="forgot"
        >
          <span>
            Forgot password?
          </span>
        </div>

        <div class="spacer" />

        <button
          type="submit"
          class="submit"
          :disabled="isLoading"
        >
          {{ submitLabel }}
        </button>

        <div class="or">
          <i />
            <span>
              OR
            </span>
          <i />
        </div>

        <button
          type="button"
          class="demo"
          :disabled="isLoading"
          @click="tryDemo"
        >
          <span>
            Try the Demo
          </span>
          <span class="demo__hint">
            no account
          </span>
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.auth {
  position: relative;
  min-height: 100dvh;
  background: var(--bg);
  color: var(--text);
  overflow: hidden;
  transition: background .45s ease, color .45s ease;
}

.auth__halo {
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

.auth__noise {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: .035;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

@keyframes glowPulse { 
  0%, 100% { opacity: .5 } 50% { opacity: .9 } 
}

@keyframes rise { 
  from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: none } 
}

.auth__inner {
  position: relative;
  z-index: 2;
  max-width: 390px;
  min-height: 100dvh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  padding: 54px 26px 30px;
}

.auth__head {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 14px;
  padding-top: 26px;
  margin-bottom: 16px;
}

.auth__tagline {
  font-family: var(--mono);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--text-muted);
}

.auth__brand {
  font-family: 'Anton', sans-serif;
  font-size: 56px;
  font-weight: 400;
  letter-spacing: 1px;
  line-height: .92;
  text-transform: uppercase;
  color: var(--accent);
  text-shadow: 0 0 46px var(--accent-glow);
}

.auth__sub {
  margin: 12px 0 24px;
  font-size: 14px;
  line-height: 1.45;
  color: var(--text-secondary);
  max-width: 262px;
  text-wrap: pretty;
}

.tabs {
  display: flex;
  gap: 8px;
  padding: 5px;
  border-radius: 14px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-card);
  margin-bottom: 20px;
}

.tabs button {
  flex: 1;
  padding: 11px 8px;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: var(--text-secondary);
  font-family: var(--font);
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
  transition: all .25s ease;
}

.tabs button.active { 
  background: var(--accent); 
  color: var(--on-accent) 
}

form { 
  flex: 1; 
  display: flex; 
  flex-direction: column; 
  gap: 11px; 
  min-height: 0 
}

.spacer { 
  flex: 1 
}

.gender { 
  display: flex; 
  gap: 9px; 
  animation: rise .3s ease 
}

.gender button {
  flex: 1;
  padding: 13px 14px;
  border-radius: 12px;
  border: 1.5px solid var(--border);
  background: var(--bg-card);
  box-shadow: var(--shadow-card);
  color: var(--text);
  font-family: var(--font);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all .25s ease;
}

.gender button.active {
  background: var(--accent-soft);
  border-color: var(--accent);
  color: var(--accent);
  box-shadow: none;
}

.field { 
  display: flex; 
  flex-direction: column; 
  gap: 6px 
}

.field__label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: var(--mono);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  color: var(--text-muted);
}

.field__toggle { 
  cursor: pointer; 
  color: var(--accent) 
}

.field input {
  width: 100%;
  padding: 14px 15px;
  border-radius: 12px;
  background: var(--bg-card);
  border: 1.5px solid var(--border);
  color: var(--text);
  font-family: var(--font);
  font-size: 15px;
  font-weight: 600;
  outline: none;
  box-shadow: var(--shadow-card);
  transition: border-color .2s, background .35s;
}

.field input::placeholder { 
  color: var(--text-muted) 
}

.field input:focus { 
  border-color: var(--accent) 
}

.error {
  padding: 9px 12px;
  border-radius: 9px;
  background: rgba(239, 68, 68, .12);
  border: 1px solid rgba(239, 68, 68, .25);
  font-size: 12px;
  font-weight: 600;
  color: var(--error-red);
}

.forgot { 
  display: flex; 
  justify-content: flex-end; 
  margin-top: -2px 
}

.forgot span { 
  font-size: 12px; 
  font-weight: 600;
  color: var(--text-secondary); 
  cursor: pointer 
}

.submit {
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
  transition: transform .15s ease, opacity .2s;
}

.submit:disabled { opacity: .6 }

.or { 
  display: flex; 
  align-items: center; 
  gap: 12px; 
  padding: 4px 0 
}

.or i { 
  flex: 1; 
  height: 1px; 
  background: var(--border) 
}

.or span {
  font-family: var(--mono);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--text-muted);
}

.demo {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px;
  border-radius: 14px;
  background: transparent;
  border: 1.5px dashed var(--border);
  color: var(--text);
  font-family: var(--font);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: border-color .2s, background .2s;
}

.demo:hover { 
  border-color: var(--accent) 
}

.demo__hint {
  font-family: var(--mono);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--text-muted);
}
</style>