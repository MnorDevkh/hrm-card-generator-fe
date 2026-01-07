<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
    <div class="flex">
      <!-- Sidebar -->
      <aside class="w-64 bg-white dark:bg-gray-800 shadow-md h-screen sticky top-0">
        <div class="p-6 flex items-center gap-4">
          <img alt="Logo" src="@/assets/ailogo.png" class="w-10 h-10" />
          <span class="text-xl font-semibold">HRM System</span>
        </div>
        <nav class="mt-4">
          <ul>
            <li v-for="item in menuItems" :key="item.label">
              <router-link
                :to="item.to"
                class="flex items-center gap-3 px-6 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                active-class="bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-300 border-r-4 border-blue-500"
              >
                <i :class="item.icon"></i>
                <span>{{ item.label }}</span>
              </router-link>
            </li>
          </ul>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-6 sm:p-8">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const menuItems = ref([
  { label: 'Dashboard', icon: 'pi pi-home', to: '/' },
  { label: 'Students', icon: 'pi pi-users', to: '/student' },
  { label: 'Staff', icon: 'pi pi-id-card', to: '/staff' }, // Assuming you have these routes
  { label: 'Lecturers', icon: 'pi pi-briefcase', to: '/lecture' }, // Assuming you have these routes
  { label: 'Card Templates', icon: 'pi pi-palette', to: '/template' },
  { label: 'Student Photos', icon: 'pi pi-image', to: '/template/student-photos' } // New menu item
]);
</script>

<style scoped>
/* Ensures the sidebar stays put */
.h-screen.sticky {
  height: 100vh;
}
</style>