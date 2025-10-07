<template>
  <div class="card">
    <h2>Lecture List</h2>
    <DataTable :value="[]" responsiveLayout="scroll">
      <Column field="id" header="ID"></Column>
      <Column field="name" header="Name"></Column>
      <Column field="department" header="Department"></Column>
      <Column field="phone" header="Phone"></Column>
    </DataTable>
  </div>
</template>

<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
</script>