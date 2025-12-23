<template>
  <div class="p-fluid">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Basic Info -->
      <div class="col-span-1 md:col-span-2">
        <h3 class="text-lg font-bold text-gray-700 dark:text-gray-200 border-b pb-2 mb-4">Basic Information</h3>
      </div>
      
      <div class="flex flex-col gap-2">
        <label>Card ID</label>
        <InputText v-model="form.card_id" />
      </div>
      <div class="flex flex-col gap-2">
        <label>Identity ID</label>
        <InputText v-model="form.identity_id" />
      </div>
      <div class="flex flex-col gap-2">
        <label>Name (English)</label>
        <InputText v-model="form.name.english" />
      </div>
      <div class="flex flex-col gap-2">
        <label>Name (Khmer)</label>
        <InputText v-model="form.name.khmer" />
      </div>
      <div class="flex flex-col gap-2">
        <label>Gender</label>
        <Dropdown v-model="form.gender" :options="['Male', 'Female']" placeholder="Select Gender" />
      </div>
      <div class="flex flex-col gap-2">
        <label>Date of Birth</label>
        <Calendar v-model="form.birth_date" dateFormat="yy-mm-dd" showIcon />
      </div>
      <div class="flex flex-col gap-2">
        <label>Phone</label>
        <InputText v-model="form.phone" />
      </div>
      <div class="flex flex-col gap-2">
        <label>Email</label>
        <InputText v-model="form.email" />
      </div>
      <div class="flex flex-col gap-2">
        <label>Batch</label>
        <InputText v-model="form.batch" />
      </div>

      <!-- Birth Place -->
      <div class="col-span-1 md:col-span-2 mt-4">
        <h3 class="text-lg font-bold text-gray-700 dark:text-gray-200 border-b pb-2 mb-4">Birth Place</h3>
      </div>
      <div class="flex flex-col gap-2"><label>Province</label><InputText v-model="form.birth_place.province" /></div>
      <div class="flex flex-col gap-2"><label>District</label><InputText v-model="form.birth_place.district" /></div>
      <div class="flex flex-col gap-2"><label>Commune</label><InputText v-model="form.birth_place.commune" /></div>
      <div class="flex flex-col gap-2"><label>Village</label><InputText v-model="form.birth_place.village" /></div>

      <!-- Current Address -->
      <div class="col-span-1 md:col-span-2 mt-4">
        <h3 class="text-lg font-bold text-gray-700 dark:text-gray-200 border-b pb-2 mb-4">Current Address</h3>
      </div>
      <div class="flex flex-col gap-2"><label>Province</label><InputText v-model="form.current_address.province" /></div>
      <div class="flex flex-col gap-2"><label>District</label><InputText v-model="form.current_address.district" /></div>
      <div class="flex flex-col gap-2"><label>Commune</label><InputText v-model="form.current_address.commune" /></div>
      <div class="flex flex-col gap-2"><label>Village</label><InputText v-model="form.current_address.village" /></div>

      <!-- Guardian -->
      <div class="col-span-1 md:col-span-2 mt-4">
        <h3 class="text-lg font-bold text-gray-700 dark:text-gray-200 border-b pb-2 mb-4">Guardian</h3>
      </div>
      <div class="flex flex-col gap-2"><label>Guardian Name</label><InputText v-model="form.guardian.name" /></div>
      <div class="flex flex-col gap-2"><label>Guardian Phone</label><InputText v-model="form.guardian.phone" /></div>

      <!-- Education -->
      <div class="col-span-1 md:col-span-2 mt-4">
        <h3 class="text-lg font-bold text-gray-700 dark:text-gray-200 border-b pb-2 mb-4">Education Background</h3>
      </div>
      <div class="flex flex-col gap-2"><label>High School</label><InputText v-model="form.high_school" /></div>
      <div class="flex flex-col gap-2"><label>BacII Year</label><InputText v-model="form.bacII_year" /></div>
      <div class="flex flex-col gap-2"><label>BacII Code</label><InputText v-model="form.bacII_code" /></div>
      <div class="flex flex-col gap-2"><label>BacII Result</label><InputText v-model="form.bacII_result" /></div>

      <!-- University -->
      <div class="col-span-1 md:col-span-2 mt-4">
        <h3 class="text-lg font-bold text-gray-700 dark:text-gray-200 border-b pb-2 mb-4">University Info</h3>
      </div>
      <div class="flex flex-col gap-2"><label>Faculty</label><InputText v-model="form.faculty" /></div>
      <div class="flex flex-col gap-2"><label>Major</label><InputText v-model="form.major" /></div>
      <div class="flex flex-col gap-2"><label>Study Shift</label><InputText v-model="form.study_shift" /></div>

      <!-- Scholarship -->
      <div class="col-span-1 md:col-span-2 mt-4">
        <h3 class="text-lg font-bold text-gray-700 dark:text-gray-200 border-b pb-2 mb-4">Scholarship</h3>
      </div>
      <div class="flex flex-col gap-2"><label>Type</label><InputText v-model="form.scholarship_type" /></div>
      <div class="flex flex-col gap-2"><label>Card ID</label><InputText v-model="form.scholarship_card_id" /></div>
      <div class="flex flex-col gap-2"><label>Scholarship By</label><InputText v-model="form.scholarship_bye" /></div>

      <!-- Other -->
      <div class="col-span-1 md:col-span-2 mt-4">
        <h3 class="text-lg font-bold text-gray-700 dark:text-gray-200 border-b pb-2 mb-4">Other</h3>
      </div>
      <div class="col-span-1 md:col-span-2 flex flex-col gap-2">
        <label>Notes</label>
        <Textarea v-model="form.notes" rows="3" />
      </div>
    </div>

    <div class="flex justify-end gap-2 mt-6 pt-4 border-t">
      <Button label="Cancel" icon="pi pi-times" severity="secondary" text @click="$emit('cancel')" />
      <Button label="Save" icon="pi pi-check" @click="save" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import Button from 'primevue/button';

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
    
    // Handle date conversion if string
    if (form.value.birth_date && typeof form.value.birth_date === 'string') {
      form.value.birth_date = new Date(form.value.birth_date);
    }
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