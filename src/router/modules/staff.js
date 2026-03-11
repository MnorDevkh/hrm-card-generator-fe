import StaffList from '@/components/staff/StaffList.vue'
import StaffIdentityVerification from '@/components/staff/StaffIdentityVerification.vue'
import StaffViewDetail from '@/components/staff/StaffViewDetail.vue'
import { ROLE_ADMIN, ROLE_MANAGE_STAFF } from '@/utils/role';

const staff = [
  { path: '/staff', component: StaffList, meta: { allowedRoles: [ROLE_ADMIN, ROLE_MANAGE_STAFF] } },
  {
    path: '/staff-identity-verification/:id',
    name: 'StaffIdentityVerification',
    component: StaffIdentityVerification,
    meta: { layout: "BlankLayout", isPublic: true },
  },
  {
    path: '/staff-detail-view/:id',
    name: 'StaffViewDetail',
    component: StaffViewDetail,
    meta: { layout: "BlankLayout", isPublic: true },
  }
]

export default staff
