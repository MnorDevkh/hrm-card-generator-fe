<script setup>
// This component will now serve as the dashboard.

const stats = [
  { title: 'Total Students', value: '1,250', icon: 'pi pi-users', color: 'bg-blue-500' },
  { title: 'New Admissions', value: '85', icon: 'pi pi-user-plus', color: 'bg-green-500' },
  { title: 'Faculties', value: '8', icon: 'pi pi-building', color: 'bg-orange-500' },
  { title: 'Total Staff', value: '112', icon: 'pi pi-id-card', color: 'bg-purple-500' }
];

const quickActions = [
  { label: 'Add New Student', icon: 'pi pi-user-plus', to: '/student/new' },
  { label: 'Import Students', icon: 'pi pi-upload', to: '/student' }, // Link to student list where import is
  { label: 'Generate ID Cards', icon: 'pi pi-id-card', to: '/template' },
  { label: 'View Reports', icon: 'pi pi-chart-bar', to: '/reports' }
];
</script>

<template>
  <div class="space-y-8">
    <h1 class="text-3xl font-bold">Dashboard</h1>

    <!-- Stat Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="stat in stats" :key="stat.title" class="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md flex items-center gap-6">
        <div :class="[stat.color, 'rounded-full p-4 text-white text-2xl']">
          <i :class="stat.icon"></i>
        </div>
        <div>
          <p class="text-gray-500 dark:text-gray-400">{{ stat.title }}</p>
          <p class="text-2xl font-bold">{{ stat.value }}</p>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h2 class="text-xl font-semibold mb-4">Quick Actions</h2>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <router-link v-for="action in quickActions" :key="action.label" :to="action.to" class="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
          <i :class="[action.icon, 'text-3xl text-blue-500 mb-2']"></i>
          <span class="text-center text-sm">{{ action.label }}</span>
        </router-link>
      </div>
    </div>
  </div>
</template>