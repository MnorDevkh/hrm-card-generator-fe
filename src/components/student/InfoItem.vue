<template>
  <div :class="['info-item flex items-start gap-3 w-full', fullWidth ? 'col-span-1 sm:col-span-2 lg:col-span-3' : '']">
    <i v-if="icon" :class="`pi ${icon} text-gray-400 dark:text-gray-500 mt-1 flex-shrink-0`"></i>
    <div class="flex-1 min-w-0">
      <p class="label text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">{{ label }}</p>
      <p class="value text-sm sm:text-base lg:text-lg text-gray-800 dark:text-gray-200 break-words">{{ value || '-' }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  icon: { type: String, default: '' },
  label: { type: String, required: true },
  value: { type: [String, Number], default: '-' },
  fullWidth: { type: Boolean, default: false }
});
</script>

<style scoped>
.info-item .label {
  margin-bottom: 0.125rem;
  white-space: normal;
  overflow-wrap: anywhere; /* allow long words to break */
  word-break: break-word; /* fallback */
}
.info-item .value { line-height: 1.2; }
@media (max-width: 639px) {
  .info-item { align-items: flex-start; }
  .info-item .label { font-size: 0.75rem; }
  .info-item .value { font-size: 0.9rem; }
}
@media (min-width: 1024px) {
  .info-item .label { font-size: 0.95rem; }
  .info-item .value { font-size: 1rem; }
}
</style>