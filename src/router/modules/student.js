import StudentList from '@/components/student/StudentList.vue'
import StudentIdentityVerification from '@/components/student/StudentIdentityVerification.vue'
import StudentDetail from '@/components/student/StudentDetail.vue'

const student = [
  { path: '/student', component: StudentList }
  ,
  // You will also need a route for the final student detail page
  {
    path: '/students/:id',
    name: 'StudentIdentityVerification',
    component: StudentIdentityVerification
  },
   {
    path: '/students/:id/:identityId',
    name: 'StudentDetail',
    component: StudentDetail
  }
]



export default student