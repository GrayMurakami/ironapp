<script setup>
import { onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useProgramStore } from '@/stores/program'
import OnboardingWizard from '@/components/onboarding/OnboardingWizard.vue'

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
  <div class="home">
    <div
      v-if="!loaded"
      class="home__loading"
    >
      Loading ・・・
    </div>

    <div
      v-else-if="error"
      class="home__error"
    >
      {{ error }}
      <button @click="program.fetchDays()">
        Try again!
      </button>
    </div>

    <div
      v-else-if="showOnboarding"
      class="home__onboarding"    
    >
      <OnboardingWizard />
    </div>

    <div
      v-else
      class="home_main"
    >
      <h1>
        {{ appNameDemo }}
      </h1>
      <button @click="auth.signOut()">
        Log Out
      </button>
    </div>
  </div>
</template>

<style scoped>

</style>