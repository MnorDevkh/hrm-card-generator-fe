
<template>
    <div class="card flex justify-center">
        <PanelMenu :model="items" class="w-full md:w-80" />
    </div>
</template>

<script setup>
import PanelMenu from 'primevue/panelmenu';
import { useRouter } from 'vue-router';
import { ref } from "vue";

const router = useRouter();

const items = ref([
    {
        label: 'Files',
        icon: 'pi pi-file',
        items: [
            {
                label: 'Documents',
                icon: 'pi pi-file',
                items: [
                    {
                        label: 'Invoices',
                        icon: 'pi pi-file-pdf',
                        items: [
                            {
                                label: 'Pending',
                                icon: 'pi pi-stop'
                            },
                            {
                                label: 'Paid',
                                icon: 'pi pi-check-circle'
                            }
                        ]
                    },
                    {
                        label: 'Clients',
                        icon: 'pi pi-users'
                    }
                ]
            },
            {
                label: 'Images',
                icon: 'pi pi-image',
                items: [
                    {
                        label: 'Logos',
                        icon: 'pi pi-image'
                    }
                ]
            }
        ]
    },
    {
        label: 'List',
        icon: 'pi pi-list',
        items: [
            {
                label: 'Student',
                icon: 'pi-user',
                command: () => router.push('/student')
            },
            {
                label: 'Lecture',
                icon: 'pi-user',
                command: () => router.push('/lecture')
            },
            {
                label: 'Staff',
                icon: 'pi-user',
                command: () => router.push('/staff')
            },
            
        ]
    },
    {
        label: 'Devices',
        icon: 'pi pi-desktop',
        items: [
            {
                label: 'Template',
                icon: 'pi pi-mobile',
                command: () => router.push('/template')
            },
            {
                label: 'Desktop',
                icon: 'pi pi-desktop'
            },
            {
                label: 'Tablet',
                icon: 'pi pi-tablet'
            }
        ]
    }
]);
</script>
