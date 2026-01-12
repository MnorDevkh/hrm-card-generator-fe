<template>
    <div class="form-container">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <!-- Left Column -->
            <div class="flex flex-col gap-4">
                <div class="flex flex-col gap-2">
                    <label for="identity_id" class="font-semibold">Identity ID</label>
                    <Input id="identity_id" v-model:value="formData.identity_id" class="w-full" />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="name_kh" class="font-semibold">Name (Khmer)</label>
                    <Input id="name_kh" v-model:value="formData.name.khmer" class="w-full" />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="name_en" class="font-semibold">Name (English)</label>
                    <Input id="name_en" v-model:value="formData.name.english" class="w-full" />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="gender" class="font-semibold">Gender</label>
                    <Input id="gender" v-model:value="formData.gender" class="w-full" />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="nationality" class="font-semibold">Nationality</label>
                    <Input id="nationality" v-model:value="formData.nationality" class="w-full" />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="birth_date" class="font-semibold">Birth Date</label>
                    <DatePicker id="birth_date" v-model:value="formData.birth_date" class="w-full" />
                </div>
                 <div class="flex flex-col gap-2">
                    <label class="font-semibold">Birth Place</label>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                            <Input placeholder="Village" v-model:value="formData.birth_place.village" class="w-full"/>
                        </div>
                        <div>
                            <Input placeholder="Commune" v-model:value="formData.birth_place.commune" class="w-full"/>
                        </div>
                        <div>
                            <Input placeholder="District" v-model:value="formData.birth_place.district" class="w-full"/>
                        </div>
                        <div>
                            <Input placeholder="Province" v-model:value="formData.birth_place.province" class="w-full"/>
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
                            <Input placeholder="Village" v-model:value="formData.current_address.village" class="w-full"/>
                        </div>
                        <div>
                            <Input placeholder="Commune" v-model:value="formData.current_address.commune" class="w-full"/>
                        </div>
                        <div>
                            <Input placeholder="District" v-model:value="formData.current_address.district" class="w-full"/>
                        </div>
                        <div>
                            <Input placeholder="Province" v-model:value="formData.current_address.province" class="w-full"/>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col gap-2">
                    <label for="phone" class="font-semibold">Phone</label>
                    <Input id="phone" v-model:value="formData.phone" class="w-full" />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="email" class="font-semibold">Email</label>
                    <Input id="email" v-model:value="formData.email" class="w-full" />
                </div>
                <div class="flex flex-col gap-2">
                    <label class="font-semibold">Education</label>
                    <div class="flex flex-col gap-2">
                        <Input placeholder="Level" v-model:value="formData.education.level" class="w-full"/>
                        <Input placeholder="Year" v-model:value="formData.education.year" class="w-full"/>
                        <Input placeholder="Training Institution" v-model:value="formData.education.training_institution" class="w-full"/>
                    </div>
                </div>
                <div class="flex flex-col gap-2">
                    <label for="faculty" class="font-semibold">Faculty</label>
                    <Input id="faculty" v-model:value="formData.faculty" class="w-full" />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="major" class="font-semibold">Major</label>
                    <Input id="major" v-model:value="formData.major" class="w-full" />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="notes" class="font-semibold">Notes</label>
                    <Input.TextArea id="notes" v-model:value="formData.notes" :rows="3" class="w-full" />
                </div>
            </div>
        </div>
        <div class="flex justify-end gap-2 mt-6">
            <Button @click="$emit('cancel')">Cancel</Button>
            <Button type="primary" @click="submitForm">Save</Button>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { Input, Button, DatePicker } from 'ant-design-vue';
import dayjs from 'dayjs';

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
        initialData.birth_date = dayjs(initialData.birth_date);
    }
    return initialData;
};

const formData = ref(getInitialFormData(props.lecture));

watch(() => props.lecture, (newVal) => {
    formData.value = getInitialFormData(newVal);
});

const submitForm = () => {
    const payload = { ...formData.value };
    if (payload.birth_date) {
        payload.birth_date = payload.birth_date.toDate();
    }
    emit('save', payload);
};
</script>