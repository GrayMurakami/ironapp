<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const auth = useAuthStore();

const mode = ref('signin');
const email = ref('');
const password = ref('');
const gender = ref('male');
const isLoading = ref(false);
const error = ref('');

async function submit() {
  error.value = '';
  isLoading.value = true;

  try {
    if (mode.value === 'signup') {
      await auth.signUp(email.value, password.value, gender.value);
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
</script>

<template>
  <div class="login">
    <h1>
      {{ gender === 'female' ? 'IRONWOMAN' : 'IRONMAN' }}
    </h1>

    <div
      v-if="mode === 'signup'"
      class="gender-select"  
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

    <div class="tabs">
      <button
        :class="{ active: mode === 'signin' }"
        @click="mode = 'signin'"  
      >
        SignIn
      </button>
      <button
        :class="{ active: mode === 'signup' }"
        @click="mode = 'signup'"
      >
        SignUp
      </button>
    </div>

    <form @submit.prevent="submit">
      <input 
        v-model="email"
        type="email"
        placeholder="Email"
        required
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        required
        minlength="6"
      />

      <p
        v-if="error"
        class="error"
      >
        {{ error }}
      </p>

      <button
        type="submit"
        class="submit"
        :disabled="isLoading"
      >
        {{ isLoading ? '・・・' : mode === 'signin' ? 'LogIn' : 'Create an account' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.login {
  max-width: 360px;
  margin: 0 auto;
  padding: 32px 20px;
}

.login h1 {
  text-align: center;
  margin-bottom: 24px;
  letter-spacing: 1px;
}

.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.tabs button,
.gender-select button {
  flex: 1;
  padding: 10px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-strong);
  background: var(--bg-card);
  color: var(--text-secondary);
}

.tabs button.active,
.gender-select button.active {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}

form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

input {
  padding: 12px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-strong);
  background: var(--bg-card);
  color: var(--text);
  font-family: var(--font);
}

.gender-select {
  display: flex;
  gap: 8px;
}

.submit {
  padding: 12px;
  border-radius: var(--radius-sm);
  border: none;
  background: var(--accent);
  color: #fff;
  font-weight: 600;
  margin-top: 8px;
}

.submit:disabled {
  opacity: 0.6;
}

.error {
  color: var(--red);
  font-size: 14px;
}
</style>