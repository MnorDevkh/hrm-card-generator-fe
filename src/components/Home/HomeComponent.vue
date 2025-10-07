<script setup>
import HelloWorld from '../HelloWorld.vue';
import MenuComponent from './MenuComponent.vue';
</script>

<template>
  <div class="">
    <div class="flex align-items-center justify-content-between p-10">
      <div class="">
        <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />
        <div>
          <HelloWorld msg="You did it!" />
        </div>
      </div>
      <div>
        <MenuComponent />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>