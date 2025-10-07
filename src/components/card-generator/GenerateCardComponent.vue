<template>
    <div class="container mx-auto my-8">
        <div class="bg-gray-100 p-8 rounded-xl shadow-lg">
            <!-- Top Bar -->
            <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <button class="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                    @click="exportCards">
                    Export to PDF
                </button>
                <div class="flex gap-4 w-full md:w-auto">
                    <div class="flex-1 text-xs text-center">
                        <label class="font-semibold text-gray-700">Issue</label><br />
                        <input type="date" v-model="issueDate"
                            class="w-full text-xs p-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-200" />
                    </div>
                    <div class="flex-1 text-xs text-center">
                        <label class="font-semibold text-gray-700">Expiry</label><br />
                        <input type="date" v-model="expiryDate"
                            class="w-full text-xs p-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-200" />
                    </div>
                    <div class="flex-1 text-xs text-center">
                        <label class="font-semibold text-gray-700">Year</label><br />
                        <input type="text" v-model="year"
                            class="w-full text-xs p-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-200" />
                    </div>
                </div>
            </div>
            <!-- Card List -->
            <div v-if="students.length && templateImageUrl" class="flex flex-wrap gap-6 justify-start">
                <div v-for="(student, i) in students" :key="student.id"
                    class="relative rounded-xl shadow-lg bg-white border border-gray-200 overflow-hidden" :style="{
                        width: '216px', // 5.4cm
                        height: '348px', // 8.7cm
                        backgroundImage: `url(${templateImageUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }">
                    <!-- Overlay content -->
                    <div class="absolute inset-0 flex flex-col items-center pt-24 text-center">
                        <!-- Student Photo -->
                        <div
                            class="w-[65px] h-[80px] border border-gray-300 rounded flex items-center justify-center overflow-hidden shadow">
                            <img v-if="student.photo" :src="getPhotoUrl(student.photo)" alt="Student Photo"
                                class="w-full h-full object-cover" />
                            <span v-else class="pi pi-user text-3xl text-gray-300"></span>
                        </div>
                        <!-- Card ID -->
                        <p class="mt-[11px] text-[12px] font-bold text-gray-900 tracking-wider">
                            {{ student.card_id }}
                        </p>
                        <!-- Khmer Name -->
                        <p class="text-[16px] font-bold text-red-600 leading-tight mt-8">
                            {{ student.name.khmer }}
                        </p>
                        <!-- English Name -->
                        <p class="text-sm font-bold text-blue-900 tracking-wide mt-[-4px]">
                            {{ student.name.english }}
                        </p>
                        <!-- Info Table -->
                        <div class="mt-1 w-[170px]">
                            <table class="w-full text-[10px] text-left ">
                                <tbody>
                                    <tr>
                                        <td class="w-[50px]">DOB</td>
                                        <td>: {{ formatDate(student.birth_date) }}</td>
                                    </tr>
                                    <tr>
                                        <td>Faculty</td>
                                        <td>
                                            : {{ student.faculty || '-' }}, <span class="font-bold">Batch</span> : {{
                                            student.batch || '-' }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Year</td>
                                        <td>: {{ year || '-' }}</td>
                                    </tr>
                                    <tr>
                                        <td>Issue</td>
                                        <td>: {{ formatDate(issueDate) }}</td>
                                    </tr>
                                    <tr>
                                        <td>Expiry</td>
                                        <td>: {{ formatDate(expiryDate) }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <!-- QR Code -->
                    <div class="absolute bottom-7 right-4 w-[1.5cm] h-[1.5cm] flex items-center justify-center">
                        <QrcodeVue :value="`${environment.url}students/${student.id}`" :size="52" level="M"
                            render-as="svg" class="w-13 h-13" />
                    </div>
                </div>
            </div>
            <div v-else class="text-center text-gray-500 mt-8">No students or template loaded.</div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { getStudentsByIds } from '../../service/student.service';
import { getfileByid } from '../../service/image.service';
import { environment } from '../../environments/environment';
import QrcodeVue from 'qrcode.vue';

const route = useRoute();
const students = ref([]);
const templateId = ref(null);
const template = ref(null);

const issueDate = ref('');
const expiryDate = ref('');
const year = ref('');

const templateImageUrl = computed(() => {
    if (template.value?.filename) {
        return `${environment.apiBaseUrl}upload_image/image/${template.value.filename}`;
    }
    return '';
});

const getPhotoUrl = (photo) => {
    if (!photo) return '';
    return `${environment.apiBaseUrl}upload_image/image/${photo}`;
};

function formatDate(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d)) return '-';
    return d.toLocaleDateString('en-GB');
}

function exportCards() {
    // Implement PDF export logic here
    alert('Export to PDF not implemented');
}

onMounted(async () => {
    const studentIds = JSON.parse(route.query.ids || '[]');
    templateId.value = route.query.templateId;

    if (templateId.value) {
        try {
            template.value = await getfileByid(templateId.value);
        } catch (error) {
            console.error("Failed to fetch template details:", error);
        }
    }

    if (studentIds.length > 0) {
        try {
            const studentData = await getStudentsByIds(studentIds);
            students.value = studentData;
        } catch (error) {
            console.error("Failed to fetch student details:", error);
        }
    }
});
</script>