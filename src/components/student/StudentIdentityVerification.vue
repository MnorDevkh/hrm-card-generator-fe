<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
    <div class="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white">Student Verification</h2>
      <p class="text-center text-gray-600 dark:text-gray-400">
        Please enter the Identity ID to view student details.
      </p>
      <form @submit.prevent="submitVerification">
        <div class="space-y-4">
          <div>
            <label for="identity_id" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              Identity ID
            </label>
            <input
              type="text"
              id="identity_id"
              v-model="identityId"
              class="p-inputtext p-component w-full"
              placeholder="Enter Identity ID"
              required
            />
          </div>
          <button type="submit" class="p-button p-component w-full">
            View Details
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const studentId = ref(route.params.id);
const identityId = ref('');

const submitVerification = () => {
  if (studentId.value && identityId.value) {
    const detailUrl = `/students/${studentId.value}/${identityId.value}`;
    router.push(detailUrl);
  }
};
</script>
