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


</script>

<template>
  
</template>

<style scoped>

</style>