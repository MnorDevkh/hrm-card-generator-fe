<template>
  <ConfigProvider :theme="{ token: { fontFamily: 'inherit' } }">
    <div
      :class="['w-full bg-gray-50 px-2 py-4 sm:p-6 lg:p-8', embedded ? 'w-full' : 'min-h-screen flex items-center justify-center']">
      <div class="w-full">
        <div v-if="lecture">
          <div class="flex flex-col gap-3 sm:gap-4 lg:gap-6">
            <div
              class="bg-white rounded-lg sm:rounded-sm border border-gray-100 p-3 sm:p-4 lg:p-6 mb-3 sm:mb-4 lg:mb-6 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 lg:gap-6">
              <div class="flex-shrink-0">
                <Image v-if="lecture.photo" :src="getPhotoUrl(lecture.photo)" :width="100"
                  class="sm:w-[120px] rounded-lg object-cover shadow-sm" />
                <div v-else
                  class="w-[100px] h-[130px] sm:w-[120px] sm:h-[160px] bg-gray-100 rounded-lg flex items-center justify-center shadow-sm border border-gray-200">
                  <UserOutlined class="text-3xl sm:text-4xl text-gray-400" />
                </div>
              </div>
              <div class="text-center sm:text-left flex-1 min-w-0">
                <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 truncate">{{
                  lecture.name?.english }}</h1>
                <h2 class="text-base sm:text-lg lg:text-xl text-gray-600 font-khmer mb-2 sm:mb-3">{{
                  lecture.name?.khmer }}</h2>
                <div class="flex flex-wrap gap-1 sm:gap-2 justify-center sm:justify-start">
                  <span
                    class="px-2 sm:px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs sm:text-sm font-medium border border-blue-100">ID:
                    {{ lecture.card_id }}</span>
                  <span v-if="lecture.faculty"
                    class="px-2 sm:px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs sm:text-sm font-medium border border-purple-100">Faculty:
                    {{ lecture.faculty }}</span>
                </div>
              </div>

            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 class="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-gray-800">
                  <UserOutlined /> Personal Information
                </h3>
                <Descriptions bordered :column="1" size="middle">
                  <Descriptions.Item label="Name (Khmer)">{{ lecture.name?.khmer }}</Descriptions.Item>
                  <Descriptions.Item label="Name (English)">{{ lecture.name?.english }}</Descriptions.Item>
                  <Descriptions.Item label="Card ID">{{ lecture.card_id }}</Descriptions.Item>
                  <Descriptions.Item label="Identity ID">{{ lecture.identity_id }}</Descriptions.Item>
                  <Descriptions.Item label="Gender">{{ lecture.gender }}</Descriptions.Item>
                  <Descriptions.Item label="Nationality">{{ lecture.nationality }}</Descriptions.Item>
                  <Descriptions.Item label="Date of Birth">{{ formatDate(lecture.birth_date) }}</Descriptions.Item>
                  <Descriptions.Item label="Birth Place">{{ formatAddress(lecture.birth_place) }}</Descriptions.Item>
                  <Descriptions.Item label="Current Address">{{ formatAddress(lecture.current_address) }}
                  </Descriptions.Item>
                </Descriptions>
              </div>
              <div>
                <h3 class="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-gray-800">
                  <BookOutlined /> Professional Information
                </h3>
                <Descriptions bordered :column="1" size="middle">
                  <Descriptions.Item label="Faculty">{{ lecture.faculty }}</Descriptions.Item>
                  <Descriptions.Item label="Major">{{ lecture.major }}</Descriptions.Item>
                  <Descriptions.Item label="Education">{{ formatEducation(lecture.education) }}</Descriptions.Item>
                  <Descriptions.Item label="Phone">{{ lecture.phone }}</Descriptions.Item>
                  <Descriptions.Item label="Email">{{ lecture.email }}</Descriptions.Item>
                  <Descriptions.Item label="Notes">{{ lecture.notes || '-' }}</Descriptions.Item>
                </Descriptions>
              </div>
              <div v-if="lecture.docs && lecture.docs.length" class="md:col-span-2">
                <h3 class="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-gray-800">
                  <FileTextOutlined /> Documents
                </h3>
                <div class="bg-white rounded-lg border border-gray-200 p-4">
                  <div v-for="(doc, index) in lecture.docs" :key="index" class="mb-2 last:mb-0">
                    <a href="#" @click.prevent="downloadFile(doc.file_path)"
                      class="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-2">
                      <i class="pi pi-file"></i>
                      {{ doc.file_path ? doc.file_path.split('/').pop() : 'Document ' + (index + 1) }}
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-4 text-center border-t border-gray-200 ">
              <p class="text-xs sm:text-sm text-gray-600  font-khmer leading-relaxed">
                <span class="font-semibold">©​copyright 2026 </span>
                ទំនាក់ទំនងផ្នែកបច្ចេកទេស <span class="font-bold">លោក ផាត់ ឧត្ដម</span>
                ជាព្រឹទ្ធបុរសជំនួយមហាវិទ្យាល័យព័ត៌មានវិទ្យា
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
import { ConfigProvider, Descriptions, Image } from 'ant-design-vue';
import { UserOutlined, BookOutlined, FileTextOutlined } from '@ant-design/icons-vue';
import { environment } from '../../environments/environment';

defineProps({
    lecture: Object,
    embedded: {
        type: Boolean,
        default: true
    }
});

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const datePart = typeof dateString === 'string' && dateString.includes(' ') ? dateString.split(' ')[0] : dateString;
  const m = String(datePart).match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (m) return `${String(parseInt(m[3], 10)).padStart(2, '0')}-${String(parseInt(m[2], 10)).padStart(2, '0')}-${m[1]}`;
  const d = new Date(datePart);
  if (isNaN(d)) return '-';
  return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
};

const formatAddress = (address) => {
    if (!address) return '';
    const parts = [address.village, address.commune, address.district, address.province];
    return parts.filter(part => part).join(', ');
};

const formatEducation = (education) => {
    if (!education) return '';
    const parts = [education.level, education.year, education.training_institution];
    return parts.filter(part => part).join(' - ');
};

const getPhotoUrl = (photo) => (photo ? `${environment.apiBaseUrl}media/image/${photo}` : '');

const getFileUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${environment.apiBaseUrl}${path}`;
};

const downloadFile = async (filePath) => {
    if (!filePath) return;
    const url = getFileUrl(filePath);
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = filePath.split('/').pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
    } catch (error) {
        window.open(url, '_blank');
    }
};

const openPopup = () => {
  window.open('https://t.me/+6DdPPMitSdViMWVl', '_blank');
};
</script>