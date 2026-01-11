<template>
  <header class="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 h-16">
    <div class="flex items-center gap-3">
      <!-- Mobile Toggle Button -->
      <button @click="$emit('toggle')" class="p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg md:hidden focus:outline-none">
        <i class="pi pi-bars text-xl"></i>
      </button>
      
      <!-- Logo/Title (Visible on mobile, or always if you prefer) -->
      <div class="flex items-center gap-3 md:hidden">
        <img alt="Logo" src="@/assets/ailogo.png" class="w-8 h-8" />
        <span class="text-lg font-semibold text-gray-800 dark:text-white">HRM System</span>
      </div>
    </div>

    <!-- Right Side (User Profile, etc.) - Placeholder -->
    <div class="flex items-center gap-4">
      <!-- Add user dropdown or other actions here -->
    </div>
  </header>
</template>

<script setup>
defineEmits(['toggle']);
</script>