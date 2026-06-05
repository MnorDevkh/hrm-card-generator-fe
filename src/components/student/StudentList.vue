<template>
  <ConfigProvider :theme="{ token: { fontFamily: 'inherit' } }">
    <div class="p-4 sm:p-6 lg:p-8 space-y-4">
      <input type="file" ref="fileInput" @change="onFileSelected" style="display: none"
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
      <div class="card bg-white p-4 rounded-xl shadow-md space-y-4">
        <p class="text-xl font-bold text-gray-900 text-center sm:text-left">{{ t('student.listTitle') }}</p>
        <div class="border-t border-gray-100 pt-4 space-y-4">
          <p class="text-sm font-medium text-gray-700">{{ t('nav.listFilters') }}</p>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm text-gray-600 mb-1">{{ t('student.searchPlaceholder') }}</label>
              <Input v-model:value="searchQuery" :placeholder="t('student.searchPlaceholder')" allowClear
                class="w-full" @pressEnter="handleSearch" />
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1">{{ t('student.batch') }}</label>
              <Input v-model:value="selectedBatch" :placeholder="t('student.batch')" allowClear class="w-full"
                @pressEnter="handleSearch" />
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1">{{ t('student.faculty') }}</label>
              <Select v-model:value="selectedFaculty" :placeholder="t('student.faculty')" allowClear class="w-full"
                :options="facultyOptions" :loading="catalogOptionsLoading" @change="handleSearch" />
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1">{{ t('student.shift') }}</label>
              <Select v-model:value="selectedStudyShift" :placeholder="t('student.shift')" allowClear class="w-full"
                :options="studyShiftOptions" :loading="catalogOptionsLoading" @change="handleSearch" />
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1">{{ t('student.fields.currentDegree') }}</label>
              <Select v-model:value="selectedDegree" :placeholder="t('student.fields.currentDegree')" allowClear
                class="w-full" :options="degreeFilterOptions" @change="handleSearch" />
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1">{{ t('student.fields.studyYear') }}</label>
              <Select v-model:value="selectedStudyYear" :placeholder="t('student.fields.studyYear')" allowClear
                class="w-full" :options="studyYearFilterOptions" @change="handleSearch" />
            </div>
            <div class="flex flex-col justify-end">
              <label class="block text-sm text-gray-600 mb-1">{{ t('student.fields.completeCredit') }}</label>
              <Checkbox :checked="filterCompleteCredit === true" @change="onCompleteCreditFilterChange">
                {{ completeCreditFilterLabel }}
              </Checkbox>
            </div>
          </div>
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
            <span v-if="activeFilterCount > 0" class="text-sm text-gray-500">
              {{ t('common.filtersActive', { count: activeFilterCount }) }}
            </span>
            <span v-else class="hidden sm:block" />
            <div class="flex flex-wrap gap-2 justify-end">
              <Button @click="clearFilters">{{ t('common.clearFilters') }}</Button>
              <Button type="primary" @click="handleSearch">{{ t('common.search') }}</Button>
            </div>
          </div>
        </div>
      </div>

      <Divider />

      <div class="flex flex-col sm:flex-row sm:flex-wrap justify-end gap-4 w-full sm:w-auto mb-4">
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
import { Table, Button, Card, Divider, Modal, message, ConfigProvider, Input, Select, Checkbox } from 'ant-design-vue';
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
/** undefined = all students, true = complete credit only */
const filterCompleteCredit = ref(undefined);
const selectedDegree = ref(undefined);
const selectedStudyYear = ref(undefined);
const router = useRouter();

const completeCreditFilterLabel = computed(() =>
  filterCompleteCredit.value === true
    ? t('student.filterCompleteCreditYes')
    : t('student.filterAll'),
);

const onCompleteCreditFilterChange = (e) => {
  filterCompleteCredit.value = e.target.checked ? true : undefined;
  handleSearch();
};

const activeFilterCount = computed(() => {
  let count = 0;
  if (searchQuery.value?.trim()) count += 1;
  if (selectedBatch.value?.trim()) count += 1;
  if (selectedFaculty.value != null && selectedFaculty.value !== '') count += 1;
  if (selectedStudyShift.value != null && selectedStudyShift.value !== '') count += 1;
  if (selectedDegree.value != null && selectedDegree.value !== '') count += 1;
  if (selectedStudyYear.value != null && selectedStudyYear.value !== '') count += 1;
  if (filterCompleteCredit.value === true) count += 1;
  return count;
});

const resetFilters = () => {
  searchQuery.value = '';
  selectedBatch.value = '';
  selectedFaculty.value = undefined;
  selectedStudyShift.value = undefined;
  selectedDegree.value = undefined;
  selectedStudyYear.value = undefined;
  filterCompleteCredit.value = undefined;
};

const clearFilters = () => {
  resetFilters();
  handleSearch();
};

const degreeFilterOptions = computed(() => [
  { label: t('student.fields.degreeBachelor'), value: 'bachelor' },
  { label: t('student.fields.degreeMaster'), value: 'master' },
]);
const studyYearFilterOptions = computed(() => [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
]);

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

const formatDegreeLabel = (degree) => {
  if (!degree) return '-';
  if (degree === 'master') return t('student.fields.degreeMaster');
  if (degree === 'bachelor') return t('student.fields.degreeBachelor');
  return degree;
};

const columns = computed(() => [
  { title: t('student.fields.no'), key: 'index', width: 60 },
  { title: t('student.fields.cardId'), dataIndex: 'card_id', key: 'card_id' },
  { title: t('staff.fields.nameEn'), dataIndex: ['name', 'english'], key: 'name_en' },
  { title: t('staff.fields.nameKh'), dataIndex: ['name', 'khmer'], key: 'name_kh' },
  { title: t('student.fields.gender'), dataIndex: 'gender', key: 'gender' },
  { title: t('student.fields.dateOfBirth'), dataIndex: 'birth_date', key: 'birth_date', customRender: ({ text }) => text ? (typeof text === 'string' && text.includes(' ') ? text.split(' ')[0] : text) : '-' },
  { title: t('student.fields.phone'), dataIndex: 'phone', key: 'phone' },
  { title: t('student.fields.batch'), dataIndex: 'batch', key: 'batch' },
  {
    title: t('student.fields.currentDegree'),
    dataIndex: 'current_degree',
    key: 'current_degree',
    customRender: ({ text }) => formatDegreeLabel(text),
  },
  {
    title: t('student.fields.studyYear'),
    dataIndex: 'study_year',
    key: 'study_year',
    customRender: ({ text }) => (text != null && text !== '' ? text : '-'),
  },
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
    const response = await getStudents(
      offset,
      limit,
      searchQuery.value,
      selectedBatch.value,
      selectedFaculty.value,
      selectedStudyShift.value,
      filterCompleteCredit.value,
      selectedDegree.value,
      selectedStudyYear.value,
    );
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
  const query = { ids: JSON.stringify(ids) };
  if (selectedStudyYear.value != null && selectedStudyYear.value !== '') {
    query.study_year = String(selectedStudyYear.value);
  }
  router.push({ path: '/template', query });
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