<template>
  <div>
    <Toast />
    <ConfirmPopup group="headless">
        <template #container="{ message, acceptCallback, rejectCallback }">
            <div class="rounded p-4 bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
                <span class="text-gray-900 dark:text-white block mb-4">{{ message.message }}</span>
                <div class="flex items-center gap-2">
                    <Button label="Delete" severity="danger" @click="acceptCallback" size="small"></Button>
                    <Button label="Cancel" severity="secondary" outlined @click="rejectCallback" size="small"></Button>
                </div>
            </div>
        </template>
    </ConfirmPopup>

    <div class="card flex justify-between items-center flex-wrap gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
      <p class="text-xl font-bold text-gray-900 dark:text-white">Lecturer List</p>
      <div class="flex gap-2">
        <Button label="Add New" icon="pi pi-plus" severity="info" @click="openNew" />
      </div>
    </div>
    
    <Divider />
    
    <Card>
      <template #content>
        <DataTable 
            :value="lecturers" 
            :paginator="true" 
            :rows="10" 
            dataKey="id" 
            :loading="loading"
            tableStyle="min-width: 50rem"
        >
          <Column field="identity_id" header="ID" sortable></Column>
          <Column field="name.khmer" header="Name (KH)" sortable></Column>
          <Column field="name.english" header="Name (EN)" sortable></Column>
          <Column field="gender" header="Gender" sortable></Column>
          <Column field="phone" header="Phone"></Column>
          <Column field="email" header="Email"></Column>
          <Column field="faculty" header="Faculty" sortable></Column>
          <Column header="Actions" :exportable="false" style="min-width: 10rem">
            <template #body="slotProps">
              <div class="flex gap-2">
                <Button icon="pi pi-eye" severity="info" text rounded aria-label="View" @click="viewLecturer(slotProps.data)" />
                <Button icon="pi pi-pencil" severity="warning" text rounded aria-label="Edit" @click="editLecturer(slotProps.data)" />
                <Button icon="pi pi-trash" severity="danger" text rounded aria-label="Delete" @click="confirmDelete($event, slotProps.data)" />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- View Dialog -->
    <Dialog v-model:visible="viewDialogVisible" modal header="Lecturer Details" :style="{ width: '50vw' }" :breakpoints="{ '960px': '75vw', '641px': '100vw' }">
        <LectureDetail v-if="selectedLecturer" :lecture="selectedLecturer" />
    </Dialog>

    <!-- Edit/New Dialog -->
    <Dialog v-model:visible="editDialogVisible" modal :header="selectedLecturer?.id ? 'Edit Lecturer' : 'New Lecturer'" :style="{ width: '50vw' }" :breakpoints="{ '960px': '75vw', '641px': '100vw' }">
        <LectureForm 
            v-if="editDialogVisible" 
            :lecture="selectedLecturer" 
            @save="saveLecturer" 
            @cancel="editDialogVisible = false" 
        />
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Dialog from 'primevue/dialog';
import Divider from 'primevue/divider';
import Toast from 'primevue/toast';
import ConfirmPopup from 'primevue/confirmpopup';
import LectureForm from './LectureForm.vue';
import LectureDetail from './LectureDetail.vue';
import { getLecturers, createLecturer, updateLecturer, deleteLecturer } from '../../service/lecture.service';

const lecturers = ref([]);
const loading = ref(false);
const viewDialogVisible = ref(false);
const editDialogVisible = ref(false);
const selectedLecturer = ref({});
const toast = useToast();
const confirm = useConfirm();

const loadLecturers = async () => {
    loading.value = true;
    try {
        const response = await getLecturers();
        // Handle response structure (array or object with list)
        lecturers.value = Array.isArray(response) ? response : (response.lecturers || []);
    } catch (error) {
        console.error("Failed to load lecturers", error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load lecturers', life: 3000 });
    } finally {
        loading.value = false;
    }
};

const openNew = () => {
    selectedLecturer.value = {};
    editDialogVisible.value = true;
};

const editLecturer = (lecture) => {
    selectedLecturer.value = { ...lecture };
    editDialogVisible.value = true;
};

const viewLecturer = (lecture) => {
    selectedLecturer.value = lecture;
    viewDialogVisible.value = true;
};

const saveLecturer = async (lectureData) => {
    try {
        if (lectureData.id) {
            await updateLecturer(lectureData.id, lectureData);
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Lecturer Updated', life: 3000 });
        } else {
            await createLecturer(lectureData);
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Lecturer Created', life: 3000 });
        }
        editDialogVisible.value = false;
        loadLecturers();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save lecturer', life: 3000 });
    }
};

const confirmDelete = (event, lecture) => {
    confirm.require({
        target: event.currentTarget,
        group: 'headless',
        message: `Are you sure you want to delete ${lecture.name?.english || lecture.name?.khmer}?`,
        accept: async () => {
            try {
                await deleteLecturer(lecture.id);
                toast.add({ severity: 'success', summary: 'Confirmed', detail: 'Lecturer deleted', life: 3000 });
                loadLecturers();
            } catch (error) {
                toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete lecturer', life: 3000 });
            }
        }
    });
};

onMounted(() => {
    loadLecturers();
});
</script>