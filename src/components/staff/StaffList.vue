<template>
<<<<<<< Updated upstream
  <div class="p-4 sm:p-6 lg:p-8 space-y-4 w-7xl  mx-auto">
  
    <h2>Staff List</h2>
    <DataTable :value="[]" responsiveLayout="scroll">
      <Column field="id" header="ID"></Column>
      <Column field="name" header="Name"></Column>
      <Column field="position" header="Position"></Column>
      <Column field="phone" header="Phone"></Column>
    </DataTable>
  </div>
=======
  <ConfigProvider :theme="{ token: { fontFamily: 'inherit' } }">
    <div class="p-4 sm:p-6 lg:p-8 space-y-4">
      <div
        class="card flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-md">
        <p class="text-xl font-bold text-gray-900 w-full sm:w-auto text-center sm:text-left">បុគ្គលិក / Staff List
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-none sm:grid-flow-col gap-2 w-full sm:w-auto items-center">
          <Input v-model:value="searchQuery" placeholder="Search Name or ID" allowClear @pressEnter="handleSearch"
            class="w-full sm:w-64" />
          <Button type="primary" @click="handleSearch">Search</Button>
        </div>
        <Divider type="vertical" class="hidden sm:block h-8" />
        <div class="card flex flex-col sm:flex-row sm:flex-wrap justify-end gap-4 w-full sm:w-auto">
          <Button type="primary" @click="openNew" class="w-full sm:w-auto">
            <template #icon>
              <PlusOutlined />
            </template>
            Add New
          </Button>
          <Button danger type="primary" class="w-full sm:w-auto" :disabled="!selectedRowKeys.length" @click="confirmBulkDelete">
            <template #icon>
              <DeleteOutlined />
            </template>
            Delete
          </Button>
        </div>
      </div>
      <Divider />
      <Card :bordered="false" class="shadow-sm">
        <Table :dataSource="staffs" :columns="columns" :pagination="pagination" :row-selection="rowSelection"
          :loading="loading" @change="handleTableChange" rowKey="id" :scroll="{ x: 1200 }">
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.key === 'index'">
              {{ (pagination.current - 1) * pagination.pageSize + index + 1 }}
            </template>
            <template v-else-if="column.key === 'photo'">
              <img v-if="record.identity.photo" :src="`${environment.apiBaseUrl}media/image/${record.identity.photo}`" alt="photo"
                class="w-10 h-10 rounded-[5x] object-cover" />
              <span v-else class="text-gray-400">No Photo</span>
            </template>
            <template v-else-if="column.key === 'actions'">
              <div class="flex gap-2">
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
                <Button type="text" danger shape="circle" @click="requireConfirmation(record)">
                  <template #icon>
                    <DeleteOutlined />
                  </template>
                </Button>
              </div>
            </template>
          </template>
        </Table>
      </Card>

      <!-- View Staff Dialog -->
      <Modal v-model:open="viewDialogVisible" title="Staff Details" :footer="null" destroyOnClose
        width="min(1000px, 98vw)" style="top: 20px">
        <StaffDetail v-if="selectedStaff" :staff="selectedStaff" />
      </Modal>

      <!-- Edit Staff Dialog -->
      <Modal v-model:open="editDialogVisible"
        :title="selectedStaff && selectedStaff.id ? 'Edit Staff' : 'New Staff'" width="80%" :footer="null"
        destroyOnClose>
        <StaffForm v-if="editDialogVisible" :staff="selectedStaff" @save="saveStaff"
          @cancel="editDialogVisible = false" />
      </Modal>
    </div>
  </ConfigProvider>
>>>>>>> Stashed changes
</template>

<script setup>
import { ref, onMounted, createVNode } from 'vue';
import { Table, Button, Card, Divider, Modal, message, ConfigProvider, Input } from 'ant-design-vue';
import {
  EyeOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined,
  PlusOutlined
} from '@ant-design/icons-vue';
import { getStaffs, deleteStaff, updateStaff, createStaff } from '../../service/staff.service.js';
import { environment } from '../../environments/environment';
import StaffDetail from './StaffDetail.vue';
import StaffForm from './StaffForm.vue';

const staffs = ref([]);
const selectedRowKeys = ref([]);
const selectedRows = ref([]);
const loading = ref(false);
const searchQuery = ref('');

const viewDialogVisible = ref(false);
const editDialogVisible = ref(false);
const selectedStaff = ref(null);

const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '100', '200'],
});

const columns = [
  { title: 'No', key: 'index', width: 60 },
  { title: 'Employee ID', dataIndex: ['identity', 'employee_id'], key: 'employee_id' },
  { title: 'Name (EN)', dataIndex: ['identity', 'en_name'], key: 'en_name' },
  { title: 'Name (KH)', dataIndex: ['identity', 'kh_name'], key: 'kh_name' },
  { title: 'Gender', dataIndex: ['identity', 'gender'], key: 'gender' },
  { title: 'Phone', dataIndex: ['contact', 'phone'], key: 'phone' },
  { title: 'Position', dataIndex: ['employment', 'position'], key: 'position' },
  { title: 'Department', dataIndex: ['employment', 'department'], key: 'department' },
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
  loadStaffs();
};

const handleSearch = () => {
  pagination.value.current = 1;
  loadStaffs();
};

const loadStaffs = async () => {
  loading.value = true;
  const offset = (pagination.value.current - 1) * pagination.value.pageSize;
  const limit = pagination.value.pageSize;

  try {
    const response = await getStaffs(offset, limit, searchQuery.value);
    staffs.value = response.staffs;
    pagination.value.total = response.total;
  } catch (error) {
    console.error('Failed to load staffs', error);
    message.error('Failed to load staffs');
  } finally {
    loading.value = false;
  }
};

const viewStaff = (staff) => {
  selectedStaff.value = staff;
  viewDialogVisible.value = true;
};

const openNew = () => {
  selectedStaff.value = {}; 
  editDialogVisible.value = true;
};

const editStaff = (staff) => {
  selectedStaff.value = staff;
  editDialogVisible.value = true;
};

const saveStaff = async (staffData) => {
  try {
    // Basic validation to ensure required fields structure exists
    if (!staffData.identity) staffData.identity = {};
    
    if (staffData.id) {
      await updateStaff(staffData.id, staffData);
      message.success('Staff Updated');
    } else {
      await createStaff(staffData);
      message.success('Staff Created');
    }
    editDialogVisible.value = false;
    loadStaffs();
  } catch (error) {
    message.error('Failed to save staff');
    console.error(error);
  }
};

const confirmBulkDelete = () => {
  Modal.confirm({
    title: `Are you sure you want to delete ${selectedRowKeys.value.length} staffs?`,
    icon: createVNode(ExclamationCircleOutlined),
    content: 'This action cannot be undone.',
    okText: 'Yes',
    okType: 'danger',
    cancelText: 'No',
    async onOk() {
      try {
        await Promise.all(selectedRowKeys.value.map(id => deleteStaff(id)));
        message.success('Selected staffs deleted successfully');
        selectedRowKeys.value = [];
        selectedRows.value = [];
        loadStaffs();
      } catch (error) {
        message.error('Failed to delete selected staffs');
      }
    },
  });
};

const requireConfirmation = (staff) => {
  Modal.confirm({
    title: `Are you sure you want to delete ${staff.identity?.en_name}?`,
    icon: createVNode(ExclamationCircleOutlined),
    content: 'This action cannot be undone.',
    okText: 'Yes',
    okType: 'danger',
    cancelText: 'No',
    async onOk() {
      try {
        await deleteStaff(staff.id);
        message.success('Staff deleted');
        loadStaffs();
      } catch (error) {
        message.error('Failed to delete staff');
      }
    },
  });
}
onMounted(async () => {
  loadStaffs();
});
</script>