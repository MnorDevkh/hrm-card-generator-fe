import { createRouter, createWebHistory } from 'vue-router'
import auth from "./modules/auth";
import student from "./modules/student";
import staff from "./modules/staff";
import lecture from "./modules/lecture";
import template from "./modules/template";
import home from "./modules/home";
import AppLayout from '../router/AppLayout.vue';
import HomeComponent from '../components/Home/HomeComponent.vue';


const routes = [
  ...auth,
  ...student,
  ...staff,
  ...lecture,
  ...template,
  ...home,
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/register', '/forgot-password'];
  const isPublic = to.matched.some(record => record.meta.isPublic);

  if (isPublic) {
    return next();
  }

  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('auth_token');

  if (loggedIn) {
    // If logged in, redirect from login page to home
    if (to.path === '/login') {
      return next({ path: '/' });
    }
  } else if (authRequired) {
    // If not logged in and trying to access a protected page, redirect to login
    return next({ path: '/login', query: { redirect: to.fullPath } });
  }

  next();
});

export default router