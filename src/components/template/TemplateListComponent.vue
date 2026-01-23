<template>
    <input type="file" ref="fileInput" @change="onFileSelected" style="display: none" accept="image/*" />
    <div class="container mx-auto p-4 md:p-8">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Certificate Templates</h2>
            <Button type="primary" @click="triggerFileUpload" :loading="isUploading">
                <template #icon>
                    <UploadOutlined />
                </template>
                Upload Template
            </Button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <Card v-for="template in templates" :key="template.id" hoverable class="shadow-lg transition-shadow duration-300 rounded-lg overflow-hidden">
                <template #cover>
                    <div class="h-90% w-96 overflow-hidden bg-gray-100 dark:bg-gray-700">
                        <img alt="template header" :src="getImageUrl(template.filename)" class="w-full h-full object-contain" />
                    </div>
                </template>
                <div class="flex flex-col gap-2">
                    <div class="flex gap-2 mt-4">
                        <Button type="primary" class="flex-1" @click="useTemplate(template.id)">
                            <template #icon>
                                <CheckOutlined />
                            </template>
                            Use Template
                        </Button>
                        <Button danger @click="confirmDelete(template)">
                            <template #icon>
                                <DeleteOutlined />
                            </template>
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    </div>

</template>

<script setup>
import { ref, onMounted, computed, createVNode } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Button, Card, Modal, message } from 'ant-design-vue';
import { UploadOutlined, CheckOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { getImagesByType, uploadImage, deleteImage } from '../../service/image.service';
import { environment } from '../../environments/environment';

const templates = ref([]);
const router = useRouter();
const route = useRoute();

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
        message.success('Template uploaded successfully');
        await loadTemplates(); // Refresh the list
    } catch (error) {
        console.error('Error uploading template:', error);
        message.error('Failed to upload template');
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
    return `${environment.apiBaseUrl}media/image/${filename}`;
};

const useTemplate = (templateId) => {
    // Navigate to the generate page with the template ID and student IDs
    if (type.value === 'lecturer') {
        router.push({ path: '/card-generator/lecturer', query: { templateId, ids: JSON.stringify(studentIds.value), type: 'lecturer' } });
    } else {
        router.push({ path: '/generate', query: { templateId, ids: JSON.stringify(studentIds.value) } });
    }
};

const confirmDelete = (template) => {
    Modal.confirm({
        title: 'Delete Confirmation',
        icon: createVNode(ExclamationCircleOutlined),
        content: 'Are you sure you want to delete this template?',
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        async onOk() {
            try {
                await deleteImage(template.id);
                message.success('Template deleted');
                loadTemplates();
            } catch (error) {
                message.error('Failed to delete template');
            }
        }
    });
};
</script>
