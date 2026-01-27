<template>
  <div class="flex h-screen w-full overflow-hidden bg-gray-50 ">

    <!-- tab menu for account and profile management signout -->
    <!-- Sidebar -->
    <Sidebar :mobile-open="sidebarOpen" @close="sidebarOpen = false" />

    <!-- Main Area -->
    <div class="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden">
      <Navbar @toggle="sidebarOpen = !sidebarOpen" />
      <main class="flex-1 overflow-x-auto overflow-y-auto p-4 sm:p-6 lg:p-8 w-full">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Sidebar from './components/Sidebar.vue';
import Navbar from './components/Navbar.vue';

const sidebarOpen = ref(false);
</script>