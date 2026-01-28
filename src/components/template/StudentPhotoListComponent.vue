<template>
    <ConfigProvider :theme="{ token: { fontFamily: 'inherit' } }">
    <input type="file" ref="fileInput" @change="onFileSelected" style="display: none" accept="image/*" multiple />
    <div class="container mx-auto p-4 md:p-8">
        <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h2 class="text-2xl font-bold text-gray-800">Student Photos</h2>
            <div class="flex gap-2 w-full md:w-auto">
                <Input v-model:value="searchQuery" placeholder="Search by name" class="w-full md:w-64">
                    <template #prefix>
                        <SearchOutlined />
                    </template>
                </Input>
                <Button type="primary" @click="triggerFileUpload" :loading="isUploading">
                    <template #icon><UploadOutlined /></template>
                    Upload Photo
                </Button>
            </div>
        </div>

        <div v-if="isUploading" class="mb-6">
            <Progress :percent="progressValue" class="mb-2" />
            <div class="text-sm text-gray-600 text-center">Uploading {{ currentFileIndex }} of {{ totalFiles }} files...</div>
        </div>

        <div v-if="loading">Loading photos...</div>
        <div v-else-if="error" class="text-red-500">{{ error }}</div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8">
            <Card v-for="photo in studentPhotos" :key="photo.id" hoverable class="shadow-lg rounded-lg overflow-hidden">
                <template #cover>
                    <div class="h-64 overflow-hidden">
                        <img :alt="photo.filename" :src="getImageUrl(photo.filename)" class="w-full h-full object-cover" />
                    </div>
                </template>
                <CardMeta :title="photo.filename" :description="photo.type" />
                <template #actions>
                    <Button danger type="text" @click="onDeletePhoto(photo)" block>
                        <template #icon><DeleteOutlined /></template>
                        Delete
                    </Button>
                </template>
            </Card>
        </div>
        <div v-if="!loading && studentPhotos.length === 0" class="text-center text-gray-500">No student photos found.</div>
    </div>
    </ConfigProvider>
</template>

<script setup>
import { ref, computed, onMounted, createVNode } from 'vue';
import { Button, Card, Input, Progress, Modal, message, ConfigProvider } from 'ant-design-vue';
import { SearchOutlined, UploadOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { getImagesByType, uploadImage, deleteImage } from '../../service/image.service';
import { environment } from '../../environments/environment';

const CardMeta = Card.Meta;

const photos = ref([]);
const loading = ref(false);
const error = ref(null);
const isUploading = ref(false);
const fileInput = ref(null);
const progressValue = ref(0);
const currentFileIndex = ref(0);
const totalFiles = ref(0);
const searchQuery = ref('');

const fetchPhotos = async () => {
    loading.value = true;
    try {
        photos.value = await getImagesByType('student_photo');
    } catch (err) {
        error.value = err.message;
        message.error('Failed to load photos');
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
            message.error(`Failed to upload ${file.name}`);
        } finally {
            currentFileIndex.value++;
            progressValue.value = Math.round((currentFileIndex.value / totalFiles.value) * 100);
        }
    }

    message.success(`Uploaded ${successCount} of ${totalFiles.value} photos`);
    isUploading.value = false;
    event.target.value = '';
    await fetchPhotos();
};

const onDeletePhoto = (photo) => {
    Modal.confirm({
        title: 'Are you sure you want to delete this photo?',
        icon: createVNode(ExclamationCircleOutlined),
        content: 'This action cannot be undone.',
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        async onOk() {
            try {
                await deleteImage(photo.id);
                message.success('Photo deleted successfully');
                await fetchPhotos();
            } catch (error) {
                console.error('Error deleting photo:', error);
                message.error('Failed to delete photo');
            }
        },
    });
};

const getImageUrl = (filename) => {
    return `${environment.apiBaseUrl}media/image/${filename}`;
};

onMounted(fetchPhotos);

const studentPhotos = computed(() => {
    if (!searchQuery.value) return photos.value;
    return photos.value.filter(photo => 
        photo.filename.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});
</script>