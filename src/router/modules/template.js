import GenerateCardComponent from '@/components/card-generator/GenerateCardComponent.vue'
import LecturerCardGenerator from '@/components/card-generator/LecturerCardGenerator.vue'
import StaffCardGenerator from '@/components/card-generator/StaffCardGenerator.vue'
import TemplateList from '@/components/template/TemplateListComponent.vue'

const template = [
  { path: '/template', component: TemplateList },
  { path: '/generate', component: GenerateCardComponent },
  {
    path: '/card-generator/lecturer',
    name: 'lecturer-card-generator',
    component: LecturerCardGenerator
  },
  {
    path: '/card-generator/staff',
    name: 'staff-card-generator',
    component: StaffCardGenerator
  },
  {
    path: '/template/student-photos',
    name : 'student-photo-list',
    component : () => import('@/components/template/StudentPhotoListComponent.vue')
  }
]

export default template