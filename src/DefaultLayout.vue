<template>
  <div class="w-[1280px] h-screen flex flex-col">
    <HeaderMenuComponent />
    <RouterView />
  </div>
</template>

<script setup>
import HeaderMenuComponent from './components/HeaderMenuComponent.vue';

</script>