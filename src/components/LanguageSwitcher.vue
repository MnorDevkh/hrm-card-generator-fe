<template>
  <Select
    :value="locale"
    :options="options"
    size="small"
    class="w-28"
    :aria-label="t('common.language')"
    @change="onChange"
  />
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Select } from 'ant-design-vue';
import { setLocale } from '@/i18n';

const { locale, t } = useI18n();

const options = computed(() => [
  { value: 'en', label: t('common.english') },
  { value: 'km', label: t('common.khmer') },
]);

const onChange = (value) => {
  setLocale(value);
};
</script>
