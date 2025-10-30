<template>
  <div class="w-full h-screen flex flex-col">
    <HeaderMenuComponent />
    <RouterView />
  </div>
</template>

<script setup>
import HeaderMenuComponent from './components/HeaderMenuComponent.vue';

</script>