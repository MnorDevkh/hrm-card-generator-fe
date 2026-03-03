<template>
  <ConfigProvider :theme="{ token: { fontFamily: 'inherit' } }">
    <div class="p-4 sm:p-6 lg:p-8 space-y-4">
      <div
        class="card flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-md">
        <p class="text-xl font-bold text-gray-900 w-full sm:w-auto text-center sm:text-left">Lecturer
          List</p>
        <div class="grid grid-cols-1 sm:grid-cols-none sm:grid-flow-col gap-2 w-full sm:w-auto items-center">
          <Input v-model:value="searchQuery" placeholder="Search Name or ID" allowClear @pressEnter="handleSearch"
            class="w-full sm:w-64" />
          <Button type="primary" @click="handleSearch">Search</Button>
        </div>
      </div>

      <Divider />

      <div class="card flex flex-col sm:flex-row sm:flex-wrap justify-end gap-4 w-full sm:w-auto mb-4">
        <Button v-if="isAdmin" @click="exportCard" class="w-full sm:w-auto">
          <template #icon>
            <ExportOutlined />
          </template>
          Export Card
        </Button>
        <Button v-if="isAdmin" type="primary" ghost @click="importFromExcel" :loading="isUploading"
          class="w-full sm:w-auto">
          <template #icon>
            <FileExcelOutlined />
          </template>
          Excel Import
        </Button>
        <input type="file" ref="fileInput" class="hidden" accept=".xlsx, .xls" @change="handleFileUpload" />
        <Button v-if="isAdmin" type="primary" @click="openNew" class="w-full sm:w-auto">
          <template #icon>
            <PlusOutlined />
          </template>
          Add New
        </Button>
        <Button v-if="isAdmin" danger type="primary" class="w-full sm:w-auto" :disabled="!selectedRowKeys.length">
          <template #icon>
            <DeleteOutlined />
          </template>
          Delete
        </Button>
      </div>

      <Card :bordered="false" class="shadow-sm">
        <Table :dataSource="lecturers" :columns="columns" :pagination="pagination" :row-selection="rowSelection"
          :loading="loading" @change="handleTableChange" rowKey="id" :scroll="{ x: 1200 }">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'actions'">
              <div class="flex gap-2">
                <Button type="text" shape="circle" @click="generateCard(record)">
                  <template #icon>
                    <IdcardOutlined class="text-purple-500" />
                  </template>
                </Button>
                <Button type="text" shape="circle" @click="viewLecturer(record)">
                  <template #icon>
                    <EyeOutlined class="text-blue-500" />
                  </template>
                </Button>
                <Button type="text" shape="circle" @click="editLecturer(record)">
                  <template #icon>
                    <EditOutlined class="text-orange-500" />
                  </template>
                </Button>
                <Button v-if="isAdmin" type="text" danger shape="circle" @click="confirmDelete(record)">
                  <template #icon>
                    <DeleteOutlined />
                  </template>
                </Button>
              </div>
            </template>
          </template>
        </Table>
      </Card>

      <!-- View Dialog -->
      <Modal v-model:open="viewDialogVisible" title="Lecturer Details" :footer="null" destroyOnClose
        width="min(1000px, 98vw)">
        <LectureDetail v-if="selectedLecturer" :lecture="selectedLecturer" />
      </Modal>

      <!-- Edit/New Dialog -->
      <Modal v-model:open="editDialogVisible" :title="selectedLecturer?.id ? 'Edit Lecturer' : 'New Lecturer'"
        :footer="null" destroyOnClose width="min(800px, 98vw)">
        <LectureForm v-if="editDialogVisible" :lecture="selectedLecturer" @save="saveLecturer"
          @cancel="editDialogVisible = false" />
      </Modal>
    </div>
  </ConfigProvider>
</template>

<script setup>
import { ref, onMounted, createVNode } from 'vue';
import { useRouter } from 'vue-router';
import { Table, Button, Card, Divider, Modal, message, ConfigProvider, Input } from 'ant-design-vue';
import {
  PlusOutlined, ReloadOutlined, ExportOutlined, FileExcelOutlined,
  DeleteOutlined, IdcardOutlined, EyeOutlined, EditOutlined, ExclamationCircleOutlined
} from '@ant-design/icons-vue';
import LectureForm from './LectureForm.vue';
import LectureDetail from './LecturerViewDetail.vue';
import { getLecturers, createLecturer, updateLecturer, deleteLecturer, uploadExcel } from '../../service/lecture.service';

const lecturers = ref([]);
const selectedRowKeys = ref([]);
const selectedRows = ref([]);
const loading = ref(false);
const isUploading = ref(false);
const viewDialogVisible = ref(false);
const editDialogVisible = ref(false);
const selectedLecturer = ref({});
const router = useRouter();
const fileInput = ref(null);

const isAdmin = ref(localStorage.getItem('role') === 'admin_hrm');

const searchQuery = ref('');

const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
});

const columns = [
  { title: 'ID', dataIndex: 'identity_id', key: 'identity_id', sorter: true },
  { title: 'Name (KH)', dataIndex: ['name', 'khmer'], key: 'name_kh', sorter: true },
  { title: 'Name (EN)', dataIndex: ['name', 'english'], key: 'name_en', sorter: true },
  { title: 'Gender', dataIndex: 'gender', key: 'gender', sorter: true },
  { title: 'Date of Birth', dataIndex: 'birth_date', key: 'birth_date', sorter: true, customRender: ({ text }) => text ? (typeof text === 'string' && text.includes(' ') ? text.split(' ')[0] : text) : '-' },
  { title: 'Phone', dataIndex: 'phone', key: 'phone' },
  { title: 'Email', dataIndex: 'email', key: 'email' },
  { title: 'Faculty', dataIndex: 'faculty', key: 'faculty', sorter: true },
  { title: 'Actions', key: 'actions', width: 200, fixed: 'right' },
];

const rowSelection = {
  onChange: (keys, rows) => {
    selectedRowKeys.value = keys;
    selectedRows.value = rows;
  },
};

const handleTableChange = (pag) => {
  pagination.value.current = pag.current;
  pagination.value.pageSize = pag.pageSize;
};

const handleSearch = () => {
  pagination.value.current = 1;
  loadLecturers();
};

const loadLecturers = async () => {
  loading.value = true;
  try {
    const response = await getLecturers(pagination.value.current, pagination.value.pageSize, undefined, searchQuery.value);
    // Handle response structure (array or object with list)
    lecturers.value = Array.isArray(response) ? response : (response.lecturers || []);
    pagination.value.total = lecturers.value.length;
    selectedRowKeys.value = [];
    selectedRows.value = [];
  } catch (error) {
    console.error("Failed to load lecturers", error);
    message.error('Failed to load lecturers');
  } finally {
    loading.value = false;
  }
};

const openNew = () => {
  selectedLecturer.value = {};
  editDialogVisible.value = true;
};

const editLecturer = (lecture) => {
  selectedLecturer.value = { ...lecture };
  editDialogVisible.value = true;
};

const viewLecturer = (lecture) => {
  selectedLecturer.value = lecture;
  viewDialogVisible.value = true;
};

const generateCard = (lecture) => {
  const ids = [lecture.id];
  router.push({ path: '/template', query: { ids: JSON.stringify(ids), type: 'lecturer' } });
};

const exportCard = () => {
  if (selectedRows.value.length === 0) {
    message.warning('Please select lecturers to export');
    return;
  }
  const ids = selectedRows.value.map(l => l.id);
  router.push({ path: '/template', query: { ids: JSON.stringify(ids), type: 'lecturer' } });
};

const importFromExcel = () => {
  fileInput.value.click();
};

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  isUploading.value = true;
  try {
    await uploadExcel(formData);
    message.success('Lecturers imported successfully');
    loadLecturers();
  } catch (error) {
    console.error('Upload failed:', error);
    message.error('Failed to import lecturers');
  } finally {
    isUploading.value = false;
    event.target.value = '';
  }
};

const saveLecturer = async (lectureData) => {
  try {
    if (lectureData.id) {
      await updateLecturer(lectureData.id, lectureData);
      message.success('Lecturer Updated');
    } else {
      await createLecturer(lectureData);
      message.success('Lecturer Created');
    }
    editDialogVisible.value = false;
    loadLecturers();
  } catch (error) {
    message.error('Failed to save lecturer');
  }
};

const confirmDelete = (lecture) => {
  Modal.confirm({
    title: `Are you sure you want to delete ${lecture.name?.english || lecture.name?.khmer}?`,
    icon: createVNode(ExclamationCircleOutlined),
    content: 'This action cannot be undone.',
    okText: 'Yes',
    okType: 'danger',
    cancelText: 'No',
    async onOk() {
      try {
        await deleteLecturer(lecture.id);
        message.success('Lecturer deleted');
        loadLecturers();
      } catch (error) {
        message.error('Failed to delete lecturer');
      }
    },
  });
};

onMounted(() => {
  loadLecturers();
});
</script>