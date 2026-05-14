<template>
  <div class="min-h-screen w-full bg-gray-50">
    <header class="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div class="h-16 px-4 sm:px-6 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <img alt="Logo" src="@/assets/ailogo.png" class="w-9 h-9" />
          <div class="flex flex-col leading-tight">
            <div class="text-base font-semibold text-gray-900">Reception</div>
            <div class="text-xs text-gray-500">Receipt generator</div>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <nav class="hidden sm:flex items-center gap-2">
            <RouterLink
              to="/receipt"
              class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
              active-class="bg-blue-50 text-blue-700"
            >
              Receipts
            </RouterLink>
          </nav>
          <AccountMenu />
        </div>
      </div>
    </header>

    <main class="p-4 sm:p-6 lg:p-8">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import AccountMenu from './components/AccountMenu.vue';
</script>
