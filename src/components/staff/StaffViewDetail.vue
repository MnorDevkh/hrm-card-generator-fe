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
        <StaffDetail v-if="staffData" :staff="staffData" />
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { environment } from '../../environments/environment';
import StaffDetail from './StaffDetail.vue';
import { CheckCircleOutlined } from '@ant-design/icons-vue';

const props = defineProps({
    staff: {
        type: Object,
        default: null
    }
});

const route = useRoute();
const fetchedStaff = ref(null);
const staffData = computed(() => props.staff || fetchedStaff.value || {});

onMounted(async () => {
    if (!props.staff) {
        const id = route.params.id;
        const verificationId = route.query.verificationId;
        
        if (id && verificationId) {
            try {
                const response = await fetch(`${environment.apiBaseUrl}staff/${id}/${verificationId}`);
                if (response.ok) {
                    fetchedStaff.value = await response.json();
                }
            } catch (e) {
                console.error(e);
            }
        }
    }
});
</script>
