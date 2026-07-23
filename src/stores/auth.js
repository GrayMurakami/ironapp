import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const profile = ref(null);
  const loading = ref(true);

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
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { gender }
      },
    });
    if (error) throw error
  }

  async function signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return {
    user,
    profile,
    loading,
    init,
    signUp,
    signIn,
    signOut
  }
});
