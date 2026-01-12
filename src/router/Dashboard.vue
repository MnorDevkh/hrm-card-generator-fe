<template>
  <div class="p-6 m-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
    <h2 class="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Dashboard Overview</h2>
    
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div v-for="(stat, index) in stats" :key="index" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center">
        <div :class="`p-4 rounded-full ${stat.bgColor} text-white mr-4`">
          <i :class="stat.icon" class="text-xl"></i>
        </div>
        <div>
          <p class="text-gray-500 dark:text-gray-400 text-sm">{{ stat.label }}</p>
          <p class="text-2xl font-bold text-gray-800 dark:text-white">{{ stat.value }}</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6">
      <!-- Recent Activity -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Recent Activity</h3>
        <ul class="space-y-4">
          <li v-for="activity in activities" :key="activity.id" class="flex items-start border-b border-gray-100 dark:border-gray-700 last:border-0 pb-3 last:pb-0">
            <div class="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mr-3">
              <i class="pi pi-bell text-blue-600 dark:text-blue-300 text-sm"></i>
            </div>
            <div>
              <p class="text-sm text-gray-800 dark:text-gray-200 font-medium">{{ activity.message }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ activity.time }}</p>
            </div>
          </li>
        </ul>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Quick Actions</h3>
        <div class="grid grid-cols-2 gap-4">
          <button v-for="action in quickActions" :key="action.label" @click="handleQuickAction(action)" class="flex flex-col items-center justify-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <i :class="action.icon" class="text-2xl mb-2 text-gray-600 dark:text-gray-300"></i>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ action.label }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const stats = ref([
  { label: 'Total Students', value: '2,543', icon: 'pi pi-users', bgColor: 'bg-blue-500' },
  { label: 'Total Staff', value: '145', icon: 'pi pi-id-card', bgColor: 'bg-green-500' },
  { label: 'Lecturers', value: '42', icon: 'pi pi-briefcase', bgColor: 'bg-purple-500' },
  { label: 'Templates', value: '15', icon: 'pi pi-palette', bgColor: 'bg-orange-500' },
]);

const activities = ref([
  { id: 1, message: 'New student registered: Sarah Connor', time: '15 mins ago' },
  { id: 2, message: 'ID Card template "Staff 2024" updated', time: '2 hours ago' },
  { id: 3, message: 'System maintenance scheduled', time: '5 hours ago' },
  { id: 4, message: 'New lecturer added: Dr. Miles Dyson', time: '1 day ago' },
]);

const quickActions = ref([
  { label: 'Add Student', icon: 'pi pi-user-plus', route: '/students/add' },
  { label: 'Create ID Card', icon: 'pi pi-id-card', route: '/cards/create' },
  { label: 'Add Staff', icon: 'pi pi-briefcase', route: '/staff/add' },
  { label: 'View Reports', icon: 'pi pi-chart-bar', route: '/reports' },
]);

const handleQuickAction = (action) => {
  if (action.route) {
    router.push(action.route);
  }
};
</script>