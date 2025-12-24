import StudentList from '@/components/student/StudentList.vue'
import StudentIdentityVerification from '@/components/student/StudentIdentityVerification.vue'
import StudentDetail from '@/components/student/StudentDetail.vue'

const student = [
  { path: '/student', component: StudentList }
  ,
  // You will also need a route for the final student detail page
  {
    path: '/student-identity-verification/:id',
    name: 'StudentIdentityVerification',
    component: StudentIdentityVerification,
    meta: { layout: "BlankLayout" },
  },
   {
    path: '/students-detail/:id/:identityId',
    name: 'StudentDetail',
    component: StudentDetail,
    meta: { layout: "BlankLayout" },
  }
]



export default student