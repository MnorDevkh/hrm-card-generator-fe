<template>
  <div class="flex items-center justify-center min-h-screen from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
    <Toast />
    <div class=" max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
      <div class="p-8">
        <div class="text-center mb-8">
          <i class="pi pi-id-card text-4xl text-blue-600 mb-3"></i>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">ផ្ទៀងផ្ទាត់ អត្ថសញ្ញាណគ្រូ</h2>
          <p class="text-gray-500 dark:text-gray-400 mt-2 text-sm">
            សូមបំពេញលេខកូដសម្គាល់កាត /n
ឬលេខអត្តសញ្ញាណប័ណ្ណសញ្ជាតិខ្មែរ
          </p>
        </div>

        <form @submit.prevent="submitVerification" class="space-y-6">
          
          <!-- Verification ID Input -->
          <div class="p-5">
            <label for="verification_id" class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Card ID / National Identity
            </label>
            <div class="relative">
              <i class="pi pi-id-card absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                id="verification_id"
                v-model="verificationId"
                class="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all outline-none"
                placeholder="Enter Card ID or National ID"
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

const lecturerId = ref(route.params.id);
const verificationId = ref('');

const submitVerification = () => {
  const vId = verificationId.value.trim();

  if (lecturerId.value && vId) {
    router.push({ path: `/lecturer-view-detail/${lecturerId.value}`, query: { verificationId: vId } });
  } else {
    toast.add({ severity: 'warn', summary: 'Input Required', detail: 'Please enter your Card ID or National Identity', life: 3000 });
  }
};
</script>
