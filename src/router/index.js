import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import LoginPage from '../views/LoginPage.vue';
import RegisterPage from '../views/RegisterPage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: { requiredAuth: true}
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { requiredAuth: false}
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
    meta: { requiredAuth: false}
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/DashboardPage.vue'),
    meta: { requiredAuth: true}
  },
  {
    path: '/create',
    name: 'CreatePost',
    component: () => import('../views/CreatePost.vue'),
    meta: { requiredAuth: true}
  },
  {
    path: '/post/:id',
    name: 'PostDetail',
    component: () => import('../views/PostDetail.vue'),
    meta: { requiredAuth: true}
  },
  {
    path: '/edit/:id',
    name: 'EditPost',
    component: () => import('../views/EditPost.vue'),
    meta: { requiredAuth: true}
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

// Navigation guard - protect routes
router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem('token');
  
  // If route requires auth and user is not logged in
  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login');
  } 
  // If user is logged in and tries to go to login/register
  else if ((to.path === '/login' || to.path === '/register') && isLoggedIn) {
    next('/dashboard');
  }
  // Otherwise, proceed
  else {
    next();
  }
});

export default router;