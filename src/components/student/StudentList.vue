<template>
  <div class="card">
    <h2>Student List</h2>
     <div class="card flex justify-end flex-wrap gap-4">
        <Button label="Export Card"  @click="exportCard" />
        <Button label="Excell Import" severity="success" />
        <Button label="Add news " severity="success" />
        <Button label="Delete" severity="danger" />
    </div>
    <Divider />
      <DataTable
        v-model:selection="selectedStudents"
        :value="students"
        :paginator="true"
        :rows="rows"
        :first="first"
        :totalRecords="totalRecords"
        :lazy="true"
        @page="loadStudents"
        dataKey="id"
        tableStyle="min-width: 50rem"
      >
        <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
        <Column field="card_id" header="Card ID"></Column>
        <Column field="name.english" header="Name (EN)"></Column>
        <Column field="name.khmer" header="Name (KH)"></Column>
        <Column field="gender" header="Gender"></Column>
        <Column field="phone" header="Phone"></Column>
        <Column field="batch" header="Batch"></Column>
        <Column header="Photo" :body="photoTemplate"></Column>
      </DataTable>
    </div>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { getStudents } from '../../service/student.service.js';
import { Button, Divider } from 'primevue';
import { useRouter } from 'vue-router';

const students = ref([]);
const selectedStudents = ref([]);
const totalRecords = ref(0);
const rows = ref(10);
const first = ref(0);
const router = useRouter();
const photoTemplate = (row) => {
  if (row.photo) {
    return `<img src="/uploads/${row.photo}" alt="photo" style="width:40px;height:40px;border-radius:50%;">`;
  }
  return `<span style="color:#bbb;">No Photo</span>`;
};

const loadStudents = async (event = { first: 0, rows: 20 }) => {
  const response = await getStudents(event.first, event.rows);
  students.value = response.students;
  totalRecords.value = response.total;
  first.value = event.first;
  rows.value = event.rows;
};
const exportCard = () => {
  const ids = selectedStudents.value.map(s => s.id);
  console.log(ids);
  
  router.push({ path: '/template', query: { ids: JSON.stringify(ids) } });
};

onMounted(async () => {
   loadStudents();
});
</script>