import GenerateCardComponent from '@/components/card-generator/GenerateCardComponent.vue'
import TemplateList from '@/components/template/TemplateListComponent.vue'

const template = [
  { path: '/template', component: TemplateList },
  { path: '/generate', component: GenerateCardComponent },
]

export default template