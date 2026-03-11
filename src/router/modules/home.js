import Dashboard from '../Dashboard.vue';
import {
  ROLE_ADMIN
} from '@/utils/role';

const home = [
  { path: "", 
    component: Dashboard,
    name: 'Dashboard',
    meta: {
      title: 'Dashboard - HRM',
      allowedRoles: [ROLE_ADMIN]
    } 
  }
  //   { path: '/about', component: AboutView },
];

export default home;