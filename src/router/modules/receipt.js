import ReceiptPage from '@/features/receipt/ReceiptPage.vue';
import { ROLE_RECEPT } from '@/utils/role';

const receipt = [
  {
    path: '/receipt',
    component: ReceiptPage,
    meta: { allowedRoles: [ROLE_RECEPT], layout: 'ReceptionLayout' },
  },
];

export default receipt;

