<template>
  <ConfigProvider :theme="{ token: { fontFamily: 'inherit' } }">
    <div
      :class="['w-full bg-gray-50 px-2 py-4 sm:p-6 lg:p-8', embedded ? 'w-full' : 'min-h-screen flex items-center justify-center']">
      <div class="w-full">
        <div v-if="isLoading" class="bg-white rounded-xl shadow-lg p-6 flex justify-center items-center">
          <Spin size="large" />
        </div>

        <div v-else-if="error" class=" mx-auto">
          <Alert type="error" show-icon :message="error" />
        </div>

        <div v-else-if="student">
          <div class="flex flex-col gap-3 sm:gap-4 lg:gap-6">
            <div
              class="bg-white rounded-lg sm:rounded-sm border border-gray-100 p-3 sm:p-4 lg:p-6 mb-3 sm:mb-4 lg:mb-6 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 lg:gap-6">
              <div class="flex-shrink-0">
                <Image v-if="student.photo" :src="getPhotoUrl(student.photo)" :width="100"
                  class="sm:w-[120px] rounded-lg object-cover shadow-sm" />
                <div v-else
                  class="w-[100px] h-[130px] sm:w-[120px] sm:h-[160px] bg-gray-100 rounded-lg flex items-center justify-center shadow-sm border border-gray-200">
                  <UserOutlined class="text-3xl sm:text-4xl text-gray-400" />
                </div>
              </div>
              <div class="text-center sm:text-left flex-1 min-w-0">
                <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 truncate">{{
                  student.name.english }}</h1>
                <h2 class="text-base sm:text-lg lg:text-xl text-gray-600 font-khmer mb-2 sm:mb-3">{{
                  student.name.khmer }}</h2>
                <div class="flex flex-wrap gap-1 sm:gap-2 justify-center sm:justify-start">
                  <span
                    class="px-2 sm:px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs sm:text-sm font-medium border border-blue-100">ID:
                    {{ student.card_id }}</span>
                  <span
                    class="px-2 sm:px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs sm:text-sm font-medium border border-purple-100">Batch:
                    {{ student.batch }}</span>
                </div>
              </div>

            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              <div>
                <h3 class="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-gray-800">
                  <UserOutlined />ព័ត៌មានផ្ទាល់ខ្លួន
                </h3>
                <Descriptions bordered :column="1" size="middle">
                  <Descriptions.Item label="ឈ្មោះខ្មែរ">{{ student.name.khmer }}</Descriptions.Item>
                  <Descriptions.Item label="ឈ្មោះឡាតាំង">{{ student.name.english }}</Descriptions.Item>
                  <Descriptions.Item label="លេខសម្គាល់កាត">{{ student.card_id }}</Descriptions.Item>
                  <Descriptions.Item label="លេខសម្គាល់ប្រព័ន្ធ">{{ student.id }}</Descriptions.Item>
                  <Descriptions.Item label="អត្ដសញ្ញាណបណ្ណ">{{ student.identity_id }}</Descriptions.Item>
                  <Descriptions.Item label="ភេទ">{{ student.gender }}</Descriptions.Item>
                  <Descriptions.Item label="ថ្ងៃខែឆ្នាំកំណើត">{{ formatDate(student.birth_date) }}</Descriptions.Item>
                  <Descriptions.Item label="ទូរសព្ទលេខ">{{ student.phone }}</Descriptions.Item>
                  <Descriptions.Item label="អ៊ីម៉ែល">{{ student.email || '-' }}</Descriptions.Item>
                  <Descriptions.Item label="ទីកន្លែងកំណើត">{{ formatAddress(student.birth_place) }}</Descriptions.Item>
                  <Descriptions.Item label="អាសយដ្ឋានបច្ចុប្បន្ន">{{ formatAddress(student.current_address) }}
                  </Descriptions.Item>
                </Descriptions>
              </div>
              <div>
                <h3 class="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-gray-800">
                  <BookOutlined /> ព័ត៌មានសិក្សា
                </h3>
                <Descriptions bordered :column="1" size="middle">
                  <Descriptions.Item label="មហាវិទ្យាល័យ">{{ student.faculty }}</Descriptions.Item>
                  <Descriptions.Item label="មុខជំនាញ">{{ student.major }}</Descriptions.Item>
                  <Descriptions.Item label="វេនសិក្សា">{{ student.study_shift }}</Descriptions.Item>
                  <Descriptions.Item label="ជំនាន់ទី">{{ student.batch }}</Descriptions.Item>
                  <Descriptions.Item label="បញ្ចប់ការសិក្សាថ្នាក់">{{ student.education_level }}</Descriptions.Item>
                  <Descriptions.Item label="អតីតសិស្ស/និស្សិត">{{ student.high_school }}</Descriptions.Item>
                  <Descriptions.Item label="ឆ្នាំបញ្ចប់ BacII">{{ student.bacII_year }}</Descriptions.Item>
                </Descriptions>
              </div>
              <div>
                <h3 class="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-gray-800">
                  <TeamOutlined /> ព័ត៌មានអាណាព្យាបាល
                </h3>
                <Descriptions bordered :column="1" size="middle">
                  <Descriptions.Item label="ឈ្មោះអាណាព្យាបាល">{{ student.guardian?.name || '-' }}</Descriptions.Item>
                  <Descriptions.Item label="លេខទូរសព្ទ">{{ student.guardian?.phone || '-' }}</Descriptions.Item>
                </Descriptions>
              </div>
              <div>
                <h3 class="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-gray-800">
                  <StarOutlined /> ព័ត៌មានអាហារូបករណ៍
                </h3>
                <Descriptions bordered :column="1" size="middle">
                  <Descriptions.Item label="ប្រភេទអាហារូបករណ៍">{{ student.scholarship_type || '-' }}</Descriptions.Item>
                  <Descriptions.Item label="លេខសម្គាល់ប័ណ្ណ">{{ student.scholarship_card_id || '-' }}</Descriptions.Item>
                  <Descriptions.Item label="ស្ថាប័នឧបត្ថម">{{ student.scholarship_by || '-' }}</Descriptions.Item>
                </Descriptions>
              </div>
            </div>
            <div
              class="bg-gray-50 px-4 py-4 text-center border-t border-gray-200 ">
              <p class="text-xs sm:text-sm text-gray-600  font-khmer leading-relaxed">
                <span class="font-semibold">©​copyright 2026 </span>
                ទំនាក់ទំនងផ្នែកបច្ចេកទេស <span class="font-bold">លោកសាស្រ្ដាចារ្យជំនួយ ផាត់ ឧត្ដម</span>
                ជាព្រឹទ្ធបុរសជំនួយ មហាវិទ្យាល័យព័ត៌មានវិទ្យា
                និងជាប្រធានការិយាល័យបច្ចេកទេសព័ត៌មានវិទ្យា
              </p>
              <button @click="openPopup"
                class="inline-flex items-center justify-center mt-2 gap-2 text-blue-600 hover:text-blue-700  transition duration-200">
                <i class="pi pi-telegram text-lg"></i>
                <span class="underline font-semibold font-khmer">នេះជាតំណក្រុមតេលេក្រាម</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ConfigProvider>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { Spin, Alert, Card, Descriptions, Image, ConfigProvider } from 'ant-design-vue';
import { UserOutlined, BookOutlined, TeamOutlined, StarOutlined, CheckCircleOutlined } from '@ant-design/icons-vue';
import { getStudentInfo } from '../../service/student.service';
import { environment } from '../../environments/environment';

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

const getPhotoUrl = (photo) => (photo ? `${environment.apiBaseUrl}media/image/${photo}` : '');

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString.split(' ')[0]).toLocaleDateString('en-GB');
};

const formatDateEN = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString.split(' ')[0]);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

const formatDateKH = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString.split(' ')[0]);
  const khmerMonths = ['ខែមករា', 'ខែកុម្ភៈ', 'ខែមីនា', 'ខែមេសា', 'ខែឧសភា', 'ខែមិថុនា', 'ខែកក្កដា', 'ខែសីហា', 'ខែកញ្ញា', 'ខែតុលា', 'ខែវិច្ឆិកា', 'ខែធ្នូ'];
  return `${date.getDate()} ${khmerMonths[date.getMonth()]} ${date.getFullYear()}`;
};

const formatAddress = (addr) => {
  if (!addr) return '-';
  const parts = [addr.village, addr.commune, addr.district, addr.province];
  return parts.filter(Boolean).join(', ') || '-';
};
const openPopup = () => {
  window.open('https://t.me/+6DdPPMitSdViMWVl', '_blank');
};

const submitVerification = () => {
  const vId = verificationId.value.trim();

  if (studentId.value && vId) {
    router.push({ path: `/students-detail/${studentId.value}`, query: { verificationId: vId } });
  } else {
    toast.add({ severity: 'warn', summary: 'Input Required', detail: 'Please enter your Card ID or National Identity', life: 3000 });
  }
};
</script>

<style scoped></style>