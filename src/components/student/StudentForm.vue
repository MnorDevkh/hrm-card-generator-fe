<template>
  <ConfigProvider :theme="{ token: { fontFamily: 'inherit' } }">
  <div class="form-container">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Basic Info -->
      <div class="col-span-1 md:col-span-2">
        <h3 class="text-lg font-bold text-gray-700 dark:text-gray-200 border-b pb-2 mb-4">Basic Information</h3>
      </div>
      
      <div class="flex flex-col gap-2">
        <label>Card ID</label>
        <Input v-model:value="form.card_id" />
      </div>
      <div class="flex flex-col gap-2">
        <label>Identity ID</label>
        <Input v-model:value="form.identity_id" />
      </div>
      <div class="flex flex-col gap-2">
        <label>Name (English)</label>
        <Input v-model:value="form.name.english" />
      </div>
      <div class="flex flex-col gap-2">
        <label>Name (Khmer)</label>
        <Input v-model:value="form.name.khmer" />
      </div>
      <div class="flex flex-col gap-2">
        <label>Gender</label>
        <Select v-model:value="form.gender" placeholder="Select Gender">
          <SelectOption value="Male">Male</SelectOption>
          <SelectOption value="Female">Female</SelectOption>
        </Select>
      </div>
      <div class="flex flex-col gap-2">
        <label>Date of Birth</label>
        <DatePicker v-model:value="form.birth_date" valueFormat="YYYY-MM-DD" class="w-full" />
      </div>
      <div class="flex flex-col gap-2">
        <label>Phone</label>
        <Input v-model:value="form.phone" />
      </div>
      <div class="flex flex-col gap-2">
        <label>Email</label>
        <Input v-model:value="form.email" />
      </div>
      <div class="flex flex-col gap-2">
        <label>Batch</label>
        <Input v-model:value="form.batch" />
      </div>

      <!-- Birth Place -->
      <div class="col-span-1 md:col-span-2 mt-4">
        <h3 class="text-lg font-bold text-gray-700 dark:text-gray-200 border-b pb-2 mb-4">Birth Place</h3>
      </div>
      <div class="flex flex-col gap-2"><label>Province</label><Input v-model:value="form.birth_place.province" /></div>
      <div class="flex flex-col gap-2"><label>District</label><Input v-model:value="form.birth_place.district" /></div>
      <div class="flex flex-col gap-2"><label>Commune</label><Input v-model:value="form.birth_place.commune" /></div>
      <div class="flex flex-col gap-2"><label>Village</label><Input v-model:value="form.birth_place.village" /></div>

      <!-- Current Address -->
      <div class="col-span-1 md:col-span-2 mt-4">
        <h3 class="text-lg font-bold text-gray-700 dark:text-gray-200 border-b pb-2 mb-4">Current Address</h3>
      </div>
      <div class="flex flex-col gap-2"><label>Province</label><Input v-model:value="form.current_address.province" /></div>
      <div class="flex flex-col gap-2"><label>District</label><Input v-model:value="form.current_address.district" /></div>
      <div class="flex flex-col gap-2"><label>Commune</label><Input v-model:value="form.current_address.commune" /></div>
      <div class="flex flex-col gap-2"><label>Village</label><Input v-model:value="form.current_address.village" /></div>

      <!-- Guardian -->
      <div class="col-span-1 md:col-span-2 mt-4">
        <h3 class="text-lg font-bold text-gray-700 dark:text-gray-200 border-b pb-2 mb-4">Guardian</h3>
      </div>
      <div class="flex flex-col gap-2"><label>Guardian Name</label><Input v-model:value="form.guardian.name" /></div>
      <div class="flex flex-col gap-2"><label>Guardian Phone</label><Input v-model:value="form.guardian.phone" /></div>

      <!-- Education -->
      <div class="col-span-1 md:col-span-2 mt-4">
        <h3 class="text-lg font-bold text-gray-700 dark:text-gray-200 border-b pb-2 mb-4">Education Background</h3>
      </div>
      <div class="flex flex-col gap-2"><label>High School</label><Input v-model:value="form.high_school" /></div>
      <div class="flex flex-col gap-2"><label>BacII Year</label><Input v-model:value="form.bacII_year" /></div>
      <div class="flex flex-col gap-2"><label>BacII Code</label><Input v-model:value="form.bacII_code" /></div>
      <div class="flex flex-col gap-2"><label>BacII Result</label><Input v-model:value="form.bacII_result" /></div>

      <!-- University -->
      <div class="col-span-1 md:col-span-2 mt-4">
        <h3 class="text-lg font-bold text-gray-700 dark:text-gray-200 border-b pb-2 mb-4">University Info</h3>
      </div>
      <div class="flex flex-col gap-2"><label>Faculty</label><Input v-model:value="form.faculty" /></div>
      <div class="flex flex-col gap-2"><label>Major</label><Input v-model:value="form.major" /></div>
      <div class="flex flex-col gap-2"><label>Study Shift</label><Input v-model:value="form.study_shift" /></div>

      <!-- Scholarship -->
      <div class="col-span-1 md:col-span-2 mt-4">
        <h3 class="text-lg font-bold text-gray-700 dark:text-gray-200 border-b pb-2 mb-4">Scholarship</h3>
      </div>
      <div class="flex flex-col gap-2"><label>Type</label><Input v-model:value="form.scholarship_type" /></div>
      <div class="flex flex-col gap-2"><label>Card ID</label><Input v-model:value="form.scholarship_card_id" /></div>
      <div class="flex flex-col gap-2"><label>Scholarship By</label><Input v-model:value="form.scholarship_bye" /></div>

      <!-- Other -->
      <div class="col-span-1 md:col-span-2 mt-4">
        <h3 class="text-lg font-bold text-gray-700 dark:text-gray-200 border-b pb-2 mb-4">Other</h3>
      </div>
      <div class="col-span-1 md:col-span-2 flex flex-col gap-2">
        <label>Notes</label>
        <Textarea v-model:value="form.notes" :rows="3" />
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
import { Input, Textarea, Select, SelectOption, DatePicker, Button, ConfigProvider } from 'ant-design-vue';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons-vue';

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
  scholarship_bye: '',
  email: '',
  notes: '',
  photo: '',
  batch: ''
});

const initForm = () => {
  if (props.student && Object.keys(props.student).length > 0) {
    // Deep merge to ensure nested objects exist
    form.value = {
      ...form.value,
      ...JSON.parse(JSON.stringify(props.student)),
      // Ensure nested objects are not null
      name: { ...form.value.name, ...(props.student.name || {}) },
      birth_place: { ...form.value.birth_place, ...(props.student.birth_place || {}) },
      current_address: { ...form.value.current_address, ...(props.student.current_address || {}) },
      guardian: { ...form.value.guardian, ...(props.student.guardian || {}) }
    };
    
    // Ant Design DatePicker with valueFormat handles strings directly
  }
};

watch(() => props.student, initForm, { deep: true });

onMounted(() => {
  initForm();
});

const save = () => {
  emit('save', form.value);
};
</script>