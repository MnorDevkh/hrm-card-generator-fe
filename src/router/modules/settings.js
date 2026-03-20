import CatalogOptionsManager from '@/components/settings/CatalogOptionsManager.vue';
import { ROLE_ADMIN } from '@/utils/role';

export default [
  {
    path: '/settings/catalog',
    component: CatalogOptionsManager,
    meta: { allowedRoles: [ROLE_ADMIN] },
  },
];
