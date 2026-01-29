<template>
    <div class="min-h-screen bg-gray-50/30 py-8 sm:py-12 px-4 sm:px-6">
        <div class=" mx-auto space-y-6 sm:space-y-8">
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
            
            <StudentDetail :studentId="studentId" :verificationId="verificationId" :embedded="embedded" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { Image } from 'ant-design-vue';
import { CheckCircleOutlined, UserOutlined } from '@ant-design/icons-vue';
import { getStudentInfo } from '../../service/student.service';
import { environment } from '../../environments/environment';
import StudentDetail from './StudentDetail.vue';

const route = useRoute();
const student = ref(null);

const props = defineProps({
    studentId: {
        type: [String, Number],
        default: null
    },
    verificationId: {
        type: [String, Number],
        default: null
    },
    embedded: {
        type: Boolean,
        default: false
    }
});

onMounted(async () => {
    const studentId = props.studentId || route.params.id;
    let verificationId = props.verificationId || route.params.verificationId || route.query.verificationId;

    if (verificationId === 'null') verificationId = null;

    if (studentId) {
        try {
            const response = await getStudentInfo(studentId, verificationId);
            student.value = response;
        } catch (err) {
            console.error(err);
        }
    }
});

const getPhotoUrl = (photo) => (photo ? `${environment.apiBaseUrl}upload_image/image/${photo}` : '');
</script>

<style scoped></style>