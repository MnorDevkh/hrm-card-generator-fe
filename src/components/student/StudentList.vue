<template>
  <ConfigProvider :theme="{ token: { fontFamily: 'inherit' } }">
    <div class="p-4 sm:p-6 lg:p-8 space-y-4">
      <input type="file" ref="fileInput" @change="onFileSelected" style="display: none"
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
      <div class="card flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-md">
        <p class="text-xl font-bold text-gray-900 w-full sm:w-auto text-center sm:text-left">{{ t('student.listTitle') }}</p>
        <div class="grid grid-cols-1 sm:grid-cols-none sm:grid-flow-col gap-2 w-full sm:w-auto items-center">
          <Input v-model:value="searchQuery" :placeholder="t('student.searchPlaceholder')" allowClear @pressEnter="handleSearch"
            class="w-full sm:w-64" />
          <Input v-model:value="selectedBatch" :placeholder="t('student.batch')" allowClear @pressEnter="handleSearch"
            class="w-full sm:w-32" />
          <Select v-model:value="selectedFaculty" :placeholder="t('student.faculty')" allowClear @change="handleSearch"
            class="w-full sm:w-48" :options="facultyOptions" :loading="catalogOptionsLoading" />
          <Select v-model:value="selectedStudyShift" :placeholder="t('student.shift')" allowClear @change="handleSearch"
            class="w-full sm:w-32" :options="studyShiftOptions" :loading="catalogOptionsLoading" />
          <Button type="primary" @click="handleSearch">{{ t('common.search') }}</Button>
        </div>
        <Divider type="vertical" class="hidden sm:block h-8" />
        <div class="card flex flex-col sm:flex-row sm:flex-wrap justify-end gap-4 w-full sm:w-auto">
          <Button v-if="isAdmin" @click="exportCard" class="w-full sm:w-auto">
            <template #icon>
              <ExportOutlined />
            </template>
            {{ t('staff.exportCard') }}
          </Button>
          <Button v-if="isAdmin" type="primary" ghost @click="importFromExcel" :loading="isUploading"
            class="w-full sm:w-auto">
            <template #icon>
              <FileExcelOutlined />
            </template>
            {{ t('staff.excelImport') }}
          </Button>
          <Button v-if="isAdmin" type="primary" @click="openNew" class="w-full sm:w-auto">
            <template #icon>
              <PlusOutlined />
            </template>
            {{ t('common.addNew') }}
          </Button>
          <Button v-if="isAdmin" danger type="primary" class="w-full sm:w-auto" :disabled="!selectedRowKeys.length"
            @click="confirmBulkDelete">
            <template #icon>
              <DeleteOutlined />
            </template>
            {{ t('common.delete') }}
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
              <span v-else class="text-gray-400">{{ t('student.noPhoto') }}</span>
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
      <Modal v-model:open="viewDialogVisible" :title="t('student.details')" :footer="null" destroyOnClose
        width="min(1400px, 98vw)" style="top: 20px">
        <StudentDetail v-if="selectedStudent" :studentId="selectedStudent.id"
          :verificationId="selectedStudent.card_id || selectedStudent.identity_id" :embedded="true" />
      </Modal>

      <!-- Edit Student Dialog -->
      <Modal v-model:open="editDialogVisible"
        :title="selectedStudent && selectedStudent.id ? t('student.editStudent') : t('student.newStudent')" width="80%" :footer="null"
        destroyOnClose>
        <StudentForm v-if="editDialogVisible" :student="selectedStudent" @save="saveStudent"
          @cancel="editDialogVisible = false" />
      </Modal>
    </div>
  </ConfigProvider>

</template>

<script setup>
import { ref, onMounted, createVNode, computed } from 'vue';
import { useI18n } from 'vue-i18n';
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
import { useCatalogSelectOptions } from '../../composables/useCatalogSelectOptions';
import { CATALOG_FACULTY, CATALOG_STUDY_SHIFT } from '../../constants/catalogCategories';

const { t } = useI18n();
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

const { optionsByCategory, loading: catalogOptionsLoading } = useCatalogSelectOptions([
  CATALOG_FACULTY,
  CATALOG_STUDY_SHIFT,
]);
const facultyOptions = computed(() => optionsByCategory.value[CATALOG_FACULTY] ?? []);
const studyShiftOptions = computed(() => optionsByCategory.value[CATALOG_STUDY_SHIFT] ?? []);

const columns = computed(() => [
  { title: t('student.fields.no'), key: 'index', width: 60 },
  { title: t('student.fields.cardId'), dataIndex: 'card_id', key: 'card_id' },
  { title: t('staff.fields.nameEn'), dataIndex: ['name', 'english'], key: 'name_en' },
  { title: t('staff.fields.nameKh'), dataIndex: ['name', 'khmer'], key: 'name_kh' },
  { title: t('student.fields.gender'), dataIndex: 'gender', key: 'gender' },
  { title: t('student.fields.dateOfBirth'), dataIndex: 'birth_date', key: 'birth_date', customRender: ({ text }) => text ? (typeof text === 'string' && text.includes(' ') ? text.split(' ')[0] : text) : '-' },
  { title: t('student.fields.phone'), dataIndex: 'phone', key: 'phone' },
  { title: t('student.fields.batch'), dataIndex: 'batch', key: 'batch' },
  { title: t('student.fields.photo'), key: 'photo' },
  { title: t('common.actions'), key: 'actions', fixed: 'right', width: 150 },
]);

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
    message.error(t('student.loadFailed'));
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
    message.success(t('student.importSuccess'));
    loadStudents(); // Refresh the list
  } catch (error) {
    console.error('Error uploading Excel file:', error);
    message.error(t('student.importFailed'));
  } finally {
    isUploading.value = false;
    event.target.value = ''; // Reset file input
  }
};

const exportCard = () => {
  if (selectedRows.value.length === 0) {
    message.warning(t('student.selectToExport'));
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
      message.success(t('student.updated'));
    } else {
      await createStudent(studentData);
      message.success(t('student.created'));
    }
    editDialogVisible.value = false;
    loadStudents();
  } catch (error) {
    message.error(t('student.saveFailed'));
  }
};

const confirmBulkDelete = () => {
  Modal.confirm({
    title: t('student.bulkDeleteConfirm', { count: selectedRowKeys.value.length }),
    icon: createVNode(ExclamationCircleOutlined),
    content: t('common.cannotUndo'),
    okText: t('common.yes'),
    okType: 'danger',
    cancelText: t('common.no'),
    async onOk() {
      try {
        await Promise.all(selectedRowKeys.value.map(id => deleteStudent(id)));
        message.success(t('student.bulkDeleted'));
        selectedRowKeys.value = [];
        selectedRows.value = [];
        loadStudents();
      } catch (error) {
        message.error(t('student.bulkDeleteFailed'));
      }
    },
  });
};

const requireConfirmation = (student) => {
  const name = student.name?.english || student.name?.khmer || '';
  Modal.confirm({
    title: t('student.deleteConfirm', { name }),
    icon: createVNode(ExclamationCircleOutlined),
    content: t('common.cannotUndo'),
    okText: t('common.yes'),
    okType: 'danger',
    cancelText: t('common.no'),
    async onOk() {
      try {
        await deleteStudent(student.id);
        message.success(t('student.deleted'));
        loadStudents();
      } catch (error) {
        message.error(t('student.deleteFailed'));
      }
    },
  });
}
onMounted(async () => {
  loadStudents();
});
</script>