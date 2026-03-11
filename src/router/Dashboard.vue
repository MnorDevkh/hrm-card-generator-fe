<template>
  <div class="relative p-6 m-4 bg-white rounded-lg shadow-md">
    <div v-if="error" class="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">
      {{ error }}
    </div>

    <div v-if="loading" class="mb-4 text-sm text-gray-500">
      Loading dashboard data...
    </div>

    <h2 class="text-2xl font-bold mb-6 text-gray-800">Dashboard Overview</h2>
    
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div v-for="(stat, index) in stats" :key="index" class="bg-white rounded-lg shadow-md p-6 flex items-center">
        <div :class="`p-4 rounded-full ${stat.bgColor} text-white mr-4`">
          <i :class="stat.icon" class="text-xl"></i>
        </div>
        <div>
          <p class="text-gray-500 text-sm">{{ stat.label }}</p>
          <p class="text-2xl font-bold text-gray-800">{{ stat.value }}</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
      <!-- Recent Activity -->
      <div class="bg-white rounded-lg shadow-md p-6 lg:col-span-1">
        <h3 class="text-lg font-semibold mb-4 text-gray-800">Recent Activity</h3>
        <ul class="space-y-4">
          <li v-for="activity in activities" :key="activity.id" class="flex items-start border-b border-gray-100 last:border-0 pb-3 last:pb-0">
            <div class="bg-blue-100 p-2 rounded-full mr-3">
              <i class="pi pi-bell text-blue-600 text-sm"></i>
            </div>
            <div>
              <p class="text-sm text-gray-800 font-medium">{{ activity.message }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ activity.time }}</p>
            </div>
          </li>
        </ul>
      </div>

      <div class="lg:col-span-2 space-y-6">
        <!-- Charts -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StatsBarChart
            title="Students by Faculty"
            :items="studentsByFaculty"
          />
          <StatsBarChart
            title="Staff by Department"
            :items="staffByDepartment"
          />
        </div>

        <!-- Quick Actions -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold mb-4 text-gray-800">Quick Actions</h3>
          <div class="grid grid-cols-2 gap-4">
            <button
              v-for="action in quickActions"
              :key="action.label"
              @click="handleQuickAction(action)"
              class="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <i :class="action.icon" class="text-2xl mb-2 text-gray-600"></i>
              <span class="text-sm font-medium text-gray-700">{{ action.label }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import StatsBarChart from '@/components/dashboard/StatsBarChart.vue';
import { getStudents } from '@/service/student.service';
import { getStaff } from '@/service/staff.service';
import { getLecturers } from '@/service/lecture.service';
import { getImagesByType } from '@/service/image.service';

const router = useRouter();

const loading = ref(true);
const error = ref('');

const stats = ref([
  { label: 'Total Students', value: '—', icon: 'pi pi-users', bgColor: 'bg-blue-500' },
  { label: 'Total Staff', value: '—', icon: 'pi pi-id-card', bgColor: 'bg-green-500' },
  { label: 'Lecturers', value: '—', icon: 'pi pi-briefcase', bgColor: 'bg-purple-500' },
  { label: 'Templates', value: '—', icon: 'pi pi-palette', bgColor: 'bg-orange-500' },
]);

const activities = ref([]);
const studentsByFaculty = ref([]);
const staffByDepartment = ref([]);

const quickActions = ref([
  { label: 'Add Student', icon: 'pi pi-user-plus', route: '/students/add' },
  { label: 'Create ID Card', icon: 'pi pi-id-card', route: '/card-generator' },
  { label: 'View Reports', icon: 'pi pi-chart-bar', route: '/reports' },
  { label: 'Settings', icon: 'pi pi-cog', route: '/settings' }
]);

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

function extractTotal(response) {
  if (response?.total != null) return Number(response.total);
  if (response?.count != null) return Number(response.count);
  return extractItems(response).length;
}

function groupBy(items, accessor) {
  const getValue = typeof accessor === 'function' ? accessor : (item) => item[accessor];
  const counts = {};
  for (const item of items) {
    const val = getValue(item) || 'Unknown';
    counts[val] = (counts[val] || 0) + 1;
  }
  return Object.entries(counts).map(([label, value]) => ({ label, value }));
}

function buildActivities(students, staffList, lecturers) {
  const entries = [];

  for (const s of students.slice(0, 3)) {
    const name = s.name?.english || s.name?.khmer || s.card_id || `Student #${s.id || ''}`;
    entries.push({
      id: `student-${s.id || Math.random()}`,
      message: `Student registered: ${name}`,
      time: s.created_at || s.createdAt || s.batch || '',
      _sort: s.created_at || s.createdAt || '',
    });
  }

  for (const st of staffList.slice(0, 3)) {
    const name = st.identity?.en_name || st.identity?.kh_name || st.identity?.employee_id || `Staff #${st.id || ''}`;
    entries.push({
      id: `staff-${st.id || Math.random()}`,
      message: `Staff added: ${name}`,
      time: st.created_at || st.createdAt || '',
      _sort: st.created_at || st.createdAt || '',
    });
  }

  for (const l of lecturers.slice(0, 3)) {
    const name = l.name?.english || l.name?.khmer || l.identity_id || `Lecturer #${l.id || ''}`;
    entries.push({
      id: `lecturer-${l.id || Math.random()}`,
      message: `Lecturer added: ${name}`,
      time: l.created_at || l.createdAt || '',
      _sort: l.created_at || l.createdAt || '',
    });
  }

  entries.sort((a, b) => {
    if (!a._sort && !b._sort) return 0;
    if (!a._sort) return 1;
    if (!b._sort) return -1;
    return new Date(b._sort) - new Date(a._sort);
  });

  return entries.slice(0, 8);
}

const loadDashboard = async () => {
  loading.value = true;
  error.value = '';

  const [studentsRes, staffRes, lecturersRes, templatesRes] = await Promise.allSettled([
    getStudents(0, 100),
    getStaff(1, 100),
    getLecturers(1, 100),
    getImagesByType('template'),
  ]);

  const failed = [studentsRes, staffRes, lecturersRes, templatesRes].filter(
    (r) => r.status === 'rejected'
  );
  if (failed.length === 4) {
    error.value = 'Failed to load dashboard data. Please try again later.';
    loading.value = false;
    return;
  }
  if (failed.length > 0) {
    error.value = `Some data could not be loaded (${failed.length}/4 requests failed).`;
  }

  const studentsData = studentsRes.status === 'fulfilled' ? studentsRes.value : null;
  const staffData = staffRes.status === 'fulfilled' ? staffRes.value : null;
  const lecturersData = lecturersRes.status === 'fulfilled' ? lecturersRes.value : null;
  const templatesData = templatesRes.status === 'fulfilled' ? templatesRes.value : null;

  const studentItems = extractItems(studentsData);
  const staffItems = extractItems(staffData);
  const lecturerItems = extractItems(lecturersData);
  const templateItems = extractItems(templatesData);

  stats.value = [
    { label: 'Total Students', value: studentsData != null ? extractTotal(studentsData) : '—', icon: 'pi pi-users', bgColor: 'bg-blue-500' },
    { label: 'Total Staff', value: staffData != null ? extractTotal(staffData) : '—', icon: 'pi pi-id-card', bgColor: 'bg-green-500' },
    { label: 'Lecturers', value: lecturersData != null ? extractTotal(lecturersData) : '—', icon: 'pi pi-briefcase', bgColor: 'bg-purple-500' },
    { label: 'Templates', value: templatesData != null ? templateItems.length : '—', icon: 'pi pi-palette', bgColor: 'bg-orange-500' },
  ];

  activities.value = buildActivities(studentItems, staffItems, lecturerItems);

  // Get accurate per-faculty totals via the API's faculty filter
  const faculties = [...new Set(studentItems.map((s) => s.faculty).filter(Boolean))];
  const facultyResults = await Promise.allSettled(
    faculties.map((f) => getStudents(0, 1, null, null, f))
  );
  studentsByFaculty.value = faculties
    .map((faculty, i) => ({
      label: faculty,
      value: facultyResults[i].status === 'fulfilled' ? extractTotal(facultyResults[i].value) : 0,
    }))
    .sort((a, b) => b.value - a.value);

  staffByDepartment.value = groupBy(staffItems, (s) => s.employment?.department);

  loading.value = false;
};

onMounted(loadDashboard);

const handleQuickAction = (action) => {
  if (action.route) {
    router.push(action.route);
  }
};
</script>