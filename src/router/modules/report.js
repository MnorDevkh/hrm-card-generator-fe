import ReportPage from '@/components/report/ReportPage.vue';
import { ROLE_ADMIN } from '@/utils/role';

const report = [
  {
    path: '/reports',
    component: ReportPage,
    name: 'Reports',
    meta: {
      title: 'Reports - HRM',
      allowedRoles: [ROLE_ADMIN],
    },
  },
];

export default report;
