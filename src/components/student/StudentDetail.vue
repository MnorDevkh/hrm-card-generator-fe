<template>
  <div :class="['max-w-7xl mx-auto bg-white dark:bg-gray-900 p-4 sm:p-8', embedded ? '' : 'min-h-screen']">
    <div v-if="isLoading" class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex justify-center items-center">
      <i class="pi pi-spin pi-spinner text-blue-500" style="font-size: 3rem"></i>
    </div>

    <div v-else-if="error" class=" mx-auto">
      <div class="p-message p-message-error">
        <i class="pi pi-exclamation-triangle mr-2"></i>
        <span>{{ error }}</span>
      </div>
    </div>

    <div v-else-if="student" class="bg-blue-50 dark:bg-gray-800 rounded-xl shadow-lg p-6 ">
      <!-- Student Header -->
        <div class="bg-green-100 text-center dark:bg-green-900 text-green-700 dark:text-green-300 px-4 py-2 rounded-md flex items-center justify-center gap-2 border border-green-200 dark:border-green-700">
          <i class="pi pi-check-circle"></i>
          <span class="font-medium">បានផ្ទៀងផ្ទាត់ ទិន្នន័យត្រឹមត្រូវ</span>
        </div>
      <div class="mb-8 flex flex-col sm:flex-row items-center gap-6">
       
        <img
          v-if="student.photo"
          :src="getPhotoUrl(student.photo)"
          alt="Student Photo"
          class="w-32 h-40 object-cover rounded-lg shadow-md border-4 border-gray-200 dark:border-gray-700"
        />
        <div v-else class="w-32 h-40 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center shadow-md">
          <i class="pi pi-user text-6xl text-gray-400"></i>
        </div>
        <div class="text-center sm:text-left">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ student.name.english }}</h1>
          <p class="text-2xl text-gray-600 dark:text-gray-300">{{ student.name.khmer }}</p>
          <div class="mt-2 flex items-center justify-center sm:justify-start gap-4 text-gray-500 dark:text-gray-400">
            <span class="flex items-center gap-2"><i class="pi pi-id-card"></i> {{ student.card_id }}</span>
            <span class="flex items-center gap-2"><i class="pi pi-bookmark"></i> Batch: {{ student.batch }}</span>
            <span class="flex items-center gap-2"><i class="pi pi-tag"></i> ID: {{ student.identity_id }}</span>
          </div>
        </div>
      </div>

      <!-- Details Grid: responsive 1 / 2 / 3 columns -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <InfoCard title="Personal Information">
          <InfoItem icon="pi-hashtag" label="System ID" :value="student.id" :full-width="true" />
          <InfoItem icon="pi-id-card" label="National Identity" :value="student.identity_id" />
          <InfoItem icon="pi-user" label="Gender" :value="student.gender" />
          <InfoItem icon="pi-calendar" label="Date of Birth" :value="formatDate(student.birth_date)" />
          <InfoItem icon="pi-phone" label="Phone" :value="student.phone" />
          <InfoItem icon="pi-envelope" label="Email" :value="student.email || '-'" :full-width="true" />
          <InfoItem icon="pi-map-marker" label="Birth Place" :value="formatAddress(student.birth_place)" :full-width="true" />
          <InfoItem icon="pi-home" label="Current Address" :value="formatAddress(student.current_address)" :full-width="true" />
        </InfoCard>

        <InfoCard title="Guardian Information">
          <InfoItem icon="pi-users" label="Guardian Name" :value="student.guardian.name" />
          <InfoItem icon="pi-mobile" label="Guardian Phone" :value="student.guardian.phone" />
        </InfoCard>

        <InfoCard title="Academic Information">
          <InfoItem icon="pi-building" label="Faculty" :value="student.faculty" />
          <InfoItem icon="pi-book" label="Major" :value="student.major" />
          <InfoItem icon="pi-clock" label="Study Shift" :value="student.study_shift" />
          <InfoItem icon="pi-sitemap" label="Batch" :value="student.batch" />
          <InfoItem icon="pi-verified" label="Education Level" :value="student.education_level" />
        </InfoCard>

        <InfoCard title="High School Background">
          <InfoItem icon="pi-flag" label="High School" :value="student.high_school" />
          <InfoItem icon="pi-calendar-plus" label="BacII Year" :value="student.bacII_year" />
          <InfoItem icon="pi-file" label="BacII Code" :value="student.bacII_code" />
          <InfoItem icon="pi-check-circle" label="BacII Result" :value="student.bacII_result" />
        </InfoCard>

        <InfoCard title="Scholarship Information">
          <InfoItem icon="pi-star" label="Type" :value="student.scholarship_type" />
          <InfoItem icon="pi-ticket" label="Card ID" :value="student.scholarship_card_id" />
          <InfoItem icon="pi-user-minus" label="Bye" :value="student.scholarship_bye || '-'" />
        </InfoCard>

        <InfoCard title="Other Information">
          <InfoItem icon="pi-align-left" label="Notes" :value="student.notes || '-'" :full-width="true" />
        </InfoCard>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';
import { getStudentInfo } from '../../service/student.service';
import { environment } from '../../environments/environment';

const InfoCard = defineAsyncComponent(() => import('./InfoCard.vue'));
const InfoItem = defineAsyncComponent(() => import('./InfoItem.vue'));

const route = useRoute();
const student = ref(null);
const isLoading = ref(true);
const error = ref(null);

const props = defineProps({
  studentId: {
    type: [String, Number],
    default: null
  },
  verificationId: {
    type: [String, Number],
    default: null
  },
  embedded: {
    type: Boolean,
    default: false
  }
});

onMounted(async () => {
  const studentId = props.studentId || route.params.id;
  let verificationId = props.verificationId || route.params.verificationId || route.query.verificationId;

  if (verificationId === 'null') verificationId = null;

  if (!studentId || !verificationId) {
    if (!props.embedded) error.value = 'Student ID or Verification ID is missing.';
    isLoading.value = false;
    return;
  }

  try {
    isLoading.value = true;
    const response = await getStudentInfo(studentId, verificationId);
    student.value = response;
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Failed to fetch student details.';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
});

const getPhotoUrl = (photo) => (photo ? `${environment.apiBaseUrl}upload_image/image/${photo}` : '');

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString.split(' ')[0]).toLocaleDateString('en-GB');
};

const formatAddress = (addr) => {
  if (!addr) return '-';
  const parts = [addr.village, addr.commune, addr.district, addr.province];
  return parts.filter(Boolean).join(', ') || '-';
};
</script>

<style scoped>
/* make overall page wider on large screens */
.student-photo { width: 7.5rem; height: 9.5rem; } /* default slightly bigger */
.student-meta .student-name-en { line-height: 1; }
.student-meta .student-name-kh { margin-top: 0.15rem; }
.student-meta { min-width: 0; } /* enable truncation */

@media (min-width: 640px) {
  .student-photo { width: 10rem; height: 12rem; }
  .student-name-en { font-size: 2.25rem; }
}
@media (min-width: 1024px) {
  .student-photo { width: 12rem; height: 15rem; }
  .student-name-en { font-size: 2.75rem; }
  .student-name-kh { font-size: 1.5rem; }
}
@media (min-width: 1280px) {
  .student-photo { width: 14rem; height: 17rem; }
  .student-name-en { font-size: 3rem; }
}
</style>