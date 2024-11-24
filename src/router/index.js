import { createRouter, createWebHistory } from 'vue-router';
import LoginForm from '@/components/login.vue';
import HomePage from '@/components/HomePage.vue';

const routes = [
  { path: '/login', component: LoginForm },
  {
    path: '/home',
    component: HomePage,
    meta: { requiresAuth: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard for Authentication
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token'); // Check for token
  if (to.meta.requiresAuth && !token) {
    next('/login'); // Redirect to login if not authenticated
  } else {
    next(); // Proceed to the route
  }
});

export default router;
