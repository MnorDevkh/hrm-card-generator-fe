<template>
  <div class="info-card px-4 sm:px-6 py-3 lg:py-4">
    <h3
      class="title text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">
      {{ title }}
    </h3>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({ title: { type: String, required: true } });
</script>

<style scoped>
.info-card { width: 100%; }
.title { margin-bottom: 0.5rem; }
@media (min-width: 640px) {
  .title { font-size: 1.125rem; }
}
@media (min-width: 1024px) {
  .title { font-size: 1.25rem; }
}
</style>