<template>
    <div class="flex flex-col gap-3 sm:gap-4 lg:gap-6 pt-10">
            <div class="text-center mb-1 sm:mb-2">
              <div
                class="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-2 sm:mb-4">
                <CheckCircleOutlined class="text-2xl sm:text-3xl text-green-600 dark:text-green-400" />
              </div>
              <p
                class="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 font-khmer">
                ឯកសារមានសុពលភាព</p>
              <p class="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 mb-1 font-khmer">ចេញដោយ
                វិទ្យាស្ថានអាហ្គា</p>
              <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-khmer px-2">
                សូមពិនិត្យឯកសាររបស់លោកអ្នកជាមួយទិន្ន័យខាងក្រោម <br> ដើម្បីផ្ទៀងផ្ទាត់ភាពត្រឹមត្រូវ</p>
            </div>
        <StudentDetail :studentId="studentId" :verificationId="verificationId" :embedded="embedded" />
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