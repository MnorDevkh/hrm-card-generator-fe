<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Message from 'primevue/message';
import { login } from '../../service/auth.service';

const router = useRouter();
const route = useRoute();

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref(null);

const handleLogin = async () => {
  loading.value = true;
  error.value = null;
  try {
    await login(email.value, password.value);
    // Redirect to the intended page or to the home page
    router.push(route.query.redirect || '/');
  } catch (e) {
    error.value = 'Failed to login. Please check your credentials.';
    console.error(e);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="h-screen flex items-center justify-center dark:bg-gray-100">
    <div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
      <div class="text-center mb-4">
        <img src="@/assets/ailogo.png" alt="Logo" class="mb-3" style="width: 60px; height: 60px;">
        <div class="text-3xl font-semibold text-gray-900 dark:text-white mb-2">Welcome Back</div>
        <span class="text-gray-600 dark:text-gray-400 font-medium">Sign in to continue</span>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="email" class="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
          <InputText id="email" v-model="email" type="email" placeholder="Email address" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" autocomplete="username" />
        </div>
        <div>
          <label for="password" class="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
          <Password id="password" v-model="password" placeholder="Password" :toggleMask="true" class="w-full" inputClass="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" :feedback="false" autocomplete="current-password"></Password>
        </div>

        <div class="flex items-center justify-end">
          <a href="#" class="text-sm text-blue-600 hover:underline dark:text-blue-400">Forgot password?</a>
        </div>

        <div v-if="error" class="mb-4">
          <Message severity="error">{{ error }}</Message>
        </div>

        <Button type="submit" label="Sign In" :loading="loading" class="w-full py-3 text-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"></Button>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Custom styles for PrimeVue components if needed, but prefer Tailwind utilities */
/* You can target PrimeVue component internal elements here if Tailwind utilities aren't enough */
/* For example: .p-inputtext { @apply border-red-500; } */
</style>