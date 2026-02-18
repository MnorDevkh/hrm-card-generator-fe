<template>
    <div class="flex flex-col gap-3 sm:gap-4 lg:gap-6 pt-10">
            <div class="text-center mb-1 sm:mb-2">
              <div
                class="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-green-100 mb-2 sm:mb-4">
                <CheckCircleOutlined class="text-2xl sm:text-3xl text-green-600" />
              </div>
              <p
                class="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-1 sm:mb-2 font-khmer">
                ឯកសារមានសុពលភាព</p>
              <p class="text-sm sm:text-base lg:text-lg text-gray-600 mb-1 font-khmer">ចេញដោយ
                វិទ្យាស្ថានអាហ្កា</p>
              <p class="text-xs sm:text-sm text-gray-500 font-khmer px-2">
                សូមពិនិត្យឯកសាររបស់លោកអ្នកជាមួយទិន្ន័យខាងក្រោម <br> ដើម្បីផ្ទៀងផ្ទាត់ភាពត្រឹមត្រូវ</p>
            </div>
        <LectureDetail v-if="lectureData" :lecture="lectureData" />
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { environment } from '../../environments/environment';
import LectureDetail from './LectureDetail.vue';
import { CheckCircleOutlined } from '@ant-design/icons-vue';

const props = defineProps({
    lecture: {
        type: Object,
        default: null
    }
});

const route = useRoute();
const fetchedLecture = ref(null);
const lectureData = computed(() => props.lecture || fetchedLecture.value || {});

onMounted(async () => {
    if (!props.lecture) {
        const id = route.params.id;
        const verificationId = route.query.verificationId;
        
        if (id && verificationId) {
            try {
                const response = await fetch(`${environment.apiBaseUrl}lecturer/${id}/${verificationId}`);
                if (response.ok) {
                    fetchedLecture.value = await response.json();
                }
            } catch (e) {
                console.error(e);
            }
        }
    }
});

const formatDate = (dateString) => {
    if (!dateString) return '';
    const datePart = typeof dateString === 'string' && dateString.includes(' ') ? dateString.split(' ')[0] : dateString;
    const m = String(datePart).match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (m) return `${String(parseInt(m[3], 10)).padStart(2, '0')}-${String(parseInt(m[2], 10)).padStart(2, '0')}-${m[1]}`;
    const d = new Date(datePart);
    if (isNaN(d)) return '';
    return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
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