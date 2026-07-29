import { createRouter, createWebHistory } from "vue-router"
import { useAuthStore } from '@/stores/auth'

const routes = [
  { 
    path: '/login', 
    name: 'login', 
    component: () => import('@/views/LoginView.vue')
  },
  { 
    path: '/', 
    name: 'home', 
    component: () => import('@/views/HomeView.vue'), 
    meta: { requiresAuth: true } 
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue')
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  const auth = useAuthStore();

  if (auth.loading) {
    await auth.init()
  }

  if (to.meta.requiresAuth && !auth.user) {
    return { name: 'login' }
  }

  if (to.name === 'login' && auth.user) {
    return { name: 'home' }
  }
});

export default router
