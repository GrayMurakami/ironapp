<script setup>
import { onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useProgramStore } from '@/stores/program'

const auth = useAuthStore();
const program = useProgramStore();

const { appNameDemo } = storeToRefs(auth);
const { loaded, error, hasDays } = storeToRefs(program);

const showOnboarding = computed(() => loaded.value && !hasDays.value);

onMounted(() => {
  program.fetchDays();
});
</script>

<template>

</template>

<style scoped>

</style>