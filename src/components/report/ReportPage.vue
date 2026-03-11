<template>
  <ConfigProvider :theme="{ token: { fontFamily: 'inherit' } }">
    <div class="p-4 sm:p-6 lg:p-8 space-y-6">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 class="text-2xl font-bold text-gray-900">Reports</h1>
        <div class="flex gap-2">
          <Button @click="loadReport" :loading="loading">
            <template #icon><ReloadOutlined /></template>
            Refresh
          </Button>
          <Button type="primary" @click="printReport">
            <template #icon><PrinterOutlined /></template>
            Print Report
          </Button>
        </div>
      </div>

      <div v-if="error" class="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
        {{ error }}
      </div>

      <div v-if="loading" class="text-center py-12 text-gray-500">
        <i class="pi pi-spin pi-spinner text-3xl mb-3 block"></i>
        Loading report data...
      </div>

      <div v-else id="report-content" class="space-y-6">
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card v-for="stat in summaryStats" :key="stat.label" :bordered="false" class="shadow-sm">
            <div class="flex items-center gap-4">
              <div :class="`p-3 rounded-full ${stat.bgColor} text-white`">
                <i :class="stat.icon" class="text-lg"></i>
              </div>
              <div>
                <p class="text-sm text-gray-500">{{ stat.label }}</p>
                <p class="text-2xl font-bold text-gray-800">{{ stat.value }}</p>
              </div>
            </div>
          </Card>
        </div>

        <!-- Breakdown Charts -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card title="Students by Faculty" :bordered="false" class="shadow-sm">
            <div v-if="studentsByFaculty.length" class="space-y-2">
              <div v-for="item in studentsByFaculty" :key="item.label" class="flex items-center gap-3">
                <span class="w-24 text-sm text-gray-600 truncate">{{ item.label }}</span>
                <div class="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div class="h-3 rounded-full bg-blue-500 transition-all" :style="{ width: barWidth(item.value, studentsByFaculty) + '%' }" />
                </div>
                <span class="w-10 text-right text-sm font-medium text-gray-800">{{ item.value }}</span>
              </div>
            </div>
            <div v-else class="text-sm text-gray-400">No data</div>
          </Card>

          <Card title="Staff by Department" :bordered="false" class="shadow-sm">
            <div v-if="staffByDept.length" class="space-y-2">
              <div v-for="item in staffByDept" :key="item.label" class="flex items-center gap-3">
                <span class="w-24 text-sm text-gray-600 truncate">{{ item.label }}</span>
                <div class="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div class="h-3 rounded-full bg-green-500 transition-all" :style="{ width: barWidth(item.value, staffByDept) + '%' }" />
                </div>
                <span class="w-10 text-right text-sm font-medium text-gray-800">{{ item.value }}</span>
              </div>
            </div>
            <div v-else class="text-sm text-gray-400">No data</div>
          </Card>

          <Card title="Lecturers by Faculty" :bordered="false" class="shadow-sm">
            <div v-if="lecturersByFaculty.length" class="space-y-2">
              <div v-for="item in lecturersByFaculty" :key="item.label" class="flex items-center gap-3">
                <span class="w-24 text-sm text-gray-600 truncate">{{ item.label }}</span>
                <div class="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div class="h-3 rounded-full bg-purple-500 transition-all" :style="{ width: barWidth(item.value, lecturersByFaculty) + '%' }" />
                </div>
                <span class="w-10 text-right text-sm font-medium text-gray-800">{{ item.value }}</span>
              </div>
            </div>
            <div v-else class="text-sm text-gray-400">No data</div>
          </Card>
        </div>

        <!-- Students Table -->
        <Card title="Students" :bordered="false" class="shadow-sm">
          <template #extra>
            <span class="text-sm text-gray-500">{{ studentItems.length }} of {{ studentTotal }} shown</span>
          </template>
          <Table
            :dataSource="studentItems"
            :columns="studentColumns"
            :pagination="false"
            rowKey="id"
            size="small"
            :scroll="{ x: 800 }"
          />
        </Card>

        <!-- Staff Table -->
        <Card title="Staff" :bordered="false" class="shadow-sm">
          <template #extra>
            <span class="text-sm text-gray-500">{{ staffItems.length }} of {{ staffTotal }} shown</span>
          </template>
          <Table
            :dataSource="staffItems"
            :columns="staffColumns"
            :pagination="false"
            rowKey="id"
            size="small"
            :scroll="{ x: 800 }"
          />
        </Card>

        <!-- Lecturers Table -->
        <Card title="Lecturers" :bordered="false" class="shadow-sm">
          <template #extra>
            <span class="text-sm text-gray-500">{{ lecturerItems.length }} of {{ lecturerTotal }} shown</span>
          </template>
          <Table
            :dataSource="lecturerItems"
            :columns="lecturerColumns"
            :pagination="false"
            rowKey="id"
            size="small"
            :scroll="{ x: 800 }"
          />
        </Card>
      </div>
    </div>
  </ConfigProvider>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Table, Card, Button, ConfigProvider } from 'ant-design-vue';
import { ReloadOutlined, PrinterOutlined } from '@ant-design/icons-vue';
import { getStudents } from '@/service/student.service';
import { getStaff } from '@/service/staff.service';
import { getLecturers } from '@/service/lecture.service';

const loading = ref(false);
const error = ref('');

const summaryStats = ref([
  { label: 'Total Students', value: '—', icon: 'pi pi-users', bgColor: 'bg-blue-500' },
  { label: 'Total Staff', value: '—', icon: 'pi pi-id-card', bgColor: 'bg-green-500' },
  { label: 'Lecturers', value: '—', icon: 'pi pi-briefcase', bgColor: 'bg-purple-500' },
]);

const studentItems = ref([]);
const staffItems = ref([]);
const lecturerItems = ref([]);

const studentTotal = ref(0);
const staffTotal = ref(0);
const lecturerTotal = ref(0);

const studentsByFaculty = ref([]);
const staffByDept = ref([]);
const lecturersByFaculty = ref([]);

const studentColumns = [
  { title: 'Card ID', dataIndex: 'card_id', key: 'card_id', width: 120 },
  { title: 'Name (EN)', dataIndex: ['name', 'english'], key: 'name_en' },
  { title: 'Name (KH)', dataIndex: ['name', 'khmer'], key: 'name_kh' },
  { title: 'Gender', dataIndex: 'gender', key: 'gender', width: 80 },
  { title: 'Batch', dataIndex: 'batch', key: 'batch', width: 100 },
  { title: 'Faculty', dataIndex: 'faculty', key: 'faculty' },
];

const staffColumns = [
  { title: 'Employee ID', dataIndex: ['identity', 'employee_id'], key: 'employee_id', width: 120 },
  { title: 'Name (EN)', dataIndex: ['identity', 'en_name'], key: 'en_name' },
  { title: 'Name (KH)', dataIndex: ['identity', 'kh_name'], key: 'kh_name' },
  { title: 'Gender', dataIndex: ['identity', 'gender'], key: 'gender', width: 80 },
  { title: 'Department', dataIndex: ['employment', 'department'], key: 'department' },
  { title: 'Phone', dataIndex: ['contact', 'phone'], key: 'phone', width: 130 },
];

const lecturerColumns = [
  { title: 'ID', dataIndex: 'identity_id', key: 'identity_id', width: 120 },
  { title: 'Name (EN)', dataIndex: ['name', 'english'], key: 'name_en' },
  { title: 'Name (KH)', dataIndex: ['name', 'khmer'], key: 'name_kh' },
  { title: 'Gender', dataIndex: 'gender', key: 'gender', width: 80 },
  { title: 'Faculty', dataIndex: 'faculty', key: 'faculty' },
  { title: 'Phone', dataIndex: 'phone', key: 'phone', width: 130 },
];

function extractItems(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.students)) return response.students;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.staff)) return response.staff;
  if (Array.isArray(response?.staffs)) return response.staffs;
  if (Array.isArray(response?.lecturers)) return response.lecturers;
  if (Array.isArray(response?.items)) return response.items;
  return [];
}

function extractTotal(response, items) {
  if (response?.total != null) return Number(response.total);
  if (response?.count != null) return Number(response.count);
  return items.length;
}

function groupBy(items, accessor) {
  const getValue = typeof accessor === 'function' ? accessor : (item) => item[accessor];
  const counts = {};
  for (const item of items) {
    const val = getValue(item) || 'Unknown';
    counts[val] = (counts[val] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

function barWidth(value, list) {
  const max = Math.max(...list.map((i) => i.value), 1);
  return Math.round((value / max) * 100);
}

const loadReport = async () => {
  loading.value = true;
  error.value = '';

  const [studentsRes, staffRes, lecturersRes] = await Promise.allSettled([
    getStudents(0, 100),
    getStaff(1, 100),
    getLecturers(1, 100),
  ]);

  const failed = [studentsRes, staffRes, lecturersRes].filter((r) => r.status === 'rejected');
  if (failed.length === 3) {
    error.value = 'Failed to load report data. Please try again later.';
    loading.value = false;
    return;
  }
  if (failed.length > 0) {
    error.value = `Some data could not be loaded (${failed.length}/3 requests failed).`;
  }

  const studentsData = studentsRes.status === 'fulfilled' ? studentsRes.value : null;
  const staffData = staffRes.status === 'fulfilled' ? staffRes.value : null;
  const lecturersData = lecturersRes.status === 'fulfilled' ? lecturersRes.value : null;

  const students = extractItems(studentsData);
  const staff = extractItems(staffData);
  const lecturers = extractItems(lecturersData);

  studentItems.value = students;
  staffItems.value = staff;
  lecturerItems.value = lecturers;

  studentTotal.value = extractTotal(studentsData, students);
  staffTotal.value = extractTotal(staffData, staff);
  lecturerTotal.value = extractTotal(lecturersData, lecturers);

  summaryStats.value = [
    { label: 'Total Students', value: studentsData ? studentTotal.value : '—', icon: 'pi pi-users', bgColor: 'bg-blue-500' },
    { label: 'Total Staff', value: staffData ? staffTotal.value : '—', icon: 'pi pi-id-card', bgColor: 'bg-green-500' },
    { label: 'Lecturers', value: lecturersData ? lecturerTotal.value : '—', icon: 'pi pi-briefcase', bgColor: 'bg-purple-500' },
  ];

  // Get accurate per-faculty totals via the API's faculty filter
  const faculties = [...new Set(students.map((s) => s.faculty).filter(Boolean))];
  const facultyResults = await Promise.allSettled(
    faculties.map((f) => getStudents(0, 1, null, null, f))
  );
  studentsByFaculty.value = faculties
    .map((faculty, i) => ({
      label: faculty,
      value: facultyResults[i].status === 'fulfilled' ? extractTotal(facultyResults[i].value, []) : 0,
    }))
    .sort((a, b) => b.value - a.value);

  staffByDept.value = groupBy(staff, (s) => s.employment?.department);
  lecturersByFaculty.value = groupBy(lecturers, 'faculty');

  loading.value = false;
};

const printReport = () => {
  window.print();
};

onMounted(loadReport);
</script>

<style scoped>
@media print {
  button {
    display: none !important;
  }
}
</style>
