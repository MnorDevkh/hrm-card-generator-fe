import { createRouter, createWebHistory } from 'vue-router';
import auth from './modules/auth';
import student from './modules/student';
import staff from './modules/staff';
import lecture from './modules/lecture';
import template from './modules/template';
import report from './modules/report';
import home from './modules/home';
import settings from './modules/settings';
import receipt from './modules/receipt';
import DefaultLayout from '../DefaultLayout.vue';
import ReceptionLayout from '../ReceptionLayout.vue';
import BlankLayout from '@/BlankLayout.vue';
import {
  getCurrentRole,
  ROLE_ADMIN,
  ROLE_MANAGE_STUDENT,
  ROLE_MANAGE_STAFF,
  ROLE_MANAGE_LECTURER,
  ROLE_RECEPT,
} from '@/utils/role';

const appRoutes = [
  ...home,
  ...student,
  ...staff,
  ...lecture,
  ...template,
  ...report,
  ...settings,
  ...receipt,
];

const routes = [
  ...auth,
  {
    path: '/',
    component: DefaultLayout,
    children: appRoutes.filter(
      (route) =>
        route.meta?.layout !== 'BlankLayout' &&
        route.meta?.layout !== 'ReceptionLayout',
    ),
  },
  {
    path: '/',
    component: ReceptionLayout,
    children: appRoutes.filter((route) => route.meta?.layout === 'ReceptionLayout'),
  },
  {
    path: '/',
    component: BlankLayout,
    children: appRoutes.filter((route) => route.meta?.layout === 'BlankLayout'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/register', '/forgot-password'];
  const isPublic = to.matched.some((record) => record.meta.isPublic);

  if (isPublic) {
    return next();
  }

  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('auth_token');

  if (loggedIn) {
    if (to.path === '/login') {
      return next({ path: '/' });
    }
  } else if (authRequired) {
    return next({ path: '/login', query: { redirect: to.fullPath } });
  }

  const role = getCurrentRole();
  if (loggedIn && role === ROLE_ADMIN && to.path === '/receipt') {
    return next({ path: '/receipts', replace: true });
  }
  if (loggedIn && role === ROLE_RECEPT && to.path === '/receipts') {
    return next({ path: '/receipt', replace: true });
  }

  const recordWithRoles = to.matched.find((record) =>
    Array.isArray(record.meta?.allowedRoles),
  );

  if (recordWithRoles && role) {
    const allowedRoles = recordWithRoles.meta.allowedRoles;
    if (!allowedRoles.includes(role)) {
      let redirectPath = '/';
      if (role === ROLE_MANAGE_STUDENT) {
        redirectPath = '/student';
      } else if (role === ROLE_MANAGE_STAFF) {
        redirectPath = '/staff';
      } else if (role === ROLE_MANAGE_LECTURER) {
        redirectPath = '/lecture';
      } else if (role === ROLE_RECEPT) {
        redirectPath = '/receipt';
      }
      return next({ path: redirectPath });
    }
  }

  next();
});

export default router;
