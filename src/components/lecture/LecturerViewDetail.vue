<template>
    <div class="min-h-screen bg-gray-50/30 py-8 sm:py-12 px-4 sm:px-6">
        <div class="mx-auto space-y-6 sm:space-y-8">
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 text-center relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

                <div class="flex justify-center mb-6">
                    <img alt="Logo" src="@/assets/ailogo.png" class="w-20 h-20 sm:w-24 sm:h-24 object-contain drop-shadow-sm hover:scale-105 transition-transform duration-300" />
                </div>

                <div class="flex flex-col items-center gap-3">
                    <div class="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 text-green-700 rounded-full border border-green-100 shadow-sm">
                        <CheckCircleOutlined class="text-lg" />
                        <span class="font-bold font-khmer text-sm sm:text-base">ឯកសារមានសុពលភាព</span>
                    </div>

                    <div class="space-y-1">
                        <p class="text-gray-500 font-khmer text-xs sm:text-sm">ចេញដោយ</p>
                        <h1 class="text-xl sm:text-2xl font-bold text-gray-900 font-khmer tracking-wide">វិទ្យាស្ថានអាហ្កា</h1>
                    </div>

                    <p class="text-gray-400 text-xs sm:text-sm font-khmer max-w-md mx-auto leading-relaxed mt-2">
                        សូមពិនិត្យឯកសាររបស់លោកអ្នកជាមួយទិន្ន័យខាងក្រោម <br class="hidden sm:block" /> ដើម្បីផ្ទៀងផ្ទាត់ភាពត្រឹមត្រូវ
                    </p>
                </div>
            </div>

            <div v-if="isLoading" class="bg-white rounded-xl shadow-lg p-6 flex justify-center items-center">
                <Spin size="large" />
            </div>

            <Alert v-else-if="error" type="error" show-icon :message="error" />

            <LectureDetail v-else-if="lectureData" :lecture="lectureData" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { Spin, Alert } from 'ant-design-vue';
import { environment } from '../../environments/environment';
import LectureDetail from './LectureDetail.vue';
import { CheckCircleOutlined } from '@ant-design/icons-vue';

const props = defineProps({
    lecture: {
        type: Object,
        default: null
    }
});

const { t } = useI18n();
const route = useRoute();
const fetchedLecture = ref(null);
const isLoading = ref(false);
const error = ref(null);
const lectureData = computed(() => props.lecture || fetchedLecture.value);

onMounted(async () => {
    if (!props.lecture) {
        const id = route.params.id;
        const verificationId = route.query.verificationId;

        if (!id || !verificationId) {
            error.value = t('lecturer.idMissing');
            return;
        }

        try {
            isLoading.value = true;
            const response = await fetch(`${environment.apiBaseUrl}lecturer/${id}/${verificationId}`);
            if (response.ok) {
                fetchedLecture.value = await response.json();
            } else {
                error.value = t('lecturer.fetchFailed');
            }
        } catch (e) {
            error.value = e.message || t('lecturer.fetchFailed');
            console.error(e);
        } finally {
            isLoading.value = false;
        }
    }
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