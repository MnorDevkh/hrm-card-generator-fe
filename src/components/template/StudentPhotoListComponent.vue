<template>
    <Toast />
    <input type="file" ref="fileInput" @change="onFileSelected" style="display: none" accept="image/*" multiple />
    <div class="container mx-auto p-4 md:p-8">
        <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h2 class="text-2xl font-bold text-gray-800">Student Photos</h2>
            <div class="flex gap-2 w-full md:w-auto">
                <span class="p-input-icon-left w-full md:w-64">
                    <i class="pi pi-search" />
                    <InputText v-model="searchQuery" placeholder="Search by name" class="w-full" />
                </span>
                <Button label="Upload Photo" icon="pi pi-upload" severity="info" @click="triggerFileUpload" :loading="isUploading" />
            </div>
        </div>

        <div v-if="isUploading" class="mb-6">
            <ProgressBar :value="progressValue" class="h-2 mb-2" />
            <div class="text-sm text-gray-600 text-center">Uploading {{ currentFileIndex }} of {{ totalFiles }} files...</div>
        </div>

        <div v-if="loading">Loading photos...</div>
        <div v-else-if="error" class="text-red-500">{{ error }}</div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <Card v-for="photo in studentPhotos" :key="photo.id" class="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden">
                <template #header>
                    <div class="h-64 overflow-hidden">
                        <img :alt="photo.filename" :src="getImageUrl(photo.filename)" class="w-full h-full object-cover" />
                    </div>
                </template>
                <template #title>{{ photo.filename }}</template>
                <template #subtitle>{{ photo.type }}</template>
                <template #footer>
                    <Button label="Delete" icon="pi pi-trash" severity="danger" @click="onDeletePhoto(photo)" />
                </template>
            </Card>
        </div>
        <div v-if="!loading && studentPhotos.length === 0" class="text-center text-gray-500">No student photos found.</div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Toast from 'primevue/toast';
import InputText from 'primevue/inputtext';
import ProgressBar from 'primevue/progressbar';
import { useToast } from 'primevue/usetoast';
import { getImagesByType, uploadImage, deleteImage } from '../../service/image.service';
import { environment } from '../../environments/environment';

const photos = ref([]);
const loading = ref(false);
const error = ref(null);
const isUploading = ref(false);
const fileInput = ref(null);
const progressValue = ref(0);
const currentFileIndex = ref(0);
const totalFiles = ref(0);
const searchQuery = ref('');
const toast = useToast();

const fetchPhotos = async () => {
    loading.value = true;
    try {
        photos.value = await getImagesByType('student_photo');
    } catch (err) {
        error.value = err.message;
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load photos', life: 3000 });
    } finally {
        loading.value = false;
    }
};

const triggerFileUpload = () => {
    fileInput.value.click();
};

const onFileSelected = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    isUploading.value = true;
    totalFiles.value = files.length;
    currentFileIndex.value = 0;
    progressValue.value = 0;
    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'student_photo');

        try {
            await uploadImage(formData, 'student_photo');
            successCount++;
        } catch (error) {
            console.error(`Error uploading ${file.name}:`, error);
            toast.add({ severity: 'error', summary: 'Error', detail: `Failed to upload ${file.name}`, life: 3000 });
        } finally {
            currentFileIndex.value++;
            progressValue.value = Math.round((currentFileIndex.value / totalFiles.value) * 100);
        }
    }

    toast.add({ severity: 'success', summary: 'Completed', detail: `Uploaded ${successCount} of ${totalFiles.value} photos`, life: 3000 });
    isUploading.value = false;
    event.target.value = '';
    await fetchPhotos();
};

const onDeletePhoto = async (photo) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;

    try {
        await deleteImage(photo.id);
        toast.add({ severity: 'success', summary: 'Success', detail: 'Photo deleted successfully', life: 3000 });
        await fetchPhotos();
    } catch (error) {
        console.error('Error deleting photo:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete photo', life: 3000 });
    }
};

const getImageUrl = (filename) => {
    return `${environment.apiBaseUrl}upload_image/image/${filename}`;
};

onMounted(fetchPhotos);

const studentPhotos = computed(() => {
    if (!searchQuery.value) return photos.value;
    return photos.value.filter(photo => 
        photo.filename.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});
</script>