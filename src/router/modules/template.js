import GenerateCardComponent from '@/components/card-generator/GenerateCardComponent.vue'
import LecturerCardGenerator from '@/components/card-generator/LecturerCardGenerator.vue'
import StaffCardGenerator from '@/components/card-generator/StaffCardGenerator.vue'
import TemplateList from '@/components/template/TemplateListComponent.vue'
import { ROLE_ADMIN } from '@/utils/role';

const template = [
  { path: '/template', component: TemplateList, meta: { allowedRoles: [ROLE_ADMIN] } },
  { path: '/generate', component: GenerateCardComponent, meta: { allowedRoles: [ROLE_ADMIN] } },
  {
    path: '/card-generator/lecturer',
    name: 'lecturer-card-generator',
    component: LecturerCardGenerator,
    meta: { allowedRoles: [ROLE_ADMIN] }
  },
  {
    path: '/card-generator/staff',
    name: 'staff-card-generator',
    component: StaffCardGenerator,
    meta: { allowedRoles: [ROLE_ADMIN] }
  },
  {
    path: '/template/student-photos',
    name : 'student-photo-list',
    component : () => import('@/components/template/StudentPhotoListComponent.vue'),
    meta: { allowedRoles: [ROLE_ADMIN] }
  }
]

export default template