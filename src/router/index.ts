import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import Dashboard from '@/views/Dashboard.vue';
import Projects from '@/views/Projects.vue';
import Tasks from '@/views/Tasks.vue';
import { useMainStore } from '@/stores/main';
import myCookie from '@/common/utils/my-cookie';

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { guest: true },
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: { guest: true },
    },
    {
      path: '/',
      redirect: '/dashboard',
      meta: { auth: true },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: { auth: true },
    },
    {
      path: '/projects',
      name: 'projects',
      component: Projects,
      meta: { auth: true },
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: Tasks,
      meta: { auth: true },
    },
  ],
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const token = myCookie.getToken();
  const isAuthenticated = !!token;

  if (to.meta.auth && !isAuthenticated) {
    next({ name: 'login' });
  } else if (to.meta.guest && isAuthenticated) {
    next({ name: 'dashboard' });
  } else {
    next();
  }
});

export default router;
