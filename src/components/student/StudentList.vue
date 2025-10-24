<template>
  <div>
    <Toast />
    <input type="file" ref="fileInput" @change="onFileSelected" style="display: none"
      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
    <div class="card flex justify-between itam-center flex-wrap gap-4">
      <p class="text-2xl font-bold">Student List</p>
      <div class="card flex justify-end flex-wrap gap-4">
        <Button label="Export Card" @click="exportCard" />
        <Button label="Excel Import" severity="success" @click="importFromExcel" :loading="isUploading" />
        <Button label="Add New" severity="info" />
        <Button label="Delete" severity="danger" />
      </div>
    </div>
    <Divider />
    <Card>
      <template #content>
        <DataTable v-model:selection="selectedStudents" :value="students" :paginator="true" :rows="rows" :first="first"
          :totalRecords="totalRecords" :lazy="true" @page="loadStudents" dataKey="id" tableStyle="min-width: 50rem">
          <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
          <Column field="card_id" header="Card ID"></Column>
          <Column field="name.english" header="Name (EN)"></Column>
          <Column field="name.khmer" header="Name (KH)"></Column>
          <Column field="gender" header="Gender"></Column>
          <Column field="phone" header="Phone"></Column>
          <Column field="batch" header="Batch"></Column>
          <Column header="Photo" :body="photoTemplate"></Column>
        </DataTable>
      </template>
    </Card>
  </div>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { getStudents, uploadExcel } from '../../service/student.service.js';
import { Button, Card, Divider } from 'primevue';
import { useRouter } from 'vue-router';

const students = ref([]);
const selectedStudents = ref([]);
const isUploading = ref(false);
const fileInput = ref(null);
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

const importFromExcel = () => {
  fileInput.value.click();
};

const onFileSelected = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  isUploading.value = true;
  const formData = new FormData();
  formData.append('file', file);

  try {
    await uploadExcel(formData);
    // toast.add({ severity: 'success', summary: 'Success', detail: 'Students imported successfully', life: 3000 });
    loadStudents(); // Refresh the list
  } catch (error) {
    console.error('Error uploading Excel file:', error);
    // toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to import students', life: 3000 });
  } finally {
    isUploading.value = false;
    event.target.value = ''; // Reset file input
  }
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