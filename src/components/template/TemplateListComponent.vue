<template>
    <Toast />
    <input type="file" ref="fileInput" @change="onFileSelected" style="display: none" accept="image/*" />
    <div class="container mx-auto p-4 md:p-8">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Certificate Templates</h2>
            <Button label="Upload Template" icon="pi pi-upload" severity="info" @click="triggerFileUpload" :loading="isUploading" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <Card v-for="template in templates" :key="template.id" class="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden">
                <template #header>
                    <div class="h-64 overflow-hidden">
                        <img alt="template header" :src="getImageUrl(template.filename)" class="w-full h-full object-cover" />
                    </div>
                </template>
                <template #title>{{ template.name || 'Template' }}</template>
                <template #subtitle>{{ template.type || 'Card Template' }}</template>
                <template #content>
                    <p class="m-0">
                        Use this template to generate certificates for the selected {{ type === 'lecturer' ? 'lecturers' : 'students' }}.
                    </p>
                </template>
                <template #footer>
                    <Button label="Use Template" icon="pi pi-check" class="w-full" @click="useTemplate(template.id)" />
                </template>
            </Card>
        </div>
    </div>

</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { getImagesByType, uploadImage } from '../../service/image.service';
import { environment } from '../../environments/environment';

const templates = ref([]);
const router = useRouter();
const route = useRoute();
const toast = useToast();

const fileInput = ref(null);
const isUploading = ref(false);

const type = computed(() => route.query.type || 'student');

const studentIds = computed(() => {
    try {
        // Get student IDs from the URL query parameter
        return JSON.parse(route.query.ids || '[]');
    } catch (e) {
        console.error("Failed to parse student IDs from query", e);
        return [];
    }
});

const triggerFileUpload = () => {
    fileInput.value.click();
};

const onFileSelected = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    isUploading.value = true;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'template');

    try {
        await uploadImage(formData, 'template');
        toast.add({ severity: 'success', summary: 'Success', detail: 'Template uploaded successfully', life: 3000 });
        await loadTemplates(); // Refresh the list
    } catch (error) {
        console.error('Error uploading template:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to upload template', life: 3000 });
    } finally {
        isUploading.value = false;
        event.target.value = ''; // Reset file input
    }
};

const loadTemplates = async () => {
    templates.value = await getImagesByType('template');
};

onMounted(async () => {
    await loadTemplates();
});

const getImageUrl = (filename) => {
    return `${environment.apiBaseUrl}upload_image/image/${filename}`;
};

const useTemplate = (templateId) => {
    // Navigate to the generate page with the template ID and student IDs
    if (type.value === 'lecturer') {
        router.push({ path: '/card-generator/lecturer', query: { templateId, ids: JSON.stringify(studentIds.value), type: 'lecturer' } });
    } else {
        router.push({ path: '/generate', query: { templateId, ids: JSON.stringify(studentIds.value) } });
    }
};
</script>
