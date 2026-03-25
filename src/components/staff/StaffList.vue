<template>
  <ConfigProvider :theme="{ token: { fontFamily: 'inherit' } }">
    <div class="p-4 sm:p-6 lg:p-8 space-y-4">
      <div
        class="card flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-md">
        <p class="text-xl font-bold text-gray-900 w-full sm:w-auto text-center sm:text-left">Staff List</p>
        <div class="grid grid-cols-1 sm:grid-cols-none sm:grid-flow-col gap-2 w-full sm:w-auto items-center">
          <Input v-model:value="searchQuery" placeholder="Search Name or ID" allowClear @pressEnter="handleSearch"
            class="w-full sm:w-64" />
          <Select v-model:value="selectedDepartment" placeholder="Department" allowClear @change="handleSearch"
            class="w-full sm:w-48" :options="departmentOptions" :loading="catalogOptionsLoading" />
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
        <Button type="primary" @click="openNew" class="w-full sm:w-auto">
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

      <Card :bordered="false" class="shadow-sm">
        <Table :dataSource="staffList" :columns="columns" :pagination="pagination" :row-selection="rowSelection"
          :loading="loading" @change="handleTableChange" rowKey="id" :scroll="{ x: 1200 }">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'actions'">
              <div class="flex gap-2">
                <!-- <Button type="text" shape="circle" @click="generateCard(record)">
                  <template #icon>
                    <IdcardOutlined class="text-purple-500" />
                  </template>
                </Button> -->
                <Button type="text" shape="circle" @click="viewStaff(record)">
                  <template #icon>
                    <EyeOutlined class="text-blue-500" />
                  </template>
                </Button>
                <Button type="text" shape="circle" @click="editStaff(record)">
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
      <Modal v-model:open="viewDialogVisible" title="Staff Details" :footer="null" destroyOnClose
        width="min(1000px, 98vw)">
        <StaffDetail v-if="selectedStaff" :staff="selectedStaff" @back="viewDialogVisible = false"
          @edit="handleDetailEdit" @delete="handleDetailDelete" />
      </Modal>

      <!-- Edit/New Dialog -->
      <Modal v-model:open="editDialogVisible" :title="selectedStaff?.id ? 'Edit Staff' : 'New Staff'"
        :footer="null" destroyOnClose width="min(800px, 98vw)">
        <StaffForm v-if="editDialogVisible" :staff="selectedStaff" @save="saveStaff"
          @cancel="editDialogVisible = false" />
      </Modal>
    </div>
  </ConfigProvider>
</template>

<script setup>
import { ref, onMounted, createVNode, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Table, Button, Card, Divider, Modal, message, ConfigProvider, Input, Select } from 'ant-design-vue';
import {
  PlusOutlined, ExportOutlined, FileExcelOutlined,
  DeleteOutlined, IdcardOutlined, EyeOutlined, EditOutlined, ExclamationCircleOutlined
} from '@ant-design/icons-vue';
import StaffForm from './StaffForm.vue';
import StaffDetail from './StaffDetail.vue';
import { getStaff, getStaffById, createStaff, updateStaff, deleteStaff, uploadExcel } from '../../service/staff.service';
import { useCatalogSelectOptions } from '../../composables/useCatalogSelectOptions';
import { CATALOG_DEPARTMENT } from '../../constants/catalogCategories';

const staffList = ref([]);
const selectedRowKeys = ref([]);
const selectedRows = ref([]);
const loading = ref(false);
const isUploading = ref(false);
const viewDialogVisible = ref(false);
const editDialogVisible = ref(false);
const selectedStaff = ref({});
const router = useRouter();
const fileInput = ref(null);

const isAdmin = ref(localStorage.getItem('role') === 'admin_hrm');

const searchQuery = ref('');
const selectedDepartment = ref(undefined);

const { optionsByCategory, loading: catalogOptionsLoading } = useCatalogSelectOptions([CATALOG_DEPARTMENT]);
const departmentOptions = computed(() => optionsByCategory.value[CATALOG_DEPARTMENT] ?? []);

const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20','50', '100',],
});

const columns = [
  { title: 'ID', dataIndex: ['identity', 'employee_id'], key: 'employee_id', sorter: true },
  { title: 'Name (KH)', dataIndex: ['identity', 'kh_name'], key: 'name_kh', sorter: true },
  { title: 'Name (EN)', dataIndex: ['identity', 'en_name'], key: 'name_en', sorter: true },
  { title: 'Gender', dataIndex: ['identity', 'gender'], key: 'gender', sorter: true },
  { title: 'Date of Birth', dataIndex: ['identity', 'date_of_birth'], key: 'date_of_birth', sorter: true, customRender: ({ text }) => text ? (typeof text === 'string' && text.includes(' ') ? text.split(' ')[0] : text) : '-' },
  { title: 'Phone', dataIndex: ['contact', 'phone'], key: 'phone' },
  { title: 'Email', dataIndex: ['contact', 'email'], key: 'email' },
  { title: 'Department', dataIndex: ['employment', 'department'], key: 'department', sorter: true },
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
  loadStaff();
};

const handleSearch = () => {
  pagination.value.current = 1;
  loadStaff();
};

const loadStaff = async () => {
  loading.value = true;
  try {
    const response = await getStaff(pagination.value.current, pagination.value.pageSize, undefined, searchQuery.value, selectedDepartment.value);
    const list = Array.isArray(response) ? response : (response.data ?? response.staff ?? response.staffs ?? []);
    staffList.value = list;
    pagination.value.total = response.total ?? list.length;
    selectedRowKeys.value = [];
    selectedRows.value = [];
  } catch (error) {
    console.error("Failed to load staff", error);
    message.error('Failed to load staff');
  } finally {
    loading.value = false;
  }
};

const openNew = () => {
  selectedStaff.value = {};
  editDialogVisible.value = true;
};

const editStaff = async (staff) => {
  if (!staff?.id) {
    selectedStaff.value = { ...staff };
    editDialogVisible.value = true;
    return;
  }
  try {
    const full = await getStaffById(staff.id);
    selectedStaff.value = full ?? { ...staff };
  } catch (e) {
    selectedStaff.value = { ...staff };
  }
  editDialogVisible.value = true;
};

const viewStaff = (staff) => {
  selectedStaff.value = staff;
  viewDialogVisible.value = true;
};

const generateCard = (staff) => {
  const ids = [staff.id];
  router.push({ path: '/template', query: { ids: JSON.stringify(ids), type: 'staff' } });
};

const exportCard = () => {
  if (selectedRows.value.length === 0) {
    message.warning('Please select staff to export');
    return;
  }
  const ids = selectedRows.value.map(s => s.id);
  router.push({ path: '/template', query: { ids: JSON.stringify(ids), type: 'staff' } });
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
    message.success('Staff imported successfully');
    loadStaff();
  } catch (error) {
    console.error('Upload failed:', error);
    message.error('Failed to import staff');
  } finally {
    isUploading.value = false;
    event.target.value = '';
  }
};

const saveStaff = async (staffData) => {
  try {
    if (staffData.id) {
      await updateStaff(staffData.id, staffData);
      message.success('Staff Updated');
    } else {
      await createStaff(staffData);
      message.success('Staff Created');
    }
    editDialogVisible.value = false;
    loadStaff();
  } catch (error) {
    message.error('Failed to save staff');
  }
};

const handleDetailEdit = (staff) => {
  viewDialogVisible.value = false;
  editStaff(staff);
};

const handleDetailDelete = (staff) => {
  viewDialogVisible.value = false;
  confirmDelete(staff);
};

const confirmDelete = (staff) => {
  const name = staff.identity?.en_name || staff.identity?.kh_name || 'this staff';
  Modal.confirm({
    title: `Are you sure you want to delete ${name}?`,
    icon: createVNode(ExclamationCircleOutlined),
    content: 'This action cannot be undone.',
    okText: 'Yes',
    okType: 'danger',
    cancelText: 'No',
    async onOk() {
      try {
        await deleteStaff(staff.id);
        message.success('Staff deleted');
        loadStaff();
      } catch (error) {
        message.error('Failed to delete staff');
      }
    },
  });
};

const confirmBulkDelete = () => {
  if (selectedRows.value.length === 0) return;
  Modal.confirm({
    title: `Are you sure you want to delete ${selectedRows.value.length} staff member(s)?`,
    icon: createVNode(ExclamationCircleOutlined),
    content: 'This action cannot be undone.',
    okText: 'Yes',
    okType: 'danger',
    cancelText: 'No',
    async onOk() {
      try {
        for (const s of selectedRows.value) {
          await deleteStaff(s.id);
        }
        message.success('Staff deleted');
        loadStaff();
      } catch (error) {
        message.error('Failed to delete staff');
      }
    },
  });
};

onMounted(() => {
  loadStaff();
});
</script>
