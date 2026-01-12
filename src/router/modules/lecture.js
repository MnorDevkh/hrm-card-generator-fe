import LectureList from '@/components/lecture/LectureList.vue'
import StudentIdentityVerification from '@/components/student/StudentIdentityVerification.vue'
import StudentViewDetail from '@/components/student/StudentViewDetail.vue'

const lecture = [
  { path: '/lecture', component: LectureList },
  {
    path: '/lecturer-identity-verification/:id',
    name: 'LecturerIdentityVerification',
    component: StudentIdentityVerification,
    meta: { layout: "BlankLayout", isPublic: true },
  },
  {
    path: '/lecturers-detail/:id',
    name: 'LecturerViewDetail',
    component: StudentViewDetail,
    meta: { layout: "BlankLayout", isPublic: true },
  }
]

export default lecture