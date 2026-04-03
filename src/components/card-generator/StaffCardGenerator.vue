<template>
    <div class="container mx-auto my-8">
        <div class="bg-gray-100 p-8 rounded-xl shadow-lg">
            <!-- Top Bar -->
            <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <div class="flex gap-2">
                    <Button @click="goBack">
                        <template #icon>
                            <ArrowLeftOutlined />
                        </template>
                    </Button>
                    <Button class="bg-yellow-500 hover:bg-yellow-600 text-white border-none" @click="exportCardsAsPages"
                        :loading="isExportingPages">
                        <template #icon>
                            <CopyOutlined />
                        </template>
                        Export Pages
                    </Button>
                </div>

                <div class="flex flex-wrap gap-4 items-center">
                    <div class="flex flex-col">
                        <label class="font-bold block mb-2 text-sm">Issue</label>
                        <DatePicker v-model:value="issueDate" value-format="YYYY-MM-DD" format="DD-MM-YYYY" class="w-full" />
                    </div>
                    <div class="flex flex-col">
                        <label class="font-bold block mb-2 text-sm">Expiry</label>
                        <DatePicker v-model:value="expiryDate" value-format="YYYY-MM-DD" format="DD-MM-YYYY" class="w-full" />
                    </div>
                    <div class="flex flex-col">
                        <label class="font-bold block mb-2 text-sm">Year</label>
                        <Input v-model:value="year" class="w-20" />
                    </div>
                </div>
            </div>

            <Divider />

            <!-- Export Progress Modal -->
            <Modal v-model:open="isExportingPages" :footer="null" :closable="false" :maskClosable="false" title="Exporting Pages" centered>
                <div class="flex flex-col items-center justify-center p-6 gap-4">
                    <Progress type="circle" :percent="exportProgress" />
                    <div class="text-center">
                        <p class="font-semibold text-lg">Processing...</p>
                        <p class="text-gray-500">Card {{ currentCardIndex }} of {{ totalCards }}</p>
                    </div>
                </div>
            </Modal>

            <!-- Skeleton Loader -->
            <div v-if="loading"
                class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                <div v-for="i in 5" :key="i"
                    class="id-card relative rounded-xl shadow-lg bg-white border border-gray-200 overflow-hidden p-4"
                    :style="{ width: '216px', height: '342px' }">
                    <div class="absolute inset-0 flex flex-col items-center pt-[90px] text-center gap-2">
                        <Skeleton.Button active style="width: 65px; height: 80px" />
                        <Skeleton.Input active size="small" style="width: 50%; height: 12px; min-height: 12px" />
                        <Skeleton.Input active size="small" style="width: 80%; height: 16px; min-height: 16px"
                            class="mt-4" />
                        <Skeleton.Input active size="small" style="width: 70%; height: 14px; min-height: 14px" />
                        <div class="mt-2 w-[170px] space-y-2 flex flex-col items-center">
                            <Skeleton.Input active size="small" style="width: 100%; height: 10px; min-height: 10px"
                                v-for="j in 5" :key="j" />
                        </div>
                        <div class="absolute bottom-[26px] right-5">
                            <Skeleton.Button active style="width: 52px; height: 52px" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Export Canvas (Hidden) -->
            <div id="canvas" v-if="exportCanvasVisible && !loading && staffList.length && templateUrl"
                class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
                style="position:fixed; left:-9999px; top:-9999px; width:auto; height:auto; pointer-events:none;">
                <div v-for="staff in staffList" :key="staff.id"
                    class="id-card relative rounded-xl shadow-lg border border-gray-200 overflow-hidden"
                    :data-staff-id="staff.id" style="width: 216px; height: 342px;">
                    <div class="absolute inset-0 z-0">
                        <img :src="templateUrl" class="w-[216px] h-[342px] object-cover" crossorigin="anonymous" />
                    </div>
                    <div class="absolute inset-0 flex flex-col items-center text-center card-content"
                        style="padding-top: 100px;">
                        <div
                            class="photo-container w-[65px] h-[80px] border border-gray-300 rounded flex items-center justify-center overflow-hidden shadow bg-white ">
                            <img v-if="staff.identity?.photo" :src="getPhotoUrl(staff.identity.photo)" alt="Photo"
                                class="w-full h-full object-cover" />
                            <UserOutlined v-else class="text-3xl text-gray-300" />
                        </div>

                        <p class="card-id text-[11px] font-bold text-gray-900 tracking-wider " style="margin-top: 2px;">{{ staff.identity?.employee_id || '-' }}</p>

                        <div class="card-details flex flex-col items-center " style="margin-top: -2px;">
                            <p class="text-[14px] text-blue-900 tracking-wide mt-1 staff-name koh-santepheap-bold">{{ getTitle(staff.identity?.gender) }} {{ staff.identity?.en_name }}</p>
                            <p class="text-[12px] font-bold text-red-600 leading-none">
                                {{ staff.employment?.position || '-' }}</p>
                        </div>

                        <div class="w-[170px] text-gray-900" style="margin-top: 5px;">
                            <table class="w-full text-[10px] text-left">
                                <tbody>
                                    <tr>
                                        <td>email</td>
                                        <td class="align-top whitespace-nowrap" :title="getStaffEmailRaw(staff) || undefined">: {{ formatStaffEmailForCard(staff) }}</td>
                                    </tr>
                                    <tr>
                                        <td class="w-[50px]">DOB</td>
                                        <td>: {{ formatDate(staff.identity?.date_of_birth) }}</td>
                                    </tr>
                                    <tr>
                                        <td>Phone</td>
                                        <td>: {{ staff.contact?.phone || '-' }}</td>
                                    </tr>
                                    <tr>
                                        <td>Issue</td>
                                        <td>: {{ formatDate(issueDate) }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="absolute bottom-[29px] right-5 w-[1.5cm] h-[1.5cm] flex items-center justify-center bg-white p-[2px] rounded">
                        <QrcodeVue :value="`${environment.url}staff-identity-verification/${staff.id}`" :size="52"
                            level="M" render-as="svg" class="w-13 h-13" />
                    </div>
                </div>
            </div>

            <!-- Main Grid -->
            <div v-if="!loading && staffList.length && templateUrl"
                class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                <div v-for="staff in staffList" :key="staff.id"
                    class="id-card relative rounded-xl shadow-lg border border-gray-200 overflow-hidden"
                    :data-staff-id="staff.id" style="width: 216px; height: 342px;">
                    <div class="absolute inset-0 z-0">
                        <img :src="templateUrl" class="w-[216px] h-[342px] object-cover" crossorigin="anonymous" />
                    </div>
                    <div class="absolute inset-0 flex flex-col items-center text-center card-content"
                        style="padding-top: 100px;">
                        <div
                            class="photo-container w-[65px] h-[80px] border border-gray-300 rounded flex items-center justify-center overflow-hidden shadow bg-white ">
                            <img v-if="staff.identity?.photo" :src="getPhotoUrl(staff.identity.photo)" alt="Photo"
                                class="w-full h-full object-cover" />
                            <UserOutlined v-else class="text-3xl text-gray-300" />
                        </div>

                        <p class="card-id text-[11px] font-bold text-gray-900 tracking-wider " style="margin-top: 2px;">{{ staff.identity?.employee_id || '-' }}</p>

                        <div class="card-details flex flex-col items-center " style="margin-top: -2px;">
                            <p class="text-[14px] text-blue-900 tracking-wide mt-1 staff-name koh-santepheap-bold">{{ getTitle(staff.identity?.gender) }} {{ staff.identity?.en_name }}</p>
                            <p class="text-[12px] font-bold text-red-600 leading-none">
                                {{ staff.employment?.position || '-' }}</p>
                        </div>

                        <div class="w-[170px] text-gray-900" style="margin-top: 5px;">
                            <table class="w-full text-[10px] text-left">
                                <tbody>
                                    <tr>
                                        <td>email</td>
                                        <td class="align-top whitespace-nowrap" :title="getStaffEmailRaw(staff) || undefined">: {{ formatStaffEmailForCard(staff) }}</td>
                                    </tr>
                                    <tr>
                                        <td class="w-[50px]">DOB</td>
                                        <td>: {{ formatDate(staff.identity?.date_of_birth) }}</td>
                                    </tr>
                                   
                                    <tr>
                                        <td>Phone</td>
                                        <td>: {{ staff.contact?.phone || '-' }}</td>
                                    </tr>
                                    <tr>
                                        <td>Issue</td>
                                        <td>: {{ formatDate(issueDate) }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="absolute bottom-[29px] right-5 w-[1.5cm] h-[1.5cm] flex items-center justify-center bg-white p-[2px] rounded">
                        <QrcodeVue :value="`${environment.url}staff-identity-verification/${staff.id}`" :size="52"
                            level="M" render-as="svg" class="w-13 h-13" />
                    </div>
                </div>
            </div>

            <div v-if="!loading && (!staffList.length || !templateUrl)" class="text-center text-gray-500 mt-8">No
                staff or
                template loaded.</div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Button, DatePicker, Input, Divider, Skeleton, message, Modal, Progress } from 'ant-design-vue';
import { ArrowLeftOutlined, CopyOutlined, UserOutlined } from '@ant-design/icons-vue';
import QrcodeVue from 'qrcode.vue';
import { getImagesByType } from '../../service/image.service';
import { environment } from '../../environments/environment';

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const staffList = ref([]);
const templateUrl = ref('');
const issueDate = ref(new Date().toISOString().split('T')[0]);
const expiryDate = ref(new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]);
const year = ref(new Date().getFullYear().toString());

const isExporting = ref(false);
const isExportingPages = ref(false);
const exportCanvasVisible = ref(false);
const exportProgress = ref(0);
const currentCardIndex = ref(0);
const totalCards = ref(0);

const goBack = () => {
    router.back();
};

const getPhotoUrl = (photo) => photo ? `${environment.apiBaseUrl}media/image/${photo}` : '';

function getTitle(gender) {
    if (!gender) return 'Mr.';
    return (gender.toLowerCase() === 'female' || gender.toLowerCase() === 'f') ? 'Ms.' : 'Mr.';
}

function getStaffEmailRaw(staff) {
    const raw = staff.contact?.email || staff.email || '';
    return String(raw).trim();
}

/** One line on card; full local + @ + start of domain + … (e.g. keochuopvuthy2020@gm…). */
function formatStaffEmailForCard(staff) {
    const s = getStaffEmailRaw(staff);
    if (!s) return '-';
    const MAX = 26;
    if (s.length <= MAX) return s;
    const at = s.indexOf('@');
    if (at <= 0) return `${s.slice(0, MAX - 3)}...`;
    const local = s.slice(0, at);
    const domain = s.slice(at + 1);
    const head = `${local}@`;
    const roomForDomain = MAX - head.length - 3;
    if (roomForDomain >= 1) {
        return `${head}${domain.slice(0, roomForDomain)}...`;
    }
    return `${local.slice(0, MAX - 3)}...`;
}

function parseDateString(value) {
    if (!value && value !== 0) return null;
    if (typeof value === 'number') {
        const d = new Date(value);
        return isNaN(d) ? null : d;
    }
    if (typeof value !== 'string') return null;
    const s = value.trim();
    if (!s) return null;
    if (s.includes('T') || /[zZ]|[+\-]\d{2}:\d{2}$/.test(s)) {
        const d = new Date(s);
        return isNaN(d) ? null : d;
    }
    let datePart = s.split(' ')[0];
    datePart = datePart.replace(/\//g, '-');
    const m = datePart.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (m) {
        const y = parseInt(m[1], 10);
        const mo = parseInt(m[2], 10) - 1;
        const d = parseInt(m[3], 10);
        const dt = new Date(y, mo, d);
        return isNaN(dt) ? null : dt;
    }
    const d0 = new Date(s);
    return isNaN(d0) ? null : d0;
}

function formatDate(dateStr) {
    const d = parseDateString(dateStr);
    if (!d) return '-';
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const yr = d.getFullYear();
    return `${day}-${month}-${yr}`;
}

const loadData = async () => {
    loading.value = true;
    try {
        const templateId = route.query.templateId;
        const ids = JSON.parse(route.query.ids || '[]');

        const templates = await getImagesByType('template');
        const template = templates.find(t => t.id == templateId);
        if (template) {
            templateUrl.value = `${environment.apiBaseUrl}media/image/${template.filename}`;
        }

        if (ids.length > 0) {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`${environment.apiBaseUrl}staff/by-ids`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ staff_ids: ids })
            });

            const data = await response.json();
            staffList.value = Array.isArray(data) ? data : (data.staff || []);
        }
    } catch (error) {
        console.error("Error loading data", error);
    } finally {
        loading.value = false;
    }
};

function applyExportColors(el) {
    const allEls = [el, ...el.querySelectorAll('*')];

    allEls.forEach(element => {
        if (element.classList.contains('text-gray-900')) element.style.color = '#111827';
        else if (element.classList.contains('text-red-600')) element.style.color = '#DC2626';
        else if (element.classList.contains('text-blue-900')) element.style.color = '#1E3A8A';
        else if (element.classList.contains('text-gray-300')) element.style.color = '#D1D5DB';
        else if (element.classList.contains('text-gray-500')) element.style.color = '#6B7280';
        else if (element.classList.contains('text-gray-600')) element.style.color = '#4B5563';
        else if (element.classList.contains('text-gray-700')) element.style.color = '#374151';

        if (element.classList.contains('bg-white')) element.style.backgroundColor = '#ffffff';
        else if (element.classList.contains('bg-gray-50')) element.style.backgroundColor = '#F9FAFB';

        if (element.classList.contains('border-gray-200')) element.style.borderColor = '#E5E7EB';
        else if (element.classList.contains('border-gray-300')) element.style.borderColor = '#D1D5DB';
        else if (element.classList.contains('border-blue-500')) element.style.borderColor = '#3B82F6';

        if (element.classList.contains('shadow-lg')) {
            element.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
        } else if (element.classList.contains('shadow')) {
            element.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)';
        }

        if (element.classList.contains('id-card')) {
            if (!element.style.color) element.style.color = '#111827';
        }
        if (element.classList.contains('staff-name')) {
            element.style.fontWeight = '900';
        }
    });
}

async function showExportCanvas() {
    exportCanvasVisible.value = true;
    await nextTick();
    await new Promise((r) => setTimeout(r, 120));
}

async function exportCardsAsPages() {
    isExportingPages.value = true;
    exportProgress.value = 0;
    currentCardIndex.value = 0;
    await nextTick();

    try {
        const cardWidthMM = 54;
        const cardHeightMM = 85;
        const pageMargin = 0;
        const pageWidth = cardWidthMM + pageMargin * 2;
        const pageHeight = cardHeightMM + pageMargin * 2;

        await showExportCanvas();

        const cardElements = document.querySelectorAll("#canvas .id-card");
        if (!cardElements.length) throw new Error("No card elements found!");
        totalCards.value = cardElements.length;

        const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: [pageWidth, pageHeight] });

        for (let i = 0; i < cardElements.length; i++) {
            const el = cardElements[i];

            applyExportColors(el);

            const canvas = await html2canvas(el, {
                scale: window.devicePixelRatio * 4,
                width: 216,
                height: 342,
                backgroundColor: null,
                useCORS: true,
                allowTaint: true,
            });
            const imgData = canvas.toDataURL("image/png");
            if (i > 0) pdf.addPage([pageWidth, pageHeight], 'p');
            pdf.addImage(imgData, "PNG", 0, 0, cardWidthMM, cardHeightMM);

            currentCardIndex.value = i + 1;
            exportProgress.value = Math.round(((i + 1) / cardElements.length) * 100);
        }

        pdf.save("StaffCards_Pages.pdf");
        message.success("Exported All Pages");
    } catch (error) {
        console.error("Export error:", error);
        message.error("Export failed: " + error.message);
    } finally {
        exportCanvasVisible.value = false;
        isExportingPages.value = false;
    }
}

onMounted(() => {
    loadData();
});
</script>
