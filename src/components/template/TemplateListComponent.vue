
<template>
    <div class="flex flex-wrap gap-8">
        <Card v-for="template in templates" :key="template.id" style="width: 25rem; overflow: hidden">
            <template #header>
                <img alt="template header" :src="getImageUrl(template.filename)" class="w-full h-64 object-cover" />
            </template>
            <template #title>{{ template.name || 'Template' }}</template>
            <template #subtitle>{{ template.type || 'Card Template' }}</template>
            <template #content>
                <p class="m-0">
                    Select this template to generate cards for the selected students.
                </p>
            </template>
            <template #footer>
                <div class="flex gap-4 mt-1">
                    <Button label="Use" class="w-full" @click="useTemplate(template.id)" />
                </div>
            </template>
        </Card>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Button from 'primevue/button';
import Card from 'primevue/card';
import { getImagesByType } from '../../service/image.service';
import { environment } from '../../environments/environment';

const templates = ref([]);
const router = useRouter();
const route = useRoute();

const studentIds = computed(() => {
    try {
        // Get student IDs from the URL query parameter
        return JSON.parse(route.query.ids || '[]');
    } catch (e) {
        console.error("Failed to parse student IDs from query", e);
        return [];
    }
});

onMounted(async () => {
    templates.value = await getImagesByType('template');
});



const getImageUrl = (filename) => {
    return `${environment.apiBaseUrl}upload_image/image/${filename}`;
};

const useTemplate = (templateId) => {
    // Navigate to the generate page with the template ID and student IDs
    router.push({ path: '/generate', query: { templateId, ids: JSON.stringify(studentIds.value) } });
};
</script>
