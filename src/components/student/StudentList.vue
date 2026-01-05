<template>
  <div>
    <Toast />
    <ConfirmDialog />
    <input type="file" ref="fileInput" @change="onFileSelected" style="display: none"
      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
    <div class="card flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
      <p class="text-xl font-bold text-gray-900 dark:text-white w-full sm:w-auto text-center sm:text-left">បញ្ញីរសិស្ស</p>
      <Divider />
      <div class="card flex flex-col sm:flex-row sm:flex-wrap justify-end gap-4 w-full sm:w-auto">
        <Button label="Export Card" @click="exportCard" class="w-full sm:w-auto" />
        <Button label="Excel Import" severity="success" @click="importFromExcel" :loading="isUploading" class="w-full sm:w-auto" />
        <Button label="Add New" severity="info" @click="openNew" class="w-full sm:w-auto" />
        <Button label="Delete" severity="danger" class="w-full sm:w-auto" />
      </div>
    </div>
    <Divider />
    <Card>
      <template #content>
        <div class="overflow-x-auto">
          <DataTable v-model:selection="selectedStudents" :value="students" :paginator="true" :rows="rows" :first="first"
            :totalRecords="totalRecords" :lazy="true" @page="loadStudents" dataKey="id" tableStyle="min-width: 80rem"
            :selectAll="selectAll" @select-all-change="onSelectAllChange" @row-unselect="onRowUnselect">
            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
            <Column header="No">
              <template #body="slotProps">
                {{ first + slotProps.index + 1 }}
              </template>
            </Column>
            <Column field="card_id" header="Card ID"></Column>
            <Column field="name.english" header="Name (EN)"></Column>
            <Column field="name.khmer" header="Name (KH)"></Column>
            <Column field="gender" header="Gender"></Column>
            <Column field="phone" header="Phone"></Column>
            <Column field="batch" header="Batch"></Column>
            <Column header="Photo" :body="photoTemplate"></Column>
            <Column header="Actions" :exportable="false" style="min-width: 10rem">
              <template #body="slotProps">
                <div class="flex gap-2">
                  <Button icon="pi pi-eye" severity="info" text rounded aria-label="View" @click="viewStudent(slotProps.data)" />
                  <Button icon="pi pi-pencil" severity="warning" text rounded aria-label="Edit" @click="editStudent(slotProps.data)" />
                  <Button icon="pi pi-trash" severity="danger" text rounded aria-label="Delete" @click="requireConfirmation($event, slotProps.data)" label="Delete" ></Button>
                </div>
              </template>
            </Column>
          </DataTable>
        </div>
      </template>
    </Card>

    <!-- View Student Dialog -->
    <Dialog v-model:visible="viewDialogVisible" modal header="Student Details" :style="{ width: '70vw' }" :breakpoints="{ '960px': '75vw', '641px': '100vw' }">
      <StudentDetail v-if="selectedStudent" :studentId="selectedStudent.id" :identityId="selectedStudent.identity_id" :embedded="true" :cardId="selectedStudent.card_id" />
    </Dialog>

    <!-- Edit Student Dialog -->
    <Dialog v-model:visible="editDialogVisible" modal :header="selectedStudent && selectedStudent.id ? 'Edit Student' : 'New Student'" :style="{ width: '80vw' }" :breakpoints="{ '960px': '90vw', '641px': '100vw' }">
      <StudentForm 
        v-if="editDialogVisible" 
        :student="selectedStudent" 
        @save="saveStudent" 
        @cancel="editDialogVisible = false" 
      />
    </Dialog>
    <ConfirmPopup group="headless">
        <template #container="{ message, acceptCallback, rejectCallback }">
            <div class="rounded p-4">
                <span>{{ message.message }}</span>
                <div class="flex items-center gap-2 mt-4">
                    <Button label="Delete" severity="danger" @click="acceptCallback" size="small"></Button>
                    <Button label="Cancel" variant="outlined" @click="rejectCallback" severity="secondary" size="small" text></Button>
                </div>
            </div>
        </template>
    </ConfirmPopup>
  </div>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ConfirmPopup from 'primevue/confirmpopup';
import Toast from 'primevue/toast';
import { getStudents, uploadExcel, deleteStudent, updateStudent, createStudent } from '../../service/student.service.js';
import { Button, Card, Divider } from 'primevue';
import { useRouter } from 'vue-router';
import Dialog from 'primevue/dialog';
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import StudentDetail from './StudentDetail.vue';
import StudentForm from './StudentForm.vue';

const students = ref([]);
const selectedStudents = ref([]);
const isUploading = ref(false);
const fileInput = ref(null);
const totalRecords = ref(0);
const rows = ref(10);
const first = ref(0);
const selectAll = ref(false);
const router = useRouter();
const confirm = useConfirm();
const toast = useToast();

const viewDialogVisible = ref(false);
const editDialogVisible = ref(false);
const selectedStudent = ref(null);

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

  if (selectAll.value) {
    const newSelection = [...selectedStudents.value];
    students.value.forEach(student => {
      if (!newSelection.some(s => s.id === student.id)) {
        newSelection.push(student);
      }
    });
    selectedStudents.value = newSelection;
  }
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
  router.push({ path: '/template', query: { ids: JSON.stringify(ids) } });
};

const viewStudent = (student) => {
  selectedStudent.value = student;
  viewDialogVisible.value = true;
};

const openNew = () => {
  selectedStudent.value = {}; // Form component handles defaults
  editDialogVisible.value = true;
};

const editStudent = (student) => {
  selectedStudent.value = student;
  editDialogVisible.value = true;
};

const saveStudent = async (studentData) => {
  try {
    if (studentData.id) {
      await updateStudent(studentData.id, studentData);
      toast.add({ severity: 'success', summary: 'Successful', detail: 'Student Updated', life: 3000 });
    } else {
      await createStudent(studentData);
      toast.add({ severity: 'success', summary: 'Successful', detail: 'Student Created', life: 3000 });
    }
    editDialogVisible.value = false;
    loadStudents();
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save student', life: 3000 });
  }
};

const onSelectAllChange = (event) => {
  selectAll.value = event.checked;

  if (selectAll.value) {
    const newSelection = [...selectedStudents.value];
    students.value.forEach(student => {
      if (!newSelection.some(s => s.id === student.id)) {
        newSelection.push(student);
      }
    });
    selectedStudents.value = newSelection;
  } else {
    selectedStudents.value = [];
  }
};

const onRowUnselect = () => {
  selectAll.value = false;
};

const requireConfirmation = (event, student) => {
    confirm.require({
        target: event.currentTarget,
        group: 'headless',
        message: `Are you sure you want to delete ${student.name.english}?`,
        accept: async () => {
            try {
                await deleteStudent(student.id);
                toast.add({severity:'success', summary:'Confirmed', detail:'Student deleted', life: 3000});
                loadStudents();
            } catch (error) {
                toast.add({severity:'error', summary:'Error', detail:'Failed to delete student', life: 3000});
            }
        },
        reject: () => {
        }
    });
}
onMounted(async () => {
  loadStudents();
});
</script>