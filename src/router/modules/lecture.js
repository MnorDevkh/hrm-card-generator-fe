import LectureList from '@/components/lecture/LectureList.vue'
import LecturerIdentityVerification from '@/components/lecture/LecturerIdentityVerification.vue'
import LecturerViewDetail from '@/components/lecture/LecturerViewDetail.vue'

const lecture = [
  { path: '/lecture', component: LectureList },
  {
    path: '/lecturer-identity-verification/:id',
    name: 'LecturerIdentityVerification',
    component: LecturerIdentityVerification,
    meta: { layout: "BlankLayout", isPublic: true },
  },
  {
    path: '/Lecturer-detail-view/:id',
    name: 'Lecturer-detail-view',
    component: LecturerViewDetail,
    meta: { layout: "BlankLayout", isPublic: true },
  }
]

export default lecture