<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h3 class="text-lg font-semibold mb-4 text-gray-800">
      {{ title }}
    </h3>
    <div v-if="hasData" class="space-y-3">
      <div
        v-for="(item, index) in normalizedItems"
        :key="item.label"
        class="flex items-center gap-3"
      >
        <span class="w-28 text-sm text-gray-600 truncate">
          {{ item.label }}
        </span>
        <div class="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            class="h-3 rounded-full bg-blue-500 transition-all"
            :style="{ width: item.percentage + '%' }"
          />
        </div>
        <span class="w-12 text-right text-sm font-medium text-gray-800">
          {{ item.value }}
        </span>
      </div>
    </div>
    <div v-else class="text-sm text-gray-500">
      No data available.
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  items: {
    type: Array,
    default: () => []
  }
});

const hasData = computed(() => Array.isArray(props.items) && props.items.length > 0);

const normalizedItems = computed(() => {
  if (!hasData.value) return [];
  const max = Math.max(...props.items.map((i) => Number(i.value) || 0), 1);
  return props.items.map((i) => ({
    label: i.label,
    value: i.value,
    percentage: Math.round(((Number(i.value) || 0) / max) * 100)
  }));
});
</script>

