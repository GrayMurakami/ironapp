import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const profile = ref(null);
  const loading = ref(true);

  const appNameDemo = computed(() => {
    if (user.value?.email === import.meta.env.VITE_DEMO_EMAIL) return 'IRONDEMO'
    return profile.value?.gender === 'female'
      ? 'IRONWOMAN'
      : 'IRONMAN'
  })

  async function fetchProfile(userId) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    profile.value = data;
    return data;
  }

  async function init() {
    const { data: { session } } = await supabase.auth.getSession();
    user.value = session?.user ?? null;
    if (user.value) await fetchProfile(user.value.id);
    loading.value = false;

    supabase.auth.onAuthStateChange(async (_event, session) => {
      user.value = session?.user ?? null;
      profile.value = user.value ? await fetchProfile(user.value.id) : null;
    });
  }

  async function signUp(email, password, gender) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { gender }
      },
    });
    if (error) throw error
    return data
  }

  async function signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error
  }

  async function loginAsGuest() {
    return signIn(
      import.meta.env.VITE_DEMO_EMAIL,
      import.meta.env.VITE_DEMO_PASSWORD
    )
  }

  async function signOut() {
    await supabase.auth.signOut();
    user.value = null;
    profile.value = null;
  }

  return {
    user,
    profile,
    loading,
    appNameDemo,
    init,
    signUp,
    signIn,
    loginAsGuest,
    signOut
  }
});
