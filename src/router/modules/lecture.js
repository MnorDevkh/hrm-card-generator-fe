import LectureList from '@/components/lecture/LectureList.vue'
import LecturerIdentityVerification from '@/components/lecture/LecturerIdentityVerification.vue'
import LecturerViewDetail from '@/components/lecture/LecturerViewDetail.vue'
import { ROLE_ADMIN, ROLE_MANAGE_LECTURER } from '@/utils/role';

const lecture = [
  { path: '/lecture', component: LectureList, meta: { allowedRoles: [ROLE_ADMIN, ROLE_MANAGE_LECTURER] } },
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