<template>
  <div class="flex items-center justify-center min-h-screen from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
    <Toast />
    <div class=" max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
      <div class="p-8">
        <div class="text-center mb-8">
          <i class="pi pi-id-card text-4xl text-blue-600 mb-3"></i>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Student Verification</h2>
          <p class="text-gray-500 dark:text-gray-400 mt-2 text-sm">
            Enter your Card ID or National Identity to verify.
          </p>
        </div>

        <form @submit.prevent="submitVerification" class="space-y-6">
          
          <!-- Card ID Input -->
          <div>
            <label for="card_id" class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Card Identity
            </label>
            <div class="relative">
              <i class="pi pi-credit-card absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                id="card_id"
                v-model="cardId"
                class="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all outline-none"
                placeholder="Enter Card ID"
              />
            </div>
          </div>

          <!-- AND Divider -->
          <div class="relative flex items-center py-2">
            <div class="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
            <!-- <span class="flex-shrink-0 mx-4 text-gray-400 text-sm font-medium">AND</span> -->
            <div class="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
          </div>

          <!-- National Identity Input -->
          <div>
            <label for="identity_id" class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              National Identity
            </label>
            <div class="relative">
              <i class="pi pi-user absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                id="identity_id"
                v-model="identityId"
                class="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all outline-none"
                placeholder="Enter National ID"
              />
            </div>
          </div>

          <button 
            type="submit" 
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <i class="pi pi-check-circle"></i>
            Verify Identity
          </button>
        </form>
      </div>
      <div class="bg-gray-50 dark:bg-gray-700/50 px-8 py-4 text-center">
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Secure Verification System
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const studentId = ref(route.params.id);
const identityId = ref('');
const cardId = ref('');

const submitVerification = () => {
  const cId = cardId.value.trim();
  const nId = identityId.value.trim();

  if (studentId.value && (cId || nId)) {
    let detailUrl;
    if (cId) {
      detailUrl = `/students-detail/${studentId.value}/${cId}/${nId}`;
    } else {
      detailUrl = `/students-detail/${studentId.value}/${nId}`;
    }
    router.push(detailUrl);
  } else {
    toast.add({ severity: 'warn', summary: 'Input Required', detail: 'Please enter either Card ID or National Identity', life: 3000 });
  }
};
</script>
