<template>
  <ConfigProvider :theme="{ token: { fontFamily: 'inherit' } }">
  <div class="form-container">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Basic Info -->
      <div class="col-span-1 md:col-span-2">
        <h3 class="text-lg font-bold text-gray-700 dark:text-gray-200 border-b pb-2 mb-4">{{ t('student.sections.basic') }}</h3>
      </div>

      <!-- Profile Photo -->
      <div class="col-span-1 md:col-span-2 flex justify-center mb-6">
        <div class="relative">
          <div class="w-32 h-32 rounded-lg h-40 overflow-hidden bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center">
            <img v-if="form.photo" :src="getPhotoUrl(form.photo)" alt="Profile" class="w-full h-full object-cover" />
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
        <label>{{ t('student.fields.cardId') }}</label>
        <Input v-model:value="form.card_id" />
      </div>
      <div class="flex flex-col gap-2">
        <label>{{ t('student.fields.identityId') }}</label>
        <Input v-model:value="form.identity_id" />
      </div>
      <div class="flex flex-col gap-2">
        <label>{{ t('student.fields.nameEnglish') }}</label>
        <Input v-model:value="form.name.english" />
      </div>
      <div class="flex flex-col gap-2">
        <label>{{ t('student.fields.nameKhmer') }}</label>
        <Input v-model:value="form.name.khmer" />
      </div>
      <div class="flex flex-col gap-2">
        <label>{{ t('student.fields.gender') }}</label>
        <Select v-model:value="form.gender" :placeholder="t('common.selectGender')">
          <SelectOption value="Male">{{ t('common.male') }}</SelectOption>
          <SelectOption value="Female">{{ t('common.female') }}</SelectOption>
        </Select>
      </div>
      <div class="flex flex-col gap-2">
        <label>{{ t('student.fields.dateOfBirth') }}</label>
        <DatePicker v-model:value="form.birth_date" valueFormat="YYYY-MM-DD" class="w-full" />
      </div>
      <div class="flex flex-col gap-2">
        <label>{{ t('student.fields.phone') }}</label>
        <Input v-model:value="form.phone" />
      </div>
      <div class="flex flex-col gap-2">
        <label>{{ t('student.fields.email') }}</label>
        <Input v-model:value="form.email" />
      </div>
      <div class="flex flex-col gap-2">
        <label>{{ t('student.fields.batch') }}</label>
        <Input v-model:value="form.batch" />
      </div>

      <!-- Birth Place -->
      <div class="col-span-1 md:col-span-2 mt-4">
        <h3 class="text-lg font-bold text-gray-700 dark:text-gray-200 border-b pb-2 mb-4">{{ t('student.sections.birthPlace') }}</h3>
      </div>
      <div class="flex flex-col gap-2"><label>{{ t('student.fields.province') }}</label><Input v-model:value="form.birth_place.province" /></div>
      <div class="flex flex-col gap-2"><label>{{ t('student.fields.district') }}</label><Input v-model:value="form.birth_place.district" /></div>
      <div class="flex flex-col gap-2"><label>{{ t('student.fields.commune') }}</label><Input v-model:value="form.birth_place.commune" /></div>
      <div class="flex flex-col gap-2"><label>{{ t('student.fields.village') }}</label><Input v-model:value="form.birth_place.village" /></div>

      <!-- Current Address -->
      <div class="col-span-1 md:col-span-2 mt-4">
        <h3 class="text-lg font-bold text-gray-700 dark:text-gray-200 border-b pb-2 mb-4">{{ t('student.sections.currentAddress') }}</h3>
      </div>
      <div class="flex flex-col gap-2"><label>{{ t('student.fields.province') }}</label><Input v-model:value="form.current_address.province" /></div>
      <div class="flex flex-col gap-2"><label>{{ t('student.fields.district') }}</label><Input v-model:value="form.current_address.district" /></div>
      <div class="flex flex-col gap-2"><label>{{ t('student.fields.commune') }}</label><Input v-model:value="form.current_address.commune" /></div>
      <div class="flex flex-col gap-2"><label>{{ t('student.fields.village') }}</label><Input v-model:value="form.current_address.village" /></div>

      <!-- Guardian -->
      <div class="col-span-1 md:col-span-2 mt-4">
        <h3 class="text-lg font-bold text-gray-700 dark:text-gray-200 border-b pb-2 mb-4">{{ t('student.sections.guardian') }}</h3>
      </div>
      <div class="flex flex-col gap-2"><label>{{ t('student.fields.guardianName') }}</label><Input v-model:value="form.guardian.name" /></div>
      <div class="flex flex-col gap-2"><label>{{ t('student.fields.guardianPhone') }}</label><Input v-model:value="form.guardian.phone" /></div>

      <!-- Education -->
      <div class="col-span-1 md:col-span-2 mt-4">
        <h3 class="text-lg font-bold text-gray-700 dark:text-gray-200 border-b pb-2 mb-4">{{ t('student.sections.education') }}</h3>
      </div>
      <div class="flex flex-col gap-2"><label>{{ t('student.fields.highSchool') }}</label><Input v-model:value="form.high_school" /></div>
      <div class="flex flex-col gap-2"><label>{{ t('student.fields.bacIIYear') }}</label><Input v-model:value="form.bacII_year" /></div>
      <div class="flex flex-col gap-2"><label>{{ t('student.fields.bacIICode') }}</label><Input v-model:value="form.bacII_code" /></div>
      <div class="flex flex-col gap-2"><label>{{ t('student.fields.bacIIResult') }}</label><Input v-model:value="form.bacII_result" /></div>

      <!-- University -->
      <div class="col-span-1 md:col-span-2 mt-4">
        <h3 class="text-lg font-bold text-gray-700 dark:text-gray-200 border-b pb-2 mb-4">{{ t('student.sections.university') }}</h3>
      </div>
      <div class="flex flex-col gap-2"><label>{{ t('student.fields.faculty') }}</label><Input v-model:value="form.faculty" /></div>
      <div class="flex flex-col gap-2"><label>{{ t('student.fields.major') }}</label><Input v-model:value="form.major" /></div>
      <div class="flex flex-col gap-2"><label>{{ t('student.fields.studyShift') }}</label><Input v-model:value="form.study_shift" /></div>
      <div class="flex flex-col gap-2 justify-end">
        <Checkbox v-model:checked="form.ischeck">{{ t('student.fields.completeCredit') }}</Checkbox>
      </div>
      <div class="flex flex-col gap-2">
        <label>{{ t('student.fields.currentDegree') }}</label>
        <Select v-model:value="form.current_degree" allow-clear class="w-full" :placeholder="t('student.fields.currentDegree')">
          <SelectOption value="bachelor">{{ t('student.fields.degreeBachelor') }}</SelectOption>
          <SelectOption value="master">{{ t('student.fields.degreeMaster') }}</SelectOption>
        </Select>
      </div>
      <div class="flex flex-col gap-2">
        <label>{{ t('student.fields.studyYear') }}</label>
        <Select v-model:value="form.study_year" allow-clear class="w-full" :placeholder="t('student.fields.studyYear')">
          <SelectOption :value="1">1</SelectOption>
          <SelectOption :value="2">2</SelectOption>
          <SelectOption :value="3">3</SelectOption>
          <SelectOption :value="4">4</SelectOption>
        </Select>
      </div>

      <!-- Scholarship -->
      <div class="col-span-1 md:col-span-2 mt-4">
        <h3 class="text-lg font-bold text-gray-700 dark:text-gray-200 border-b pb-2 mb-4">{{ t('student.sections.scholarship') }}</h3>
      </div>
      <div class="flex flex-col gap-2"><label>{{ t('student.fields.type') }}</label><Input v-model:value="form.scholarship_type" /></div>
      <div class="flex flex-col gap-2"><label>{{ t('student.fields.cardId') }}</label><Input v-model:value="form.scholarship_card_id" /></div>
      <div class="flex flex-col gap-2"><label>{{ t('student.fields.scholarshipBy') }}</label><Input v-model:value="form.scholarship_by" /></div>

      <!-- Other -->
      <div class="col-span-1 md:col-span-2 mt-4">
        <h3 class="text-lg font-bold text-gray-700 dark:text-gray-200 border-b pb-2 mb-4">{{ t('student.sections.other') }}</h3>
      </div>
      <div class="col-span-1 md:col-span-2 flex flex-col gap-2">
        <label>{{ t('student.fields.notes') }}</label>
        <Textarea v-model:value="form.notes" :rows="3" />
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
import { ref, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { Input, Textarea, Select, SelectOption, DatePicker, Button, ConfigProvider, Upload, Checkbox, message } from 'ant-design-vue';
import { CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons-vue';
import { environment } from '../../environments/environment';
import { uploadImage } from '../../service/image.service';

const { t } = useI18n();

const props = defineProps({
  student: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['save', 'cancel']);

const form = ref({
  id: null,
  card_id: '',
  identity_id: '',
  name: { khmer: '', english: '' },
  gender: '',
  birth_date: null,
  birth_place: { village: '', commune: '', district: '', province: '' },
  current_address: { village: '', commune: '', district: '', province: '' },
  phone: '',
  guardian: { name: '', phone: '' },
  education_level: '',
  bacII_code: '',
  bacII_year: '',
  bacII_result: '',
  high_school: '',
  faculty: '',
  major: '',
  study_shift: '',
  scholarship_type: '',
  scholarship_card_id: '',
  scholarship_by: '',
  email: '',
  notes: '',
  photo: '',
  batch: '',
  ischeck: false,
  current_degree: null,
  study_year: null
});

function normalizeDateToYMD(value) {
  if (!value || typeof value !== 'string') return value;
  const s = value.trim().split(' ')[0].replace(/\//g, '-');
  const m = s.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (m) {
    const dd = m[1].padStart(2, '0');
    const mm = m[2].padStart(2, '0');
    return `${m[3]}-${mm}-${dd}`;
  }
  return value;
}

const initForm = () => {
  if (props.student && Object.keys(props.student).length > 0) {
    form.value = {
      ...form.value,
      ...JSON.parse(JSON.stringify(props.student)),
      name: { ...form.value.name, ...(props.student.name || {}) },
      birth_place: { ...form.value.birth_place, ...(props.student.birth_place || {}) },
      current_address: { ...form.value.current_address, ...(props.student.current_address || {}) },
      guardian: { ...form.value.guardian, ...(props.student.guardian || {}) }
    };

    form.value.birth_date = normalizeDateToYMD(form.value.birth_date);
    form.value.ischeck = props.student.ischeck === true;
    form.value.current_degree = props.student.current_degree || null;
    const year = props.student.study_year;
    form.value.study_year = year != null && year !== '' ? Number(year) : null;
  }
};

function prepareStudentPayload(formData) {
  const payload = JSON.parse(JSON.stringify(formData));
  const isUpdate = !!payload.id;
  for (const key of ['current_degree', 'study_year']) {
    const val = payload[key];
    if (val === null || val === undefined || val === '') {
      if (isUpdate) {
        payload[key] = null;
      } else {
        delete payload[key];
      }
    }
  }
  return payload;
}

const getPhotoUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${environment.apiBaseUrl}media/image/${path}`;
};

const uploadPhoto = async ({ file, onSuccess, onError }) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const data = await uploadImage(formData, 'student_photo');
    form.value.photo = data.filename;
    onSuccess(data);
    message.success(t('student.photoUploaded'));
  } catch (error) {
    onError(error);
    message.error(t('student.photoUploadFailed'));
  }
};

watch(() => props.student, initForm, { deep: true });

onMounted(() => {
  initForm();
});

const save = () => {
  emit('save', prepareStudentPayload(form.value));
};
</script>
