import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import LoginPage from '../views/LoginPage.vue';
import RegisterPage from '../views/RegisterPage.vue';
import DashboardPage from '@/views/DashboardPage.vue';

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: DashboardPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
    meta: { requiresAuth: false }
  },
  {
    path: '/create',
    name: 'CreatePost',
    component: () => import('../views/CreatePost.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/post/:id',
    name: 'PostDetail',
    component: () => import('../views/PostDetail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/edit/:id',
    name: 'EditPost',
    component: () => import('../views/EditPost.vue'),
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

// Navigation guard - protect routes
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // Load from storage if not initialized
  if (!authStore.token && localStorage.getItem('token')) {
    authStore.loadFromStorage();
  }
  
  const isLoggedIn = authStore.isLoggedIn;
  
  // If route requires auth and user is not logged in
  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login');
  } 
  // If user is logged in and tries to go to login/register
  else if ((to.path === '/login' || to.path === '/register') && isLoggedIn) {
    next('/');
  }
  // Otherwise, proceed
  else {
    next();
  }
});

export default router;