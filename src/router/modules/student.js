import StudentList from '@/components/student/StudentList.vue'
import StudentIdentityVerification from '@/components/student/StudentIdentityVerification.vue'
import StudentViewDetail from '@/components/student/StudentViewDetail.vue'

const student = [
  { path: '/student', component: StudentList },
  // You will also need a route for the final student detail page
  {
    path: '/student-identity-verification/:id',
    name: 'StudentIdentityVerification',
    component: StudentIdentityVerification,
    meta: { layout: "BlankLayout" , isPublic: true},
  },
   {
    path: '/students-detail/:id',
    name: 'StudentViewDetail',
    component: StudentViewDetail,
    meta: { layout: "BlankLayout", isPublic: true },
  }
]

export default student