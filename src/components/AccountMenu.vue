<template>
    <Dropdown :trigger="['click']" placement="bottomRight">
        <div class="flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded-lg transition-colors">
            <Avatar class="bg-blue-100 text-blue-600">
                <template #icon>
                    <UserOutlined />
                </template>
            </Avatar>
            <div class="flex flex-col items-start text-left hidden sm:flex">
                <span class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{ username }}</span>
                <span class="text-xs text-gray-500 dark:text-gray-400 capitalize">{{ role }}</span>
            </div>
            <DownOutlined class="text-gray-500 text-xs hidden sm:block" />
        </div>
        <template #overlay>
            <Menu>
                <!-- <Menu.Item key="profile" @click="router.push('/profile')">
                    <template #icon>
                        <UserOutlined />
                    </template>
                    Profile
                </Menu.Item>
                <Menu.Item key="settings" @click="router.push('/settings')">
                    <template #icon>
                        <SettingOutlined />
                    </template>
                    Settings
                </Menu.Item> -->
                <Menu.Divider />
                <Menu.Item key="logout" @click="handleLogout">
                    <template #icon>
                        <LogoutOutlined />
                    </template>
                    Sign Out
                </Menu.Item>
            </Menu>
        </template>
    </Dropdown>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Dropdown, Menu, Avatar } from 'ant-design-vue';
import { UserOutlined, SettingOutlined, LogoutOutlined, DownOutlined } from '@ant-design/icons-vue';

const router = useRouter();
const username = ref('User');
const role = ref('');

const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
};

onMounted(() => {
    username.value = localStorage.getItem('username') || 'Admin User';
    role.value = (localStorage.getItem('role') || 'Staff').replace('_', ' ');
});
</script>