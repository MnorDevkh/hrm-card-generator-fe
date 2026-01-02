import GenerateCardComponent from '@/components/card-generator/GenerateCardComponent.vue'
import LecturerCardGenerator from '@/components/card-generator/LecturerCardGenerator.vue'
import TemplateList from '@/components/template/TemplateListComponent.vue'

const template = [
  { path: '/template', component: TemplateList },
  { path: '/generate', component: GenerateCardComponent },
  {
        path: '/card-generator/lecturer',
        name: 'lecturer-card-generator',
        component: LecturerCardGenerator
  }
]

export default template