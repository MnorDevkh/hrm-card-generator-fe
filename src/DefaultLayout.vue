<template>
  <div class="w-full h-screen flex flex-col">
    <HeaderMenuComponent />
    <AppLayout />
    <!-- <RouterView /> -->
  </div>
</template>

<script setup>
import HeaderMenuComponent from './components/HeaderMenuComponent.vue';
import AppLayout from './router/AppLayout.vue';

</script>