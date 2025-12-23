<template>
    <div class="form-container">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <!-- Left Column -->
            <div class="flex flex-col gap-4">
                <div class="flex flex-col gap-2">
                    <label for="identity_id" class="font-semibold">Identity ID</label>
                    <InputText id="identity_id" v-model="formData.identity_id" class="w-full" />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="name_kh" class="font-semibold">Name (Khmer)</label>
                    <InputText id="name_kh" v-model="formData.name.khmer" class="w-full" />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="name_en" class="font-semibold">Name (English)</label>
                    <InputText id="name_en" v-model="formData.name.english" class="w-full" />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="gender" class="font-semibold">Gender</label>
                    <InputText id="gender" v-model="formData.gender" class="w-full" />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="nationality" class="font-semibold">Nationality</label>
                    <InputText id="nationality" v-model="formData.nationality" class="w-full" />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="birth_date" class="font-semibold">Birth Date</label>
                    <Calendar id="birth_date" v-model="formData.birth_date" dateFormat="yy-mm-dd" class="w-full" />
                </div>
                 <div class="flex flex-col gap-2">
                    <label class="font-semibold">Birth Place</label>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                            <InputText placeholder="Village" v-model="formData.birth_place.village" class="w-full"/>
                        </div>
                        <div>
                            <InputText placeholder="Commune" v-model="formData.birth_place.commune" class="w-full"/>
                        </div>
                        <div>
                            <InputText placeholder="District" v-model="formData.birth_place.district" class="w-full"/>
                        </div>
                        <div>
                            <InputText placeholder="Province" v-model="formData.birth_place.province" class="w-full"/>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Column -->
            <div class="flex flex-col gap-4">
                <div class="flex flex-col gap-2">
                    <label class="font-semibold">Current Address</label>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                            <InputText placeholder="Village" v-model="formData.current_address.village" class="w-full"/>
                        </div>
                        <div>
                            <InputText placeholder="Commune" v-model="formData.current_address.commune" class="w-full"/>
                        </div>
                        <div>
                            <InputText placeholder="District" v-model="formData.current_address.district" class="w-full"/>
                        </div>
                        <div>
                            <InputText placeholder="Province" v-model="formData.current_address.province" class="w-full"/>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col gap-2">
                    <label for="phone" class="font-semibold">Phone</label>
                    <InputText id="phone" v-model="formData.phone" class="w-full" />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="email" class="font-semibold">Email</label>
                    <InputText id="email" v-model="formData.email" class="w-full" />
                </div>
                <div class="flex flex-col gap-2">
                    <label class="font-semibold">Education</label>
                    <div class="flex flex-col gap-2">
                        <InputText placeholder="Level" v-model="formData.education.level" class="w-full"/>
                        <InputText placeholder="Year" v-model="formData.education.year" class="w-full"/>
                        <InputText placeholder="Training Institution" v-model="formData.education.training_institution" class="w-full"/>
                    </div>
                </div>
                <div class="flex flex-col gap-2">
                    <label for="faculty" class="font-semibold">Faculty</label>
                    <InputText id="faculty" v-model="formData.faculty" class="w-full" />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="major" class="font-semibold">Major</label>
                    <InputText id="major" v-model="formData.major" class="w-full" />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="notes" class="font-semibold">Notes</label>
                    <Textarea id="notes" v-model="formData.notes" rows="3" class="w-full" />
                </div>
            </div>
        </div>
        <div class="flex justify-end gap-2 mt-6">
            <Button label="Cancel" severity="secondary" text @click="$emit('cancel')" />
            <Button label="Save" @click="submitForm" />
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Calendar from 'primevue/calendar';
import Textarea from 'primevue/textarea';

const props = defineProps({
    lecture: Object
});
const emit = defineEmits(['save', 'cancel']);

const getInitialFormData = (data) => {
    const initialData = {
        identity_id: '',
        nationality: '',
        name: { khmer: '', english: '' },
        gender: '',
        birth_date: null,
        birth_place: { village: '', commune: '', district: '', province: '' },
        current_address: { village: '', commune: '', district: '', province: '' },
        phone: '',
        education: { level: '', year: '', training_institution: '' },
        faculty: '',
        major: '',
        email: '',
        notes: '',
        ...data
    };

    if (initialData.birth_date) {
        initialData.birth_date = new Date(initialData.birth_date);
    }
    return initialData;
};

const formData = ref(getInitialFormData(props.lecture));

watch(() => props.lecture, (newVal) => {
    formData.value = getInitialFormData(newVal);
});

const submitForm = () => {
    emit('save', formData.value);
};
</script>