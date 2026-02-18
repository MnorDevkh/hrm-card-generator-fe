<template>
  <div class="p-3 min-w-[200px]" @mousedown.prevent>
    <Select
      v-model:value="mode"
      placeholder="Filter by"
      class="w-full mb-2"
      :options="modeOptions"
    />
    <Input
      v-model:value="text"
      placeholder="Contains text..."
      allow-clear
      class="mb-3"
      @pressEnter="apply"
    />
    <div class="flex justify-between gap-2">
      <Button size="small" @click="reset">Reset</Button>
      <Button type="primary" size="small" @click="apply">OK</Button>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue';
import { Select, Input, Button } from 'ant-design-vue';

const props = defineProps({
  columnKey: { type: String, required: true },
  filterState: { type: Object, required: true },
  confirm: { type: Function, default: () => {} },
  clearFilters: { type: Function, default: () => {} },
});

const modeOptions = [
  { value: 'all', label: 'All' },
  { value: 'empty', label: 'Empty' },
  { value: 'filled', label: 'Has value' },
];

const state = computed({
  get() {
    const store = props.filterState?.value ?? props.filterState;
    return store?.[props.columnKey] || { mode: 'all', text: '' };
  },
  set(val) {
    const store = props.filterState?.value ?? props.filterState;
    if (!store) return;
    if (!store[props.columnKey]) store[props.columnKey] = { mode: 'all', text: '' };
    store[props.columnKey] = { ...store[props.columnKey], ...val };
  },
});

const mode = computed({
  get: () => state.value.mode,
  set: (v) => { state.value = { mode: v }; },
});

const text = computed({
  get: () => state.value.text || '',
  set: (v) => { state.value = { text: v ?? '' }; },
});

function reset() {
  const store = props.filterState?.value ?? props.filterState;
  if (store) store[props.columnKey] = { mode: 'all', text: '' };
  props.clearFilters?.();
  props.confirm?.();
}

function apply() {
  const store = props.filterState?.value ?? props.filterState;
  if (store) store[props.columnKey] = { mode: mode.value, text: text.value ?? '' };
  props.confirm?.();
}
</script>
