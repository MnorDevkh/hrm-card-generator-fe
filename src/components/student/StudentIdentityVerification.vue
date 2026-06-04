<template>
  <div
    class="flex items-center justify-center min-h-screen from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
    <Toast />
    <div class=" max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
      <div class="p-8">
        <div class="text-center mb-8">
          <div class="inline-block">
            <img src="@/assets/ailogo.png" :alt="t('verify.logoAlt')" class="animated-logo h-24 w-auto mx-auto mb-3 block" />
          </div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">សូមធ្វើការផ្ទៀងផ្ទាត់ទិន្នន័យ</h2>
          <p class="text-gray-500 dark:text-gray-400 mt-2 text-sm">
            សូមបញ្ចូលលេខសម្គាល់កាត ឬលេខអត្ដសញ្ញាណប័ណ្ណ
          </p>
        </div>

        <form @submit.prevent="submitVerification" class="space-y-6">

          <!-- Verification ID Input -->
          <div class="p-5">
            <label for="verification_id" class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              បញ្ចូលលេខសម្គាល់កាត ឬអត្ដ.
            </label>
            <div class="relative">
              <i class="pi pi-id-card absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input type="text" id="verification_id" v-model="verificationId"
                class="uppercase w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all outline-none"
                :placeholder="t('verify.placeholder')" />
            </div>
          </div>

          <button type="submit"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            <i class="pi pi-check-circle"></i>
            -ផ្ទៀងផ្ទាត់ទិន្នន័៏យ
          </button>
        </form>
      </div>
      <div class="bg-gray-50 dark:bg-gray-700/50 px-8 py-4 text-center">
        <p class="text-xs text-gray-500 dark:text-gray-400">
          AI System
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const toast = useToast();

const studentId = ref(route.params.id);
const verificationId = ref('');

const submitVerification = () => {
  const vId = verificationId.value.trim().toUpperCase();

  if (studentId.value && vId) {
    router.push({ path: `/students-detail/${studentId.value}`, query: { verificationId: vId } });
  } else {
    toast.add({ severity: 'warn', summary: t('verify.inputRequired'), detail: t('verify.enterCardId'), life: 3000 });
  }
};
</script>

<style scoped>
.animated-logo {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-8px);
  }

  100% {
    transform: translateY(0px);
  }
}
</style>