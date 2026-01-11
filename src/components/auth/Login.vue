<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Button, Input, Alert, ConfigProvider } from 'ant-design-vue';
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
  <div class="min-h-screen flex flex-col justify-center items-center w-full">
    <ConfigProvider :theme="{ token: { fontFamily: 'inherit' } }">
      <div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
      <div class="text-center mb-4">
        <img src="@/assets/ailogo.png" alt="Logo" class="mb-3 mx-auto" style="width: 60px; height: 60px;">
        <div class="text-3xl font-semibold text-gray-900 dark:text-white mb-2">Welcome Back</div>
        <span class="text-gray-600 dark:text-gray-400 font-medium">Sign in to continue</span>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="email" class="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
          <Input id="email" v-model:value="email" type="email" placeholder="Email address" size="large" autocomplete="username" />
        </div>
        <div>
          <label for="password" class="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
          <Input.Password id="password" v-model:value="password" placeholder="Password" size="large" autocomplete="current-password" />
        </div>

        <div class="flex items-center justify-end">
          <a href="#" class="text-sm text-blue-600 hover:underline dark:text-blue-400">Forgot password?</a>
        </div>

        <div v-if="error" class="mb-4">
          <Alert type="error" :message="error" show-icon />
        </div>

        <Button type="primary" html-type="submit" :loading="loading" block size="large" class="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 h-12 text-lg">Sign In</Button>
      </form>
    </div>
    </ConfigProvider>
  </div>
</template>

<style scoped>
/* Custom styles for PrimeVue components if needed, but prefer Tailwind utilities */
/* You can target PrimeVue component internal elements here if Tailwind utilities aren't enough */
/* For example: .p-inputtext { @apply border-red-500; } */
</style>