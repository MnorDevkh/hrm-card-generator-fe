<template>
  <div class="p-4 sm:p-6 lg:p-8 space-y-4 w-7xl  mx-auto">
  
    <h2>Staff List</h2>
    <DataTable :value="[]" responsiveLayout="scroll">
      <Column field="id" header="ID"></Column>
      <Column field="name" header="Name"></Column>
      <Column field="position" header="Position"></Column>
      <Column field="phone" header="Phone"></Column>
    </DataTable>
  </div>
</template>

<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
</script>