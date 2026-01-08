<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import DefaultLayout from './DefaultLayout.vue';
import BlankLayout from './BlankLayout.vue';


const route = useRoute();

const layouts = {
  DefaultLayout,
  BlankLayout
};

// Determine the layout for the current route.
// Fallback to DefaultLayout if no layout is specified in the route's meta.
const layoutComponent = computed(() => {
  const layoutName = route.meta.layout as keyof typeof layouts;
  return layouts[layoutName] || DefaultLayout;
});
</script>

<template>
  <div class="app-container">
    <component :is="layoutComponent" />
  </div>
</template>

<style scoped>
.app-container {
  width: 1800px;
  min-height: 100vh;
}
</style>