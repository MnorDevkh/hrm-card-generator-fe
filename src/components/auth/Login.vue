<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { Button, Input, Alert, ConfigProvider } from 'ant-design-vue';
import { login } from '../../service/auth.service';
import { getCurrentRole, ROLE_RECEPT, INVALID_ROLE_CODE } from '@/utils/role';
import LanguageSwitcher from '@/components/LanguageSwitcher.vue';

const router = useRouter();
const route = useRoute();
const { t } = useI18n();

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
    const redirect = route.query.redirect;
    if (redirect) {
      router.push(redirect);
      return;
    }

    const role = getCurrentRole();
    router.push(role === ROLE_RECEPT ? '/receipt' : '/');
  } catch (e) {
    error.value =
      e?.code === INVALID_ROLE_CODE ? t('auth.invalidRole') : t('auth.loginFailed');
    console.error(e);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex flex-col justify-center items-center w-full mx-auto relative" style="width: 100%;">
    <div class="absolute top-4 right-4">
      <LanguageSwitcher />
    </div>
    <ConfigProvider :theme="{ token: { fontFamily: 'inherit' } }">
      <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <div class="text-center mb-4">
        <img src="@/assets/ailogo.png" alt="Logo" class="mb-3 mx-auto" style="width: 60px; height: 60px;">
        <div class="text-3xl font-semibold text-gray-900 mb-2">{{ t('auth.welcomeBack') }}</div>
        <span class="text-gray-600 font-medium">{{ t('auth.signInToContinue') }}</span>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="email" class="block text-lg font-medium text-gray-700 mb-2">{{ t('auth.email') }}</label>
          <Input id="email" v-model:value="email" type="email" :placeholder="t('auth.emailPlaceholder')" size="large" autocomplete="username" />
        </div>
        <div>
          <label for="password" class="block text-lg font-medium text-gray-700 mb-2">{{ t('auth.password') }}</label>
          <Input.Password id="password" v-model:value="password" :placeholder="t('auth.passwordPlaceholder')" size="large" autocomplete="current-password" />
        </div>

        <div class="flex items-center justify-end">
          <a href="#" class="text-sm text-blue-600 hover:underline">{{ t('auth.forgotPassword') }}</a>
        </div>

        <div v-if="error" class="mb-4">
          <Alert type="error" :message="error" show-icon />
        </div>

        <Button type="primary" html-type="submit" :loading="loading" block size="large" class="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 h-12 text-lg">{{ t('auth.signIn') }}</Button>
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