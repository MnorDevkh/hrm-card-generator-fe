import ReceiptPage from '@/features/receipt/ReceiptPage.vue';
import { ROLE_ADMIN, ROLE_RECEPT } from '@/utils/role';

const receipt = [
  {
    path: '/receipt',
    component: ReceiptPage,
    meta: { allowedRoles: [ROLE_RECEPT], layout: 'ReceptionLayout' },
  },
  {
    path: '/receipts',
    component: ReceiptPage,
    meta: { allowedRoles: [ROLE_ADMIN] },
  },
];

export default receipt;

