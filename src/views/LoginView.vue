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
  
</template>

<style scoped>

</style>