<template>
  <ConfigProvider :theme="{ token: { fontFamily: 'inherit' } }">
  <div class="form-container">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Profile Photo -->
      <div class="col-span-1 md:col-span-2 flex justify-center mb-6">
        <div class="relative">
          <div class="w-32 h-32 rounded-lg h-40 overflow-hidden bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center">
            <img v-if="form.identity?.photo" :src="getPhotoUrl(form.identity.photo)" alt="Profile" class="w-full h-full object-cover" />
            <i v-else class="pi pi-user text-4xl text-gray-400"></i>
          </div>
          <Upload :show-upload-list="false" :customRequest="uploadPhoto" accept="image/*" class="absolute bottom-0 right-0">
            <Button shape="circle" type="primary" size="small">
              <template #icon><EditOutlined /></template>
            </Button>
          </Upload>
        </div>
      </div>

      <!-- Identity -->
      <div class="col-span-1 md:col-span-2">
        <h3 class="text-lg font-bold text-gray-700 dark:text-gray-200 border-b pb-2 mb-4">{{ t('staff.sections.identity') }}</h3>
      </div>
      <div class="flex flex-col gap-2">
        <label>{{ t('staff.fields.employeeId') }}</label>
        <Input v-model:value="form.identity.employee_id" />
      </div>
      <div class="flex flex-col gap-2">
        <label>{{ t('staff.fields.nameEnglish') }}</label>
        <Input v-model:value="form.identity.en_name" />
      </div>
      <div class="flex flex-col gap-2">
        <label>{{ t('staff.fields.nameKhmer') }}</label>
        <Input v-model:value="form.identity.kh_name" />
      </div>
      <div class="flex flex-col gap-2">
        <label>{{ t('staff.fields.gender') }}</label>
        <Select v-model:value="form.identity.gender" :placeholder="t('common.selectGender')">
          <SelectOption value="Male">{{ t('common.male') }}</SelectOption>
          <SelectOption value="Female">{{ t('common.female') }}</SelectOption>
        </Select>
      </div>
      <div class="flex flex-col gap-2">
        <label>{{ t('staff.fields.dateOfBirth') }}</label>
        <DatePicker v-model:value="form.identity.date_of_birth" :valueFormat="dateFormat" class="w-full" />
      </div>
      <div class="flex flex-col gap-2">
        <label>{{ t('staff.fields.nationality') }}</label>
        <Input v-model:value="form.identity.nationality" />
      </div>
      <div class="flex flex-col gap-2">
        <label>{{ t('staff.fields.nationalityId') }}</label>
        <Input v-model:value="form.identity.nationality_id" :placeholder="t('staff.fields.nationalityIdPlaceholder')" />
      </div>
      <div class="flex flex-col gap-2">
        <label>{{ t('staff.fields.maritalStatus') }}</label>
        <Input v-model:value="form.identity.marital_status" :placeholder="t('staff.fields.maritalStatusPlaceholder')" />
      </div>

      <!-- Contact -->
      <div class="col-span-1 md:col-span-2 mt-4">
        <h3 class="text-lg font-bold text-gray-700 dark:text-gray-200 border-b pb-2 mb-4">{{ t('staff.sections.contact') }}</h3>
      </div>
      <div class="flex flex-col gap-2">
        <label>{{ t('staff.fields.phone') }}</label>
        <Input v-model:value="form.contact.phone" />
      </div>
      <div class="flex flex-col gap-2">
        <label>{{ t('staff.fields.email') }}</label>
        <Input v-model:value="form.contact.email" />
      </div>
      <div class="flex flex-col gap-2 md:col-span-2">
        <label>{{ t('staff.fields.address') }}</label>
        <Input v-model:value="form.contact.address" />
      </div>
      <div class="flex flex-col gap-2">
        <label>{{ t('staff.fields.emergencyContact') }}</label>
        <Input v-model:value="form.contact.emergency_contact" />
      </div>

      <!-- Employment -->
      <div class="col-span-1 md:col-span-2 mt-4">
        <h3 class="text-lg font-bold text-gray-700 dark:text-gray-200 border-b pb-2 mb-4">{{ t('staff.sections.employment') }}</h3>
      </div>
      <div class="flex flex-col gap-2">
        <label>{{ t('staff.fields.position') }}</label>
        <Input v-model:value="form.employment.position" />
      </div>
      <div class="flex flex-col gap-2">
        <label>{{ t('staff.fields.department') }}</label>
        <Input v-model:value="form.employment.department" />
      </div>
      <div class="flex flex-col gap-2">
        <label>{{ t('staff.fields.dateOfHire') }}</label>
        <DatePicker v-model:value="form.employment.date_of_hire" :valueFormat="dateFormat" class="w-full" />
      </div>
      <div class="flex flex-col gap-2">
        <label>{{ t('staff.fields.workShift') }}</label>
        <Input v-model:value="form.employment.work_shift" :placeholder="t('staff.fields.workShiftPlaceholder')" />
      </div>
      <div class="flex flex-col gap-2">
        <label>{{ t('staff.fields.status') }}</label>
        <Select v-model:value="form.employment.status" :placeholder="t('common.selectStatus')">
          <SelectOption value="Active">{{ t('common.active') }}</SelectOption>
          <SelectOption value="Inactive">{{ t('common.inactive') }}</SelectOption>
        </Select>
      </div>

      <!-- Salary -->
      <div class="col-span-1 md:col-span-2 mt-4">
        <h3 class="text-lg font-bold text-gray-700 dark:text-gray-200 border-b pb-2 mb-4">{{ t('staff.sections.salary') }}</h3>
      </div>
      <div class="flex flex-col gap-2">
        <label>{{ t('staff.fields.basicSalary') }}</label>
        <InputNumber v-model:value="form.salary.basic_salary" :min="0" class="w-full" />
      </div>
      <div class="flex flex-col gap-2">
        <label>{{ t('staff.fields.allowance') }}</label>
        <InputNumber v-model:value="form.salary.allowance" :min="0" class="w-full" />
      </div>
      <div class="flex flex-col gap-2">
        <label>{{ t('staff.fields.overtimeRate') }}</label>
        <InputNumber v-model:value="form.salary.overtime_rate" :min="0" class="w-full" />
      </div>
      <div class="flex flex-col gap-2">
        <label>{{ t('staff.fields.paymentMethod') }}</label>
        <Input v-model:value="form.salary.payment_method" :placeholder="t('staff.fields.paymentMethodPlaceholder')" />
      </div>
      <div class="flex flex-col gap-2">
        <label>{{ t('staff.fields.bankAccount') }}</label>
        <Input v-model:value="form.salary.bank_account" />
      </div>

      <!-- Legal -->
      <div class="col-span-1 md:col-span-2 mt-4">
        <h3 class="text-lg font-bold text-gray-700 dark:text-gray-200 border-b pb-2 mb-4">{{ t('staff.sections.legal') }}</h3>
      </div>
      <div class="flex flex-col gap-2">
        <label>{{ t('staff.fields.idCard') }}</label>
        <Input v-model:value="form.legal.id_card" />
      </div>
      <div class="flex flex-col gap-2">
        <label>{{ t('staff.fields.contractNo') }}</label>
        <Input v-model:value="form.legal.contract_no" />
      </div>
      <div class="flex flex-col gap-2">
        <label>{{ t('staff.fields.contractStart') }}</label>
        <DatePicker v-model:value="form.legal.contract_start" :valueFormat="dateFormat" class="w-full" />
      </div>
      <div class="flex flex-col gap-2">
        <label>{{ t('staff.fields.contractEnd') }}</label>
        <DatePicker v-model:value="form.legal.contract_end" :valueFormat="dateFormat" class="w-full" />
      </div>

      <!-- Education -->
      <div class="col-span-1 md:col-span-2 mt-4">
        <h3 class="text-lg font-bold text-gray-700 dark:text-gray-200 border-b pb-2 mb-4">{{ t('staff.sections.education') }}</h3>
      </div>
      <div class="flex flex-col gap-2">
        <label>{{ t('staff.fields.educationLevel') }}</label>
        <Input v-model:value="form.education.education_level" :placeholder="t('staff.fields.educationLevelPlaceholder')" />
      </div>
      <div class="flex flex-col gap-2">
        <label>{{ t('staff.fields.major') }}</label>
        <Input v-model:value="form.education.major" />
      </div>
      <div class="flex flex-col gap-2">
        <label>{{ t('staff.fields.experience') }}</label>
        <Input v-model:value="form.education.teaching_experience" />
      </div>
      <div class="flex flex-col gap-2">
        <label>{{ t('staff.fields.skills') }}</label>
        <Input v-model:value="form.education.skills" />
      </div>
      <div class="flex flex-col gap-2 md:col-span-2">
        <label>{{ t('staff.fields.training') }}</label>
        <Input v-model:value="form.education.training" />
      </div>

      <!-- HR -->
      <div class="col-span-1 md:col-span-2 mt-4">
        <h3 class="text-lg font-bold text-gray-700 dark:text-gray-200 border-b pb-2 mb-4">{{ t('staff.sections.hr') }}</h3>
      </div>
      <div class="flex flex-col gap-2">
        <label>{{ t('staff.fields.performance') }}</label>
        <Input v-model:value="form.hr.performance" :placeholder="t('staff.fields.performancePlaceholder')" />
      </div>
      <div class="col-span-1 md:col-span-2 flex flex-col gap-2">
        <label>{{ t('staff.fields.note') }}</label>
        <Textarea v-model:value="form.hr.note" :rows="3" />
      </div>
    </div>

    <div class="flex justify-end gap-2 mt-6 pt-4 border-t">
      <Button @click="$emit('cancel')">
        <template #icon><CloseOutlined /></template>
        {{ t('common.cancel') }}
      </Button>
      <Button type="primary" @click="save">
        <template #icon><CheckOutlined /></template>
        {{ t('common.save') }}
      </Button>
    </div>
  </div>
  </ConfigProvider>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { Input, InputNumber, Textarea, Select, SelectOption, DatePicker, Button, ConfigProvider, Upload, message } from 'ant-design-vue';
import { CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons-vue';
import { environment } from '../../environments/environment';
import { uploadImage } from '../../service/image.service';

const { t } = useI18n();
const dateFormat = 'YYYY-MM-DD';

const props = defineProps({
  staff: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['save', 'cancel']);

const emptyIdentity = () => ({
  employee_id: '',
  kh_name: '',
  en_name: '',
  gender: '',
  date_of_birth: null,
  nationality: '',
  nationality_id: '',
  marital_status: '',
  photo: ''
});

const emptyContact = () => ({
  phone: '',
  email: '',
  address: '',
  emergency_contact: ''
});

const emptyEmployment = () => ({
  position: '',
  department: '',
  date_of_hire: null,
  work_shift: '',
  status: 'Active'
});

const emptySalary = () => ({
  basic_salary: undefined,
  allowance: undefined,
  overtime_rate: undefined,
  payment_method: '',
  bank_account: ''
});

const emptyLegal = () => ({
  id_card: '',
  contract_no: '',
  contract_start: null,
  contract_end: null
});

const emptyEducation = () => ({
  education_level: '',
  major: '',
  teaching_experience: '',
  skills: '',
  training: ''
});

const emptyHr = () => ({
  performance: '',
  note: ''
});

const form = ref({
  id: '',
  identity: emptyIdentity(),
  contact: emptyContact(),
  employment: emptyEmployment(),
  salary: emptySalary(),
  legal: emptyLegal(),
  education: emptyEducation(),
  hr: emptyHr()
});

const getPhotoUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${environment.apiBaseUrl}media/image/${path}`;
};

const uploadPhoto = async ({ file, onSuccess, onError }) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const data = await uploadImage(formData, 'lecturers');
    form.value.identity.photo = data.filename || data.file_path || data.name || '';
    onSuccess(data);
    message.success(t('staff.photoUploaded'));
  } catch (error) {
    onError(error);
    message.error(t('staff.photoUploadFailed'));
  }
};

/** Normalize API date string (e.g. "2023-03-15 00:00:00") to "YYYY-MM-DD" for DatePicker */
const toDateOnly = (v) => {
  if (v == null || v === '') return null;
  if (typeof v === 'string' && v.includes(' ')) return v.trim().split(' ')[0];
  return v;
};

const ensureNested = (raw) => {
  if (!raw) return null;
  const identity = { ...emptyIdentity(), ...(raw.identity || {}) };
  const employment = { ...emptyEmployment(), ...(raw.employment || {}) };
  const legal = { ...emptyLegal(), ...(raw.legal || {}) };
  identity.date_of_birth = toDateOnly(identity.date_of_birth);
  employment.date_of_hire = toDateOnly(employment.date_of_hire);
  legal.contract_start = toDateOnly(legal.contract_start);
  legal.contract_end = toDateOnly(legal.contract_end);
  return {
    id: raw.id || '',
    identity,
    contact: { ...emptyContact(), ...(raw.contact || {}) },
    employment,
    salary: { ...emptySalary(), ...(raw.salary || {}) },
    legal,
    education: { ...emptyEducation(), ...(raw.education || {}) },
    hr: { ...emptyHr(), ...(raw.hr || {}) }
  };
};

const initForm = () => {
  if (props.staff && Object.keys(props.staff).length > 0) {
    form.value = ensureNested(JSON.parse(JSON.stringify(props.staff)));
  } else {
    form.value = {
      id: '',
      identity: emptyIdentity(),
      contact: emptyContact(),
      employment: emptyEmployment(),
      salary: emptySalary(),
      legal: emptyLegal(),
      education: emptyEducation(),
      hr: emptyHr()
    };
  }
};

watch(() => props.staff, () => {
  nextTick(initForm);
}, { deep: true, immediate: true });

onMounted(() => {
  nextTick(initForm);
});

const save = () => {
  const payload = { ...form.value };
  if (!payload.id) delete payload.id;
  emit('save', payload);
};
</script>
