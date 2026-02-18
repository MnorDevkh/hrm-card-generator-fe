<template>
  <ConfigProvider :theme="{ token: { fontFamily: 'inherit' } }">
    <div class="p-4 sm:p-6 lg:p-8 space-y-4">
      <input type="file" ref="fileInput" @change="onFileSelected" style="display: none"
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
      <div class="card flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-md">
        <p class="text-xl font-bold text-gray-900 w-full sm:w-auto text-center sm:text-left">បញ្ជីឈ្មោះនិស្សិត
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-none sm:grid-flow-col gap-2 w-full sm:w-auto items-center">
          <Input v-model:value="searchQuery" placeholder="Search Name or ID" allowClear @pressEnter="handleSearch"
            class="w-full sm:w-64" />
          <Input v-model:value="selectedBatch" placeholder="Batch" allowClear @pressEnter="handleSearch"
            class="w-full sm:w-32" />
          <Select v-model:value="selectedFaculty" placeholder="Faculty" allowClear @change="handleSearch"
            class="w-full sm:w-48" :options="facultyOptions" />
          <Select v-model:value="selectedStudyShift" placeholder="Shift" allowClear @change="handleSearch"
            class="w-full sm:w-32" :options="studyShiftOptions" />
          <Button type="primary" @click="handleSearch">Search</Button>
        </div>
        <Divider type="vertical" class="hidden sm:block h-8" />
        <div class="card flex flex-col sm:flex-row sm:flex-wrap justify-end gap-4 w-full sm:w-auto">
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
          <Button v-if="isAdmin" type="primary" @click="openNew" class="w-full sm:w-auto">
            <template #icon>
              <PlusOutlined />
            </template>
            Add New
          </Button>
          <Button v-if="isAdmin" danger type="primary" class="w-full sm:w-auto" :disabled="!selectedRowKeys.length"
            @click="confirmBulkDelete">
            <template #icon>
              <DeleteOutlined />
            </template>
            Delete
          </Button>
        </div>
      </div>
      <Divider />
      <Card :bordered="false" class="shadow-sm">
        <Table :dataSource="students" :columns="columns" :pagination="pagination" :row-selection="rowSelection"
          :loading="loading" @change="handleTableChange" rowKey="id" :scroll="{ x: 1200 }">
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.key === 'index'">
              {{ (pagination.current - 1) * pagination.pageSize + index + 1 }}
            </template>
            <template v-else-if="column.key === 'photo'">
              <img v-if="record.photo" :src="`${environment.apiBaseUrl}media/image/${record.photo}`" alt="photo"
                class="w-10 h-10 rounded-[5x] object-cover" />
              <span v-else class="text-gray-400">No Photo</span>
            </template>
            <template v-else-if="column.key === 'actions'">
              <div class="flex gap-2">
                <Button type="text" shape="circle" @click="viewStudent(record)">
                  <template #icon>
                    <EyeOutlined class="text-blue-500" />
                  </template>
                </Button>
                <Button type="text" shape="circle" @click="editStudent(record)">
                  <template #icon>
                    <EditOutlined class="text-orange-500" />
                  </template>
                </Button>
                <Button v-if="isAdmin" type="text" danger shape="circle" @click="requireConfirmation(record)">
                  <template #icon>
                    <DeleteOutlined />
                  </template>
                </Button>
              </div>
            </template>
          </template>
        </Table>
      </Card>

      <!-- View Student Dialog -->
      <Modal v-model:open="viewDialogVisible" title="Student Details" :footer="null" destroyOnClose
        width="min(1400px, 98vw)" style="top: 20px">
        <StudentDetail v-if="selectedStudent" :studentId="selectedStudent.id"
          :verificationId="selectedStudent.card_id || selectedStudent.identity_id" :embedded="true" />
      </Modal>

      <!-- Edit Student Dialog -->
      <Modal v-model:open="editDialogVisible"
        :title="selectedStudent && selectedStudent.id ? 'Edit Student' : 'New Student'" width="80%" :footer="null"
        destroyOnClose>
        <StudentForm v-if="editDialogVisible" :student="selectedStudent" @save="saveStudent"
          @cancel="editDialogVisible = false" />
      </Modal>
    </div>
  </ConfigProvider>

</template>

<script setup>
import { ref, onMounted, createVNode } from 'vue';
import { Table, Button, Card, Divider, Modal, message, ConfigProvider, Input, Select } from 'ant-design-vue';
import {
  EyeOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined,
  UploadOutlined, PlusOutlined, FileExcelOutlined, ExportOutlined
} from '@ant-design/icons-vue';
import { getStudents, uploadExcel, deleteStudent, updateStudent, createStudent } from '../../service/student.service.js';
import { environment } from '../../environments/environment';
import { useRouter } from 'vue-router';
import StudentDetail from './StudentDetail.vue';
import StudentForm from './StudentForm.vue';

const students = ref([]);
const selectedRowKeys = ref([]);
const selectedRows = ref([]);
const isUploading = ref(false);
const fileInput = ref(null);
const loading = ref(false);
const searchQuery = ref('');
const selectedBatch = ref('');
const selectedFaculty = ref(undefined);
const selectedStudyShift = ref(undefined);
const router = useRouter();

const viewDialogVisible = ref(false);
const editDialogVisible = ref(false);
const selectedStudent = ref(null);
const isAdmin = ref(localStorage.getItem('role') === 'admin_hrm');

const pagination = ref({
  current: 1,
  pageSize: 100,
  total: 0,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '100', '200', '500'],
});

const facultyOptions = ref([
  { value: 'ភាសាបរទេស', label: 'មហា. ភាសាបរទេស' },
  { value: 'ព័ត៌មានវិទ្យា', label: 'មហា. ព័ត៌មានវិទ្យា' },
  { value: 'គ្រប់គ្រង', label: 'មហា. គ្រប់គ្រង' },
]);

const studyShiftOptions = ref([
  { value: 'ព្រឹក', label: 'វេនព្រឹក' },
  { value: 'រសៀល', label: 'វេនរសៀល' },
  { value: 'ល្ងាច', label: 'វេនល្ងាច' },
  { value: 'ចុងសប្ដាហ៍', label: 'វេនចុងសប្ដាហ៍' },
]);

const columns = [
  { title: 'No', key: 'index', width: 60 },
  { title: 'Card ID', dataIndex: 'card_id', key: 'card_id' },
  { title: 'Name (EN)', dataIndex: ['name', 'english'], key: 'name_en' },
  { title: 'Name (KH)', dataIndex: ['name', 'khmer'], key: 'name_kh' },
  { title: 'Gender', dataIndex: 'gender', key: 'gender' },
  { title: 'Date of Birth', dataIndex: 'birth_date', key: 'birth_date', customRender: ({ text }) => text ? (typeof text === 'string' && text.includes(' ') ? text.split(' ')[0] : text) : '-' },
  { title: 'Phone', dataIndex: 'phone', key: 'phone' },
  { title: 'Batch', dataIndex: 'batch', key: 'batch' },
  { title: 'Photo', key: 'photo' },
  { title: 'Actions', key: 'actions', fixed: 'right', width: 150 },
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
  loadStudents();
};

const handleSearch = () => {
  pagination.value.current = 1;
  loadStudents();
};

const loadStudents = async () => {
  loading.value = true;
  const offset = (pagination.value.current - 1) * pagination.value.pageSize;
  const limit = pagination.value.pageSize;

  try {
    const response = await getStudents(offset, limit, searchQuery.value, selectedBatch.value, selectedFaculty.value, selectedStudyShift.value);
    students.value = response.students;
    pagination.value.total = response.total;
  } catch (error) {
    console.error('Failed to load students', error);
    message.error('Failed to load students');
  } finally {
    loading.value = false;
  }
};

const importFromExcel = () => {
  fileInput.value.click();
};

const onFileSelected = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  isUploading.value = true;
  const formData = new FormData();
  formData.append('file', file);

  try {
    await uploadExcel(formData);
    message.success('Students imported successfully');
    loadStudents(); // Refresh the list
  } catch (error) {
    console.error('Error uploading Excel file:', error);
    message.error('Failed to import students');
  } finally {
    isUploading.value = false;
    event.target.value = ''; // Reset file input
  }
};

const exportCard = () => {
  if (selectedRows.value.length === 0) {
    message.warning('Please select at least one student to export.');
    return;
  }
  const ids = selectedRows.value.map(s => s.id);
  router.push({ path: '/template', query: { ids: JSON.stringify(ids) } });
};

const viewStudent = (student) => {
  selectedStudent.value = student;
  viewDialogVisible.value = true;
};

const openNew = () => {
  selectedStudent.value = {}; // Form component handles defaults
  editDialogVisible.value = true;
};

const editStudent = (student) => {
  selectedStudent.value = student;
  editDialogVisible.value = true;
};

const saveStudent = async (studentData) => {
  try {
    if (studentData.id) {
      await updateStudent(studentData.id, studentData);
      message.success('Student Updated');
    } else {
      await createStudent(studentData);
      message.success('Student Created');
    }
    editDialogVisible.value = false;
    loadStudents();
  } catch (error) {
    message.error('Failed to save student');
  }
};

const confirmBulkDelete = () => {
  Modal.confirm({
    title: `Are you sure you want to delete ${selectedRowKeys.value.length} students?`,
    icon: createVNode(ExclamationCircleOutlined),
    content: 'This action cannot be undone.',
    okText: 'Yes',
    okType: 'danger',
    cancelText: 'No',
    async onOk() {
      try {
        await Promise.all(selectedRowKeys.value.map(id => deleteStudent(id)));
        message.success('Selected students deleted successfully');
        selectedRowKeys.value = [];
        selectedRows.value = [];
        loadStudents();
      } catch (error) {
        message.error('Failed to delete selected students');
      }
    },
  });
};

const requireConfirmation = (student) => {
  Modal.confirm({
    title: `Are you sure you want to delete ${student.name.english}?`,
    icon: createVNode(ExclamationCircleOutlined),
    content: 'This action cannot be undone.',
    okText: 'Yes',
    okType: 'danger',
    cancelText: 'No',
    async onOk() {
      try {
        await deleteStudent(student.id);
        message.success('Student deleted');
        loadStudents();
      } catch (error) {
        message.error('Failed to delete student');
      }
    },
  });
}
onMounted(async () => {
  loadStudents();
});
</script>