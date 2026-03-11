<template>
  <ConfigProvider :theme="{ token: { fontFamily: 'inherit' } }">
    <div
      :class="['w-full bg-gray-50 px-2 py-4 sm:p-6 lg:p-8', embedded ? 'w-full' : 'min-h-screen flex items-center justify-center']">
      <div class="w-full">
        <div v-if="!staff" class="bg-white rounded-xl shadow-lg p-6 flex justify-center items-center">
          <Spin size="large" />
        </div>

        <div v-else>
          <div class="flex flex-col gap-3 sm:gap-4 lg:gap-6">
            <div
              class="bg-white rounded-lg sm:rounded-sm border border-gray-100 p-3 sm:p-4 lg:p-6 mb-3 sm:mb-4 lg:mb-6 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 lg:gap-6">
              <div class="flex-shrink-0">
                <Image v-if="staff.identity?.photo" :src="getPhotoUrl(staff.identity.photo)" :width="100"
                  class="sm:w-[120px] rounded-lg object-cover shadow-sm" />
                <div v-else
                  class="w-[100px] h-[130px] sm:w-[120px] sm:h-[160px] bg-gray-100 rounded-lg flex items-center justify-center shadow-sm border border-gray-200">
                  <UserOutlined class="text-3xl sm:text-4xl text-gray-400" />
                </div>
              </div>
              <div class="flex-1 min-w-0 w-full">
                <div class="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                  <div class="text-center sm:text-left flex-1 min-w-0">
                    <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 truncate">
                      {{ staff.identity?.en_name }}
                    </h1>
                    <h2 class="text-base sm:text-lg lg:text-xl text-gray-600 font-khmer mb-2 sm:mb-3">
                      {{ staff.identity?.kh_name }}
                    </h2>
                    <div class="flex flex-wrap gap-1 sm:gap-2 justify-center sm:justify-start">
                      <span
                        class="px-2 sm:px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs sm:text-sm font-medium border border-blue-100">ID:
                        {{ staff.identity?.employee_id }}</span>
                      <span v-if="staff.employment?.department"
                        class="px-2 sm:px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs sm:text-sm font-medium border border-purple-100">Department:
                        {{ staff.employment.department }}</span>
                    </div>
                  </div>
                  <div class="flex flex-wrap sm:flex-col items-center sm:items-end justify-center sm:justify-start gap-2">
                    <Button size="small" @click="emit('back')">
                      <template #icon>
                        <ArrowLeftOutlined />
                      </template>
                      Back to List
                    </Button>
                    <Button size="small" type="primary" ghost @click="emit('edit', staff)">
                      <template #icon>
                        <EditOutlined />
                      </template>
                      Edit
                    </Button>
                    <Button v-if="isAdmin" size="small" danger type="primary" @click="emit('delete', staff)">
                      <template #icon>
                        <DeleteOutlined />
                      </template>
                      Delete
                    </Button>
                  </div>
                </div>
              </div>

            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 class="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-gray-800">
                  <UserOutlined /> Identity
                </h3>
                <Descriptions bordered :column="1" size="middle">
                  <Descriptions.Item label="Employee ID">{{ staff.identity?.employee_id }}</Descriptions.Item>
                  <Descriptions.Item label="Name (Khmer)">{{ staff.identity?.kh_name }}</Descriptions.Item>
                  <Descriptions.Item label="Name (English)">{{ staff.identity?.en_name }}</Descriptions.Item>
                  <Descriptions.Item label="Gender">{{ staff.identity?.gender }}</Descriptions.Item>
                  <Descriptions.Item label="Nationality">{{ staff.identity?.nationality }}</Descriptions.Item>
                  <Descriptions.Item label="Nationality ID">{{ staff.identity.nationality_id }}</Descriptions.Item>
                  <Descriptions.Item label="Marital Status">{{ staff.identity?.marital_status }}</Descriptions.Item>
                  <Descriptions.Item label="Date of Birth">{{ formatDate(staff.identity?.date_of_birth) }}</Descriptions.Item>
                </Descriptions>
              </div>
              <div>
                <h3 class="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-gray-800">
                  <BookOutlined /> Contact
                </h3>
                <Descriptions bordered :column="1" size="middle">
                  <Descriptions.Item label="Phone">{{ staff.contact?.phone }}</Descriptions.Item>
                  <Descriptions.Item label="Email">{{ staff.contact?.email }}</Descriptions.Item>
                  <Descriptions.Item label="Address">{{ staff.contact?.address }}</Descriptions.Item>
                  <Descriptions.Item label="Emergency Contact">{{ staff.contact?.emergency_contact }}</Descriptions.Item>
                </Descriptions>
              </div>
              <div>
                <h3 class="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-gray-800">
                  <BookOutlined /> Employment
                </h3>
                <Descriptions bordered :column="1" size="middle">
                  <Descriptions.Item label="Position">{{ staff.employment?.position }}</Descriptions.Item>
                  <Descriptions.Item label="Department">{{ staff.employment?.department }}</Descriptions.Item>
                  <Descriptions.Item label="Subject">{{ staff.employment?.subject || '-' }}</Descriptions.Item>
                  <Descriptions.Item label="Employee Type">{{ staff.employment?.employee_type }}</Descriptions.Item>
                  <Descriptions.Item label="Employment Type">{{ staff.employment?.employment_type }}</Descriptions.Item>
                  <Descriptions.Item label="Date of Hire">{{ formatDate(staff.employment?.date_of_hire) }}</Descriptions.Item>
                  <Descriptions.Item label="Work Shift">{{ staff.employment?.work_shift }}</Descriptions.Item>
                  <Descriptions.Item label="Supervisor">{{ staff.employment?.supervisor }}</Descriptions.Item>
                  <Descriptions.Item label="Status">{{ staff.employment?.status }}</Descriptions.Item>
                </Descriptions>
              </div>
              <div>
                <h3 class="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-gray-800">
                  <BookOutlined /> Education & Legal
                </h3>
                <Descriptions bordered :column="1" size="middle">
                  <Descriptions.Item label="Education Level">{{ staff.education?.education_level }}</Descriptions.Item>
                  <Descriptions.Item label="Major">{{ staff.education?.major }}</Descriptions.Item>
                  <Descriptions.Item label="Teaching Experience">{{ staff.education?.teaching_experience }}</Descriptions.Item>
                  <Descriptions.Item label="Skills">{{ staff.education?.skills }}</Descriptions.Item>
                  <Descriptions.Item label="Training">{{ staff.education?.training }}</Descriptions.Item>
                  <Descriptions.Item label="ID Card">{{ staff.legal?.id_card }}</Descriptions.Item>
                  <Descriptions.Item label="Contract No">{{ staff.legal?.contract_no }}</Descriptions.Item>
                  <Descriptions.Item label="Contract Period">{{ formatDate(staff.legal?.contract_start) }} – {{ formatDate(staff.legal?.contract_end) }}</Descriptions.Item>
                </Descriptions>
              </div>
              <div>
                <h3 class="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-gray-800">
                  <BookOutlined /> Salary & HR
                </h3>
                <Descriptions bordered :column="1" size="middle">
                  <Descriptions.Item label="Basic Salary">{{ staff.salary?.basic_salary }}</Descriptions.Item>
                  <Descriptions.Item label="Allowance">{{ staff.salary?.allowance }}</Descriptions.Item>
                  <Descriptions.Item label="Payment Method">{{ staff.salary?.payment_method }}</Descriptions.Item>
                  <Descriptions.Item label="Performance">{{ staff.hr?.performance }}</Descriptions.Item>
                  <Descriptions.Item label="Note">{{ staff.hr?.note || '-' }}</Descriptions.Item>
                </Descriptions>
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
import { ConfigProvider, Descriptions, Image, Button, Spin } from 'ant-design-vue';
import { UserOutlined, BookOutlined, FileTextOutlined, ArrowLeftOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import { environment } from '../../environments/environment';

const props = defineProps({
    staff: Object,
    embedded: {
        type: Boolean,
        default: true
    }
});

const emit = defineEmits(['back', 'edit', 'delete']);

const isAdmin = localStorage.getItem('role') === 'admin_hrm';

const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
};

const getPhotoUrl = (photo) => (photo ? `${environment.apiBaseUrl}media/image/${photo}` : '');

const openPopup = () => {
  window.open('https://t.me/+6DdPPMitSdViMWVl', '_blank');
};
</script>
