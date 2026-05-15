<template>
    <div>
        <!-- Sidebar -->
        <aside class="hidden md:flex flex-col bg-white h-screen w-64 border-r border-gray-200 shadow-lg">
            <div class="p-6 flex items-center gap-4">
                <img alt="Logo" src="@/assets/ailogo.png" class="w-10 h-10" />
                <span class="text-xl font-semibold">HRM System</span>
            </div>
            <nav class="mt-4">
                <ul>
                    <li v-for="item in menuItems" :key="item.label">
                        <router-link :to="item.to"
                            class="flex items-center gap-3 px-6 py-3 text-gray-600 "
                            active-class="bg-blue-50 ">
                            <i :class="item.icon"></i>
                            <span>{{ item.label }}</span>
                        </router-link>
                    </li>
                </ul>
            </nav>
        </aside>

        <!-- Mobile Sidebar Overlay -->
        <div v-if="mobileOpen" class="fixed inset-0 z-50 flex md:hidden">
            <!-- Backdrop -->
            <div class="fixed inset-0 bg-black/50 transition-opacity" @click="$emit('close')"></div>

            <!-- Sidebar Panel -->
            <aside class="relative w-64 bg-white  shadow-xl flex flex-col">
                <div class="p-6 flex items-center justify-between border-b">
                    <div class="flex items-center gap-3">
                        <img alt="Logo" src="@/assets/ailogo.png" class="w-8 h-8" />
                        <span class="text-lg font-semibold">HRM System</span>
                    </div>
                    <button @click="$emit('close')"
                        class="text-gray-500 hover:text-gray-700 ">
                        <i class="pi pi-times text-xl"></i>
                    </button>
                </div>
                <nav class="mt-4 flex-1 overflow-y-auto">
                    <ul>
                        <li v-for="item in menuItems" :key="item.label">
                            <router-link :to="item.to"
                                class="flex items-center gap-3 px-6 py-3 text-gray-600 hover:bg-gray-100"
                                active-class="bg-blue-50 border-r-4 border-blue-500"
                                @click="$emit('close')">
                                <i :class="item.icon"></i>
                                <span>{{ item.label }}</span>
                            </router-link>
                        </li>
                    </ul>
                </nav>
            </aside>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import {
    getCurrentRole,
    ROLE_ADMIN,
    ROLE_MANAGE_STUDENT,
    ROLE_MANAGE_STAFF,
    ROLE_MANAGE_LECTURER
} from '@/utils/role';
defineProps({
    mobileOpen: Boolean
});
defineEmits(['close']);

const allMenuItems = [
  {
    label: 'Dashboard',
    icon: 'pi pi-home',
    to: '/',
    roles: [ROLE_ADMIN]
  },
  {
    label: 'Students',
    icon: 'pi pi-users',
    to: '/student',
    roles: [ROLE_ADMIN, ROLE_MANAGE_STUDENT]
  },
  {
    label: 'Staff',
    icon: 'pi pi-id-card',
    to: '/staff',
    roles: [ROLE_ADMIN, ROLE_MANAGE_STAFF]
  },
  {
    label: 'Lecturers',
    icon: 'pi pi-briefcase',
    to: '/lecture',
    roles: [ROLE_ADMIN, ROLE_MANAGE_LECTURER]
  },
  {
    label: 'Card Templates',
    icon: 'pi pi-palette',
    to: '/template',
    roles: [ROLE_ADMIN]
  },
  {
    label: 'Student Photos',
    icon: 'pi pi-image',
    to: '/template/student-photos',
    roles: [ROLE_ADMIN]
  },
  {
    label: 'Reports',
    icon: 'pi pi-chart-bar',
    to: '/reports',
    roles: [ROLE_ADMIN]
  },
  {
    label: 'Receipts',
    icon: 'pi pi-print',
    to: '/receipts',
    roles: [ROLE_ADMIN]
  },
  {
    label: 'List filters',
    icon: 'pi pi-list',
    to: '/settings/catalog',
    roles: [ROLE_ADMIN]
  }
];

const currentRole = getCurrentRole();
const menuItems = ref(
  allMenuItems.filter(item => item.roles.includes(currentRole))
);
</script>
