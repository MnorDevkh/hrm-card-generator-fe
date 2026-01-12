<template>
    <div class="card">
        <div class="flex justify-center mb-6">
            <div class="w-32 h-32 rounded-lg h-38 overflow-hidden bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center">
                <img v-if="lecture.photo" :src="getPhotoUrl(lecture.photo)" alt="Profile" class="w-full h-full object-cover" />
                <i v-else class="pi pi-user text-4xl text-gray-400"></i>
            </div>
        </div>
        <ul class="list-none p-0 m-0">
            <li class="flex items-center py-3 px-2 border-b border-gray-200 dark:border-gray-700 flex-wrap">
                <div class="text-gray-500 dark:text-gray-400 w-full md:w-1/4 font-medium">Identity ID</div>
                <div class="text-gray-900 dark:text-white w-full md:w-3/4">{{ lecture.identity_id }}</div>
            </li>
            <li class="flex items-center py-3 px-2 border-b border-gray-200 dark:border-gray-700 flex-wrap">
                <div class="text-gray-500 dark:text-gray-400 w-full md:w-1/4 font-medium">Name (Khmer)</div>
                <div class="text-gray-900 dark:text-white w-full md:w-3/4">{{ lecture.name?.khmer }}</div>
            </li>
            <li class="flex items-center py-3 px-2 border-b border-gray-200 dark:border-gray-700 flex-wrap">
                <div class="text-gray-500 dark:text-gray-400 w-full md:w-1/4 font-medium">Name (English)</div>
                <div class="text-gray-900 dark:text-white w-full md:w-3/4">{{ lecture.name?.english }}</div>
            </li>
            <li class="flex items-center py-3 px-2 border-b border-gray-200 dark:border-gray-700 flex-wrap">
                <div class="text-gray-500 dark:text-gray-400 w-full md:w-1/4 font-medium">Gender</div>
                <div class="text-gray-900 dark:text-white w-full md:w-3/4">{{ lecture.gender }}</div>
            </li>
            <li class="flex items-center py-3 px-2 border-b border-gray-200 dark:border-gray-700 flex-wrap">
                <div class="text-gray-500 dark:text-gray-400 w-full md:w-1/4 font-medium">Nationality</div>
                <div class="text-gray-900 dark:text-white w-full md:w-3/4">{{ lecture.nationality }}</div>
            </li>
            <li class="flex items-center py-3 px-2 border-b border-gray-200 dark:border-gray-700 flex-wrap">
                <div class="text-gray-500 dark:text-gray-400 w-full md:w-1/4 font-medium">Birth Date</div>
                <div class="text-gray-900 dark:text-white w-full md:w-3/4">{{ formatDate(lecture.birth_date) }}</div>
            </li>
            <li class="flex items-center py-3 px-2 border-b border-gray-200 dark:border-gray-700 flex-wrap">
                <div class="text-gray-500 dark:text-gray-400 w-full md:w-1/4 font-medium">Birth Place</div>
                <div class="text-gray-900 dark:text-white w-full md:w-3/4">{{ formatAddress(lecture.birth_place) }}</div>
            </li>
            <li class="flex items-center py-3 px-2 border-b border-gray-200 dark:border-gray-700 flex-wrap">
                <div class="text-gray-500 dark:text-gray-400 w-full md:w-1/4 font-medium">Current Address</div>
                <div class="text-gray-900 dark:text-white w-full md:w-3/4">{{ formatAddress(lecture.current_address) }}</div>
            </li>
            <li class="flex items-center py-3 px-2 border-b border-gray-200 dark:border-gray-700 flex-wrap">
                <div class="text-gray-500 dark:text-gray-400 w-full md:w-1/4 font-medium">Phone</div>
                <div class="text-gray-900 dark:text-white w-full md:w-3/4">{{ lecture.phone }}</div>
            </li>
            <li class="flex items-center py-3 px-2 border-b border-gray-200 dark:border-gray-700 flex-wrap">
                <div class="text-gray-500 dark:text-gray-400 w-full md:w-1/4 font-medium">Email</div>
                <div class="text-gray-900 dark:text-white w-full md:w-3/4">{{ lecture.email }}</div>
            </li>
            <li class="flex items-center py-3 px-2 border-b border-gray-200 dark:border-gray-700 flex-wrap">
                <div class="text-gray-500 dark:text-gray-400 w-full md:w-1/4 font-medium">Education</div>
                <div class="text-gray-900 dark:text-white w-full md:w-3/4">{{ formatEducation(lecture.education) }}</div>
            </li>
            <li class="flex items-center py-3 px-2 border-b border-gray-200 dark:border-gray-700 flex-wrap">
                <div class="text-gray-500 dark:text-gray-400 w-full md:w-1/4 font-medium">Faculty</div>
                <div class="text-gray-900 dark:text-white w-full md:w-3/4">{{ lecture.faculty }}</div>
            </li>
            <li class="flex items-center py-3 px-2 border-b border-gray-200 dark:border-gray-700 flex-wrap">
                <div class="text-gray-500 dark:text-gray-400 w-full md:w-1/4 font-medium">Major</div>
                <div class="text-gray-900 dark:text-white w-full md:w-3/4">{{ lecture.major }}</div>
            </li>
            <li class="flex items-center py-3 px-2 flex-wrap">
                <div class="text-gray-500 dark:text-gray-400 w-full md:w-1/4 font-medium">Notes</div>
                <div class="text-gray-900 dark:text-white w-full md:w-3/4">{{ lecture.notes }}</div>
            </li>
            <li v-if="lecture.docs && lecture.docs.length" class="flex items-center py-3 px-2 border-t border-gray-200 dark:border-gray-700 flex-wrap">
                <div class="text-gray-500 dark:text-gray-400 w-full md:w-1/4 font-medium">Documents</div>
                <div class="text-gray-900 dark:text-white w-full md:w-3/4">
                    <div v-for="(doc, index) in lecture.docs" :key="index" class="mb-1">
                        <a href="#" @click.prevent="downloadFile(doc.file_path)" class="text-blue-500 hover:underline flex items-center gap-2">
                            <i class="pi pi-file"></i>
                            {{ doc.file_path || 'Document ' + (index + 1) }}
                        </a>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { environment } from '../../environments/environment';
defineProps({
    lecture: Object
});

const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
};

const formatAddress = (address) => {
    if (!address) return '';
    const parts = [address.village, address.commune, address.district, address.province];
    return parts.filter(part => part).join(', ');
};

const formatEducation = (education) => {
    if (!education) return '';
    const parts = [education.level, education.year, education.training_institution];
    return parts.filter(part => part).join(' - ');
};

const getPhotoUrl = (photo) => (photo ? `${environment.apiBaseUrl}media/image/${photo}` : '');

const getFileUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${environment.apiBaseUrl}${path}`;
};

const downloadFile = async (filePath) => {
    if (!filePath) return;
    const url = getFileUrl(filePath);
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = filePath.split('/').pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
    } catch (error) {
        window.open(url, '_blank');
    }
};
</script>