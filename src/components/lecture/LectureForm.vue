<template>
  <ConfigProvider :theme="{ token: { fontFamily: 'inherit' } }">
  <div class="form-container">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <label>Nationality</label>
        <Input v-model:value="form.nationality" />
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

      <!-- Education -->
      <div class="col-span-1 md:col-span-2 mt-4">
        <h3 class="text-lg font-bold text-gray-700 dark:text-gray-200 border-b pb-2 mb-4">Education</h3>
      </div>
      <div class="flex flex-col gap-2"><label>Level</label><Input v-model:value="form.education.level" /></div>
      <div class="flex flex-col gap-2"><label>Year</label><Input v-model:value="form.education.year" /></div>
      <div class="col-span-1 md:col-span-2 flex flex-col gap-2"><label>Training Institution</label><Input v-model:value="form.education.training_institution" /></div>

      <!-- Academic Info -->
      <div class="col-span-1 md:col-span-2 mt-4">
        <h3 class="text-lg font-bold text-gray-700 dark:text-gray-200 border-b pb-2 mb-4">Academic Information</h3>
      </div>
      <div class="flex flex-col gap-2"><label>Faculty</label><Input v-model:value="form.faculty" /></div>
      <div class="flex flex-col gap-2"><label>Major</label><Input v-model:value="form.major" /></div>

      <!-- Other -->
      <div class="col-span-1 md:col-span-2 mt-4">
        <h3 class="text-lg font-bold text-gray-700 dark:text-gray-200 border-b pb-2 mb-4">Other</h3>
      </div>
      <div class="col-span-1 md:col-span-2 flex flex-col gap-2">
        <label>Notes</label>
        <Textarea v-model:value="form.notes" :rows="3" />
      </div>

      <!-- QR Settings (Manager) -->
      <div class="col-span-1 md:col-span-2 mt-4" v-if="isAdmin">
        <h3 class="text-lg font-bold text-gray-700 dark:text-gray-200 border-b pb-2 mb-4">QR Settings</h3>
      </div>
      <div v-if="isAdmin" class="flex flex-col gap-2">
        <label>QR Status</label>
        <Select v-model:value="form.qr_status" placeholder="Select QR Status">
          <SelectOption value="active">Active</SelectOption>
          <SelectOption value="inactive">Inactive</SelectOption>
        </Select>
      </div>
      <div v-if="isAdmin" class="flex flex-col gap-2">
        <label>QR Expiry Date</label>
        <DatePicker
          v-model:value="form.qr_expired_at"
          valueFormat="YYYY-MM-DD"
          class="w-full"
        />
      </div>

      <!-- Documents -->
      <div class="col-span-1 md:col-span-2 mt-4">
        <h3 class="text-lg font-bold text-gray-700 dark:text-gray-200 border-b pb-2 mb-4">Documents</h3>
        <Upload
          v-model:file-list="fileList"
          :customRequest="customUpload"
          @remove="handleRemove"
          list-type="text"
        >
          <Button>
            <UploadOutlined />
            Upload Document
          </Button>
        </Upload>
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
import { CheckOutlined, CloseOutlined, UploadOutlined, EditOutlined } from '@ant-design/icons-vue';
import { environment } from '../../environments/environment';
import { uploadImage } from '../../service/image.service';

const props = defineProps({
  lecture: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['save', 'cancel']);

const fileList = ref([]);
const isAdmin = ref(localStorage.getItem('role') === 'admin_hrm');

const form = ref({
  id: '',
  card_id: '',
  identity_id: '',
  nationality: '',
  name: { khmer: '', english: '' },
  gender: '',
  birth_date: null,
  birth_place: { village: '', commune: '', district: '', province: '' },
  current_address: { village: '', commune: '', district: '', province: '' },
  phone: '',
  education: { level: '', year: '', training_institution: '' },
  faculty: '',
  major: '',
  email: '',
  notes: '',
  photo: '',
  docs: [],
  qr_status: 'active',
  qr_expired_at: null
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
    form.value.photo = data.filename;
    onSuccess(data);
    message.success('Photo uploaded successfully');
  } catch (error) {
    onError(error);
    message.error('Failed to upload photo');
  }
};

const initForm = () => {
  if (props.lecture && Object.keys(props.lecture).length > 0) {
    form.value = JSON.parse(JSON.stringify(props.lecture));
    
    // Initialize fileList from docs
    if (form.value.docs && Array.isArray(form.value.docs)) {
      fileList.value = form.value.docs.map((doc, index) => ({
        uid: String(index),
        name: doc.file_path,
        status: 'done',
        url: '' // Can be set if a base URL is available
      }));
    } else {
      form.value.docs = [];
      fileList.value = [];
    }

    // Ensure QR fields exist when editing existing lecturer
    if (!Object.prototype.hasOwnProperty.call(form.value, 'qr_status')) {
      form.value.qr_status = 'active';
    }
    if (!Object.prototype.hasOwnProperty.call(form.value, 'qr_expired_at')) {
      form.value.qr_expired_at = null;
    }
  }
};

watch(() => props.lecture, initForm, { deep: true });

onMounted(() => {
  initForm();
});

const customUpload = async ({ file, onSuccess, onError }) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const data = await uploadImage(formData, 'docs');

    const newDoc = {
      doc_type: data.type,
      file_path: data.filename,
      uploaded_at: data.created_at
    };

    if (!form.value.docs) form.value.docs = [];
    form.value.docs.push(newDoc);

    onSuccess(data, file);
    message.success(`${file.name} uploaded successfully.`);
  } catch (error) {
    onError(error);
    message.error(`${file.name} upload failed.`);
  }
};

const handleRemove = (file) => {
  const filePath = file.response ? file.response.filename : file.name;
  const index = form.value.docs.findIndex(d => d.file_path === filePath);
  if (index !== -1) {
    form.value.docs.splice(index, 1);
  }
};

const save = () => {
  emit('save', form.value);
};
</script>