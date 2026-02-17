<template>
  <ConfigProvider :theme="{ token: { fontFamily: 'inherit' } }">
  <div class="form-container">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- 1. Identity Information -->
      <div class="col-span-1 md:col-span-2">
        <h3 class="text-lg font-bold text-gray-700 dark:text-gray-200 border-b pb-2 mb-4">Identity Information</h3>
      </div>

      <!-- Photo -->
      <div class="col-span-1 md:col-span-2 flex justify-center mb-6">
        <div class="relative">
          <div class="w-32 h-32 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center">
            <img v-if="form.identity.photo" :src="getPhotoUrl(form.identity.photo)" alt="Profile" class="w-full h-full object-cover" />
            <i v-else class="pi pi-user text-4xl text-gray-400"></i>
          </div>
          <Upload :show-upload-list="false" :customRequest="uploadPhoto" accept="image/*" class="absolute bottom-0 right-0">
            <Button shape="circle" type="primary" size="small">
              <template #icon><EditOutlined /></template>
            </Button>
          </Upload>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <label>Employee ID</label>
        <Input v-model:value="form.identity.employee_id" />
      </div>
       <div class="flex flex-col gap-2">
        <label>Name (English)</label>
        <Input v-model:value="form.identity.en_name" />
      </div>
      <div class="flex flex-col gap-2">
        <label>Name (Khmer)</label>
        <Input v-model:value="form.identity.kh_name" />
      </div>
      <div class="flex flex-col gap-2">
        <label>Gender</label>
        <Select v-model:value="form.identity.gender" placeholder="Select Gender">
          <SelectOption value="Male">Male</SelectOption>
          <SelectOption value="Female">Female</SelectOption>
        </Select>
      </div>
      <div class="flex flex-col gap-2">
        <label>Date of Birth</label>
        <DatePicker v-model:value="form.identity.date_of_birth" valueFormat="YYYY-MM-DD" class="w-full" />
      </div>
      <div class="flex flex-col gap-2">
        <label>Nationality</label>
        <Input v-model:value="form.identity.nationality" />
      </div>
      <div class="flex flex-col gap-2">
        <label>Marital Status</label>
         <Select v-model:value="form.identity.marital_status">
          <SelectOption value="Single">Single</SelectOption>
          <SelectOption value="Married">Married</SelectOption>
          <SelectOption value="Divorced">Divorced</SelectOption>
          <SelectOption value="Widowed">Widowed</SelectOption>
        </Select>
      </div>

      <!-- 2. Contact Information -->
      <div class="col-span-1 md:col-span-2 mt-4">
        <h3 class="text-lg font-bold text-gray-700 dark:text-gray-200 border-b pb-2 mb-4">Contact Information</h3>
      </div>
      <div class="flex flex-col gap-2"><label>Phone</label><Input v-model:value="form.contact.phone" /></div>
      <div class="flex flex-col gap-2"><label>Email</label><Input v-model:value="form.contact.email" /></div>
      <div class="flex flex-col gap-2"><label>Address</label><Input v-model:value="form.contact.address" /></div>
      <div class="flex flex-col gap-2"><label>Emergency Contact</label><Input v-model:value="form.contact.emergency_contact" /></div>

      <!-- 3. Employment Information -->
      <div class="col-span-1 md:col-span-2 mt-4">
        <h3 class="text-lg font-bold text-gray-700 dark:text-gray-200 border-b pb-2 mb-4">Employment Information</h3>
      </div>
      <div class="flex flex-col gap-2"><label>Position</label><Input v-model:value="form.employment.position" /></div>
      <div class="flex flex-col gap-2"><label>Department</label><Input v-model:value="form.employment.department" /></div>
      <div class="flex flex-col gap-2"><label>Subject (Teachers)</label><Input v-model:value="form.employment.subject" /></div>
      <div class="flex flex-col gap-2">
        <label>Employee Type</label>
        <Select v-model:value="form.employment.employee_type">
          <SelectOption value="Teacher">Teacher</SelectOption>
          <SelectOption value="Staff">Staff</SelectOption>
        </Select>
      </div>
      <div class="flex flex-col gap-2">
        <label>Employment Type</label>
         <Select v-model:value="form.employment.employment_type">
          <SelectOption value="Full-time">Full-time</SelectOption>
          <SelectOption value="Part-time">Part-time</SelectOption>
          <SelectOption value="Contract">Contract</SelectOption>
        </Select>
      </div>
      <div class="flex flex-col gap-2">
        <label>Date of Hire</label>
        <DatePicker v-model:value="form.employment.date_of_hire" valueFormat="YYYY-MM-DD" class="w-full" />
      </div>
      <div class="flex flex-col gap-2"><label>Work Shift</label><Input v-model:value="form.employment.work_shift" /></div>
      <div class="flex flex-col gap-2"><label>Supervisor</label><Input v-model:value="form.employment.supervisor" /></div>
       <div class="flex flex-col gap-2">
        <label>Status</label>
         <Select v-model:value="form.employment.status">
          <SelectOption value="Active">Active</SelectOption>
          <SelectOption value="Leave">Leave</SelectOption>
          <SelectOption value="Resigned">Resigned</SelectOption>
        </Select>
      </div>

      <!-- 4. Salary Information -->
      <div class="col-span-1 md:col-span-2 mt-4">
        <h3 class="text-lg font-bold text-gray-700 dark:text-gray-200 border-b pb-2 mb-4">Salary Information</h3>
      </div>
      <div class="flex flex-col gap-2"><label>Basic Salary</label><Input type="number" v-model:value="form.salary.basic_salary" /></div>
      <div class="flex flex-col gap-2"><label>Allowance</label><Input type="number" v-model:value="form.salary.allowance" /></div>
      <div class="flex flex-col gap-2"><label>Overtime Rate</label><Input type="number" v-model:value="form.salary.overtime_rate" /></div>
       <div class="flex flex-col gap-2">
        <label>Payment Method</label>
         <Select v-model:value="form.salary.payment_method">
          <SelectOption value="Cash">Cash</SelectOption>
          <SelectOption value="Bank">Bank</SelectOption>
        </Select>
      </div>
      <div class="flex flex-col gap-2"><label>Bank Account</label><Input v-model:value="form.salary.bank_account" /></div>


       <!-- 5. Legal Information -->
      <div class="col-span-1 md:col-span-2 mt-4">
        <h3 class="text-lg font-bold text-gray-700 dark:text-gray-200 border-b pb-2 mb-4">Legal Information</h3>
      </div>
       <div class="flex flex-col gap-2"><label>ID Card</label><Input v-model:value="form.legal.id_card" /></div>
       <div class="flex flex-col gap-2"><label>Contract No</label><Input v-model:value="form.legal.contract_no" /></div>
       <div class="flex flex-col gap-2"><label>Contract Start</label><DatePicker v-model:value="form.legal.contract_start" valueFormat="YYYY-MM-DD" class="w-full" /></div>
       <div class="flex flex-col gap-2"><label>Contract End</label><DatePicker v-model:value="form.legal.contract_end" valueFormat="YYYY-MM-DD" class="w-full" /></div>

       <!-- 6. Education and Skills -->
      <div class="col-span-1 md:col-span-2 mt-4">
        <h3 class="text-lg font-bold text-gray-700 dark:text-gray-200 border-b pb-2 mb-4">Education and Skills</h3>
      </div>
       <div class="flex flex-col gap-2"><label>Education Level</label><Input v-model:value="form.education.education_level" /></div>
       <div class="flex flex-col gap-2"><label>Major</label><Input v-model:value="form.education.major" /></div>
       <div class="flex flex-col gap-2"><label>Teaching Experience</label><Input v-model:value="form.education.teaching_experience" /></div>
       <div class="flex flex-col gap-2"><label>Skills</label><Input v-model:value="form.education.skills" /></div>
       <div class="flex flex-col gap-2"><label>Training</label><Input v-model:value="form.education.training" /></div>

      <!-- 7. HR Management -->
      <div class="col-span-1 md:col-span-2 mt-4">
        <h3 class="text-lg font-bold text-gray-700 dark:text-gray-200 border-b pb-2 mb-4">HR Management</h3>
      </div>
      <div class="flex flex-col gap-2"><label>Performance</label><Input v-model:value="form.hr.performance" /></div>
      <div class="col-span-1 md:col-span-2 flex flex-col gap-2">
        <label>Note</label>
        <Textarea v-model:value="form.hr.note" :rows="3" />
      </div>

    </div>

    <div class="flex justify-end gap-2 mt-6 pt-4 border-t">
      <Button @click="$emit('cancel')">
        <template #icon><CloseOutlined /></template>
        Cancel
      </Button>
      <Button type="primary" @click="save">
        <template #icon><CheckOutlined /></template>
        Save
      </Button>
    </div>
  </div>
  </ConfigProvider>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { Input, Textarea, Select, SelectOption, DatePicker, Button, ConfigProvider, Upload, message } from 'ant-design-vue';
import { CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons-vue';

const props = defineProps({
  staff: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['save', 'cancel']);

const form = ref({
  id: null,
  identity: {
    employee_id: '',
    kh_name: '',
    en_name: '',
    gender: '',
    date_of_birth: null,
    nationality: '',
    marital_status: '',
    photo: ''
  },
  contact: {
    phone: '',
    email: '',
    address: '',
    emergency_contact: ''
  },
  employment: {
    position: '',
    department: '',
    subject: '',
    employee_type: '',
    employment_type: '',
    date_of_hire: null,
    work_shift: '',
    supervisor: '',
    status: ''
  },
  salary: {
    basic_salary: 0,
    allowance: 0,
    overtime_rate: 0,
    payment_method: '',
    bank_account: ''
  },
  legal: {
    id_card: '',
    contract_no: '',
    contract_start: null,
    contract_end: null
  },
  education: {
    education_level: '',
    major: '',
    teaching_experience: '',
    skills: '',
    training: ''
  },
  hr: {
    performance: '',
    note: ''
  }
});

const initForm = () => {
  if (props.staff && Object.keys(props.staff).length > 0) {
    form.value = {
      ...form.value,
      ...JSON.parse(JSON.stringify(props.staff)),
      identity: { ...form.value.identity, ...(props.staff.identity || {}) },
      contact: { ...form.value.contact, ...(props.staff.contact || {}) },
      employment: { ...form.value.employment, ...(props.staff.employment || {}) },
      salary: { ...form.value.salary, ...(props.staff.salary || {}) },
      legal: { ...form.value.legal, ...(props.staff.legal || {}) },
      education: { ...form.value.education, ...(props.staff.education || {}) },
      hr: { ...form.value.hr, ...(props.staff.hr || {}) },
    };
  }
};

const getPhotoUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `https://cardsystemapi.aga-institute.edu.kh/media/image/${path}`;
};

const uploadPhoto = async ({ file, onSuccess, onError }) => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('https://cardsystemapi.aga-institute.edu.kh/media/upload/?type_=staff_photo&related_id=0', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData
    });

    if (!response.ok) throw new Error('Upload failed');

    const data = await response.json();
    form.value.identity.photo = data.filename;
    onSuccess(data);
    message.success('Photo uploaded successfully');
  } catch (error) {
    onError(error);
    message.error('Failed to upload photo');
  }
};

watch(() => props.staff, initForm, { deep: true });

onMounted(() => {
  initForm();
});

const save = () => {
  emit('save', form.value);
};
</script>
