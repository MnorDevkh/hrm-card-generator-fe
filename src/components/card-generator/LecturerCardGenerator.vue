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
                    <!-- <Button danger @click="exportCards" :loading="isExporting">
                        <template #icon>
                            <FilePdfOutlined />
                        </template>
                        Export Grid
                    </Button> -->
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
            <div id="canvas" v-if="exportCanvasVisible && !loading && lecturers.length && templateUrl"
                class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
                style="position:fixed; left:0; top:0; opacity:0; z-index:-1; width:auto; height:auto; pointer-events:none;">
                <div v-for="lecturer in lecturers" :key="lecturer.id"
                    class="id-card relative rounded-xl shadow-lg border border-gray-200 overflow-hidden"
                    :data-lecturer-id="lecturer.id" style="width: 216px; height: 342px;">
                    <!-- Template image at fixed size -->
                    <div class="absolute inset-0 z-0">
                        <img :src="templateUrl" class="w-[216px] h-[342px] object-cover" crossorigin="anonymous" />
                    </div>
                    <!-- Content (Same as main grid) -->
                    <div class="absolute inset-0 flex flex-col items-center text-center card-content"
                        style="padding-top: 105px;">
                        <div
                            class="photo-container w-[65px] h-[80px] border border-gray-300 rounded flex items-center justify-center overflow-hidden shadow bg-white">
                            <img v-if="lecturer.photo" :src="getPhotoUrl(lecturer.photo)" alt="Photo"
                                class="w-full h-full object-cover" />
                            <UserOutlined v-else class="text-3xl text-gray-300" />
                        </div>
                        <p class="card-id text-[11px] font-bold text-gray-900 tracking-wider">
                            {{ lecturer.card_id || '-' }}</p>
                        <div class="card-details flex flex-col items-center" style="margin-top: -6px;">
                            <p class="text-[14px] text-blue-900 tracking-wide mt-1 lecturer-name koh-santepheap-regular" > {{ getTitle(lecturer.gender) }} {{
                                lecturer.name?.english }} </p>
                         
                        </div>
                        <div class="w-[170px] text-gray-900 card-info-table">
                            <table class="w-full text-[10px] text-left card-info-table-inner">
                                <tbody>
                                    <tr>
                                        <td class="w-[50px]">DOB</td>
                                        <td>: {{ formatDate(lecturer.birth_date || lecturer.dob) }}</td>
                                    </tr>
                                    <tr >
                                        <td class="w-[50px]">Email</td>
                                        <td >: <span class="card-email-value" :style="getEmailValueStyle(lecturer.email)">{{ lecturer.email || '-' }}</span></td>
                                    </tr>
                                    <tr>
                                        <td>Phone</td>
                                        <td>: {{ lecturer.phone || '-' }}</td>
                                    </tr>
                                    <tr>
                                        <td>Address</td>
                                        <td>: {{ lecturer.current_address.province || '-' }}</td>
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
                    <div class="absolute bottom-[10px] right-5 w-[1.5cm] h-[1.5cm] flex items-center justify-center bg-white p-[2px] rounded">
                        <QrcodeVue :value="`${environment.url}lecturer-identity-verification/${lecturer.id}`" :size="52"
                            level="M" render-as="svg" class="w-14 h-14" />
                    </div>
                </div>
            </div>

            <!-- Main Grid -->
            <div v-if="!loading && lecturers.length && templateUrl"
                class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                <div v-for="lecturer in lecturers" :key="lecturer.id"
                    class="id-card relative rounded-xl shadow-lg border border-gray-200 overflow-hidden"
                    :data-lecturer-id="lecturer.id" style="width: 216px; height: 342px;">
                    <!-- Template image at fixed size -->
                    <div class="absolute inset-0 z-0">
                        <img :src="templateUrl" class="w-[216px] h-[342px] object-cover" crossorigin="anonymous" />
                    </div>
                    <div class="absolute inset-0 flex flex-col items-center text-center card-content"
                        style="padding-top: 105px;">
                        <!-- Photo -->
                        <div
                            class="photo-container w-[65px] h-[80px] border border-gray-300 rounded flex items-center justify-center overflow-hidden shadow bg-white ">
                            <img v-if="lecturer.photo" :src="getPhotoUrl(lecturer.photo)" alt="Photo"
                                class="w-full h-full object-cover" />
                            <UserOutlined v-else class="text-3xl text-gray-300" />
                        </div>

                        <!-- ID -->
                        <p class="card-id text-[11px] font-bold text-gray-900 tracking-wider ">
                            {{ lecturer.card_id  || '-' }}
                        </p>

                        <!-- Names -->
                        <div class="card-details flex flex-col items-center " style="margin-top: -6px;">
                            <p class="text-[14px] text-blue-900 tracking-wide mt-1 lecturer-name koh-santepheap-bold"> {{ getTitle(lecturer.gender) }} {{
                                lecturer.name?.english }} </p>
                            
                        </div>

                        <!-- Info Table -->
                        <div class="w-[170px] text-gray-900 card-info-table">
                            <table class="w-full text-[10px] text-left card-info-table-inner">
                                <tbody>
                                    <tr>
                                        <td class="w-[50px]">DOB</td>
                                        <td>: {{ formatDate(lecturer.birth_date || lecturer.dob) }}</td>
                                    </tr>
                                    <tr >
                                        <td class="w-[50px] ">Email</td>
                                        <td >: <span :style="getEmailValueStyle(lecturer.email)">{{ lecturer.email || '-' }}</span></td>
                                    </tr>
                                    <tr>
                                        <td>Phone</td>
                                        <td>: {{ lecturer.phone || '-' }}</td>
                                    </tr>
                                    <tr>
                                        <td>Address</td>
                                        <td>: {{ lecturer.current_address.province || '-' }}</td>
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
                    <div class="absolute bottom-[20px] right-5 w-[1.5cm] h-[1.5cm] flex items-center justify-center bg-white p-[2px] rounded">
                        <QrcodeVue :value="`${environment.url}lecturer-identity-verification/${lecturer.id}`" :size="52"
                            level="M" render-as="svg" class="w-14 h-14" />
                    </div>
                </div>
            </div>

            <div v-if="!loading && (!lecturers.length || !templateUrl)" class="text-center text-gray-500 mt-8">No
                lecturers or
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
import { ArrowLeftOutlined, FilePdfOutlined, CopyOutlined, UserOutlined } from '@ant-design/icons-vue';
import QrcodeVue from 'qrcode.vue';
import { getImagesByType } from '../../service/image.service';
import { environment } from '../../environments/environment';

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const lecturers = ref([]);
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
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
}

function getEmailFontSize(email) {
    if (!email) return '10px';
    const len = email.length;
    if (len <= 22) return '9px';
    if (len <= 25) return '8px';
    return '6px';
}

/** Styles on inner span only — overflow on <td> causes html2canvas white blocks over text. */
function getEmailValueStyle(email) {
    return {
        fontSize: getEmailFontSize(email),
        color: '#111827',
        backgroundColor: 'transparent',
        display: 'inline-block',
        maxWidth: '115px',
        verticalAlign: 'top',
        whiteSpace: 'nowrap',
    };
}

const loadData = async () => {
    loading.value = true;
    try {
        const templateId = route.query.templateId;
        const ids = JSON.parse(route.query.ids || '[]');

        // Load Template
        const templates = await getImagesByType('template');
        const template = templates.find(t => t.id == templateId);
        if (template) {
            templateUrl.value = `${environment.apiBaseUrl}media/image/${template.filename}`;
        }

        // Load Lecturers
        if (ids.length > 0) {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`${environment.apiBaseUrl}lecturer/by-ids`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ lecturer_ids: ids })
            });

            const data = await response.json();
            lecturers.value = Array.isArray(data) ? data : (data.lecturers || []);
        }
    } catch (error) {
        console.error("Error loading data", error);
    } finally {
        loading.value = false;
    }
};

function applyExportColors(el) {
    const allEls = [el, ...el.querySelectorAll('*')];
    const textColorClasses = ['text-gray-900', 'text-red-600', 'text-blue-900', 'text-gray-300', 'text-gray-500', 'text-gray-600', 'text-gray-700'];

    // Map of Tailwind classes to Hex values to bypass oklch issues in html2canvas
    allEls.forEach(element => {
        element.removeAttribute('title');

        // Text Colors
        if (element.classList.contains('text-gray-900')) element.style.color = '#111827';
        else if (element.classList.contains('text-red-600')) element.style.color = '#DC2626';
        else if (element.classList.contains('text-blue-900')) element.style.color = '#1E3A8A';
        else if (element.classList.contains('text-gray-300')) element.style.color = '#D1D5DB';
        else if (element.classList.contains('text-gray-500')) element.style.color = '#6B7280';
        else if (element.classList.contains('text-gray-600')) element.style.color = '#4B5563';
        else if (element.classList.contains('text-gray-700')) element.style.color = '#374151';

        // Background Colors
        if (element.classList.contains('bg-white')) element.style.backgroundColor = '#ffffff';
        else if (element.classList.contains('bg-gray-50')) element.style.backgroundColor = '#F9FAFB';

        // Border Colors
        if (element.classList.contains('border-gray-200')) element.style.borderColor = '#E5E7EB';
        else if (element.classList.contains('border-gray-300')) element.style.borderColor = '#D1D5DB';
        else if (element.classList.contains('border-blue-500')) element.style.borderColor = '#3B82F6';

        // Shadows
        if (element.classList.contains('shadow-lg')) {
            element.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
        } else if (element.classList.contains('shadow')) {
            element.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)';
        }

        // Force default text color on card root to avoid inherited oklch
        if (element.classList.contains('id-card')) {
            if (!element.style.color) element.style.color = '#111827';
        }
        // Lecturer name: ensure extra bold in export
        if (element.classList.contains('lecturer-name')) {
            element.style.fontWeight = '900';
        }

        const tag = element.tagName;
        if ((tag === 'TD' || tag === 'TH' || tag === 'TABLE' || tag === 'SPAN') && element.closest('.card-info-table')) {
            const hasTextColorClass = textColorClasses.some((c) => element.classList.contains(c));
            if (!hasTextColorClass) element.style.color = '#111827';
            if (!element.classList.contains('bg-white')) {
                element.style.backgroundColor = 'transparent';
            }
        }
    });

    applyExportLayout(el);
}

/** Pin spacing as inline px so html2canvas keeps offset from top (not flush to top). */
function applyExportLayout(el) {
    el.style.boxShadow = 'none';

    const cardContent = el.querySelector('.card-content');
    if (cardContent) {
        // html2canvas often ignores flex padding-top; margin on photo is reliable
        cardContent.style.paddingTop = '0';
    }

    const photo = el.querySelector('.photo-container');
    if (photo) photo.style.marginTop = '105px';

    const cardId = el.querySelector('.card-id');
    if (cardId) cardId.style.marginTop = '0';

    const cardDetails = el.querySelector('.card-details');
    if (cardDetails) cardDetails.style.marginTop = '-6px';

    const lecturerName = el.querySelector('.lecturer-name');
    if (lecturerName) lecturerName.style.marginTop = '4px';

    const infoTable = el.querySelector('.card-info-table');
    if (infoTable) infoTable.style.marginTop = '0';

    const table = el.querySelector('.card-info-table-inner');
    if (table) {
        table.style.tableLayout = 'fixed';
        table.style.width = '170px';
        table.style.backgroundColor = 'transparent';
    }

    el.querySelectorAll('.card-info-table td, .card-info-table th').forEach((cell) => {
        cell.style.backgroundColor = 'transparent';
        cell.style.verticalAlign = 'top';
        cell.style.overflow = 'visible';
    });


    el.querySelectorAll('.card-email-value').forEach((span) => {
        span.style.backgroundColor = 'transparent';
        span.style.overflow = 'visible';
        span.style.textOverflow = 'clip';
        span.style.color = '#111827';
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

            // High-res canvas capture (same as GenerateCardComponent)
            const canvas = await html2canvas(el, {
                scale: window.devicePixelRatio * 4,
                width: 216,
                height: 342,
                backgroundColor: null,
                useCORS: true,
                allowTaint: true,
                scrollX: 0,
                scrollY: 0,
            });
            const imgData = canvas.toDataURL("image/png");
            if (i > 0) pdf.addPage([pageWidth, pageHeight], 'p');
            pdf.addImage(imgData, "PNG", 0, 0, cardWidthMM, cardHeightMM);

            currentCardIndex.value = i + 1;
            exportProgress.value = Math.round(((i + 1) / cardElements.length) * 100);
        }

        pdf.save("LecturerCards_Pages.pdf");
        message.success("Exported All Pages");
    } catch (error) {
        console.error("Export error:", error);
        message.error("Export failed: " + error.message);
    } finally {
        exportCanvasVisible.value = false;
        isExportingPages.value = false;
    }
}

async function exportCards() {
    isExporting.value = true;
    await nextTick();

    try {
        // ensure export-only canvas is shown and rendered before capture
        await showExportCanvas();
        const canvasEl = document.getElementById('canvas');
        if (!canvasEl) return;

        applyExportColors(canvasEl);
        const canvas = await html2canvas(canvasEl, {
            scale: 4,
            useCORS: true,
            logging: false,
        });

        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
        pdf.save('LecturerCards_Grid.pdf');
        message.success('Grid Exported');
    } catch (err) {
        console.error('Grid export error:', err);
        message.error("Export failed: " + err.message);
    } finally {
        exportCanvasVisible.value = false;
        isExporting.value = false;
    }
}

onMounted(() => {
    loadData();
});
</script>