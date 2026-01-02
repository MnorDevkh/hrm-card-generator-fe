<template>
    <div class="container mx-auto my-8">
        <Toast />
        <div class="bg-gray-100 dark:bg-gray-800 p-8 rounded-xl shadow-lg">
            <!-- Top Bar -->
            <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <div class="flex gap-2">
                    <Button icon="pi pi-arrow-left" severity="secondary" @click="goBack" aria-label="Back" />
                    <button @click="exportCards" :disabled="isExporting" class="p-button p-button-danger flex items-center gap-2">
                        <i class="pi pi-file-pdf"></i>
                        <span>{{ isExporting ? 'Exporting...' : 'Export Grid' }}</span>
                    </button>
                    <button @click="exportCardsAsPages" :disabled="isExportingPages" class="p-button p-button-warning flex items-center gap-2">
                        <i class="pi pi-copy"></i>
                        <span>{{ isExportingPages ? 'Exporting...' : 'Export Pages' }}</span>
                    </button>
                </div>

                <div class="flex flex-wrap gap-4 items-center">
                    <div class="flex flex-col">
                        <label class="font-bold block mb-2 text-sm">Issue</label>
                        <input type="date" v-model="issueDate" class="p-inputtext p-component" />
                    </div>
                    <div class="flex flex-col">
                        <label class="font-bold block mb-2 text-sm">Expiry</label>
                        <input type="date" v-model="expiryDate" class="p-inputtext p-component" />
                    </div>
                    <div class="flex flex-col">
                        <label class="font-bold block mb-2 text-sm">Year</label>
                        <input type="text" v-model="year" class="p-inputtext p-component w-20" />
                    </div>
                </div>
            </div>

            <Divider />

            <!-- Skeleton Loader -->
            <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                <div v-for="i in 5" :key="i" class="id-card relative rounded-xl shadow-lg bg-white border border-gray-200 overflow-hidden p-4" :style="{ width: '216px', height: '342px' }">
                    <div class="absolute inset-0 flex flex-col items-center pt-[90px] text-center gap-2">
                        <Skeleton shape="rectangle" width="65px" height="80px" />
                        <Skeleton width="50%" height="12px" />
                        <Skeleton width="80%" height="16px" class="mt-4" />
                        <Skeleton width="70%" height="14px" />
                        <div class="mt-2 w-[170px] space-y-2">
                            <Skeleton width="100%" height="10px" v-for="j in 5" :key="j" />
                        </div>
                        <div class="absolute bottom-[26px] right-4">
                            <Skeleton shape="rectangle" width="52px" height="52px" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Export Canvas (Hidden) -->
            <div id="canvas" v-if="exportCanvasVisible && !loading && lecturers.length && templateUrl"
                class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
                style="position:fixed; left:-9999px; top:-9999px; width:auto; height:auto; pointer-events:none;">
                <div v-for="lecturer in lecturers" :key="lecturer.id"
                    class="id-card relative rounded-xl shadow-lg bg-white border border-gray-200 overflow-hidden"
                    :style="{
                        width: '216px',
                        height: '342px',
                        backgroundImage: `url(${templateUrl})`,
                        backgroundSize: '100% 100%',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }">
                    <!-- Content (Same as main grid) -->
                    <div class="absolute inset-0 flex flex-col items-center text-center card-content" style="padding-top: 90px;">
                        <div class="photo-container w-[65px] h-[80px] border border-gray-300 rounded flex items-center justify-center overflow-hidden shadow bg-white">
                            <img v-if="lecturer.photo" :src="getPhotoUrl(lecturer.photo)" alt="Photo" class="w-full h-full object-cover" />
                            <span v-else class="pi pi-user text-3xl text-gray-300"></span>
                        </div>
                        <p class="card-id text-[12px] font-bold text-gray-900 tracking-wider" style="margin-top: -8px;">{{ lecturer.identity_id }}</p>
                        <div class="card-details flex flex-col items-center">
                            <p class="text-[16px] font-bold text-red-600 leading-none">{{ lecturer.name?.khmer }}</p>
                            <p class="text-sm font-bold text-blue-900 tracking-wide mt-1">{{ lecturer.name?.english }}</p>
                        </div>
                        <div class="mt-1 w-[170px]">
                            <table class="w-full text-[10px] text-left">
                                <tbody>
                                    <tr><td class="w-[50px]">DOB</td><td>: {{ formatDate(lecturer.birth_date || lecturer.dob) }}</td></tr>
                                    <tr><td>Faculty</td><td>: {{ lecturer.faculty || '-' }}</td></tr>
                                    <tr><td>Year</td><td>: {{ year || '-' }}</td></tr>
                                    <tr><td>Issue</td><td>: {{ formatDate(issueDate) }}</td></tr>
                                    <tr><td>Expiry</td><td>: {{ formatDate(expiryDate) }}</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="absolute bottom-[29px] right-4 w-[1.5cm] h-[1.5cm] flex items-center justify-center">
                        <QrcodeVue :value="`${environment.url}lecturer-identity-verification/${lecturer.id}`" :size="52" level="M" render-as="svg" class="w-13 h-13" />
                    </div>
                </div>
            </div>

            <!-- Main Grid -->
            <div v-if="!loading && lecturers.length && templateUrl" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                <div v-for="lecturer in lecturers" :key="lecturer.id"
                    class="id-card relative rounded-xl shadow-lg bg-white border border-gray-200 overflow-hidden"
                    :style="{
                        width: '216px',
                        height: '342px',
                        backgroundImage: `url(${templateUrl})`,
                        backgroundSize: '100% 100%',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }">
                    
                    <div class="absolute inset-0 flex flex-col items-center text-center card-content" style="padding-top: 90px;">
                        <!-- Photo -->
                        <div class="photo-container w-[65px] h-[80px] border border-gray-300 rounded flex items-center justify-center overflow-hidden shadow bg-white">
                            <img v-if="lecturer.photo" :src="getPhotoUrl(lecturer.photo)" alt="Photo" class="w-full h-full object-cover" />
                            <span v-else class="pi pi-user text-3xl text-gray-300"></span>
                        </div>

                        <!-- ID -->
                        <p class="card-id text-[12px] font-bold text-gray-900 tracking-wider" style="margin-top: -8px;">
                            {{ lecturer.identity_id }}
                        </p>

                        <!-- Names -->
                        <div class="card-details flex flex-col items-center">
                            <p class="text-[16px] font-bold text-red-600 leading-none">{{ lecturer.name?.khmer }}</p>
                            <p class="text-sm font-bold text-blue-900 tracking-wide mt-1">{{ lecturer.name?.english }}</p>
                        </div>

                        <!-- Info Table -->
                        <div class="mt-1 w-[170px]">
                            <table class="w-full text-[10px] text-left">
                                <tbody>
                                    <tr>
                                        <td class="w-[50px]">DOB</td>
                                        <td>: {{ formatDate(lecturer.birth_date || lecturer.dob) }}</td>
                                    </tr>
                                    <tr>
                                        <td>Faculty</td>
                                        <td>: {{ lecturer.faculty || '-' }}</td>
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
                    <div class="absolute bottom-[29px] right-4 w-[1.5cm] h-[1.5cm] flex items-center justify-center">
                            <QrcodeVue :value="`${environment.url}lecturer-identity-verification/${lecturer.id}`" :size="52" level="M" render-as="svg" class="w-13 h-13" />
                    </div>
                </div>
            </div>

            <div v-if="!loading && (!lecturers.length || !templateUrl)" class="text-center text-gray-500 mt-8">No lecturers or template loaded.</div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import Button from 'primevue/button';
import QrcodeVue from 'qrcode.vue';
import Divider from 'primevue/divider';
import Skeleton from 'primevue/skeleton';
import { getImagesByType } from '../../service/image.service';
import { environment } from '../../environments/environment';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const loading = ref(false);
const lecturers = ref([]);
const templateUrl = ref('');
const issueDate = ref(new Date().toISOString().split('T')[0]);
const expiryDate = ref(new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]);
const year = ref(new Date().getFullYear().toString());

const isExporting = ref(false);
const isExportingPages = ref(false);
const exportCanvasVisible = ref(false);

const goBack = () => {
    router.back();
};

const getPhotoUrl = (photo) => photo ? `${environment.apiBaseUrl}upload_image/image/${photo}` : '';

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
  return d.toLocaleDateString('en-GB');
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
            templateUrl.value = `${environment.apiBaseUrl}upload_image/image/${template.filename}`;
        }

        // Load Lecturers
        if (ids.length > 0) {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`${environment.apiBaseUrl}lecture/by-ids`, {
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
    
    // Map of Tailwind classes to Hex values to bypass oklch issues in html2canvas
    allEls.forEach(element => {
        // Text Colors
        if (element.classList.contains('text-gray-900')) element.style.color = '#111827';
        else if (element.classList.contains('text-red-600')) element.style.color = '#DC2626';
        else if (element.classList.contains('text-blue-900')) element.style.color = '#1E3A8A';
        else if (element.classList.contains('text-gray-300')) element.style.color = '#D1D5DB';
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
    });
}

async function showExportCanvas() {
  exportCanvasVisible.value = true;
  await nextTick();
  await new Promise((r) => setTimeout(r, 120));
}

async function exportCardsAsPages() {
  isExportingPages.value = true;
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

    const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: [pageWidth, pageHeight] });

    for (let i = 0; i < cardElements.length; i++) {
      const el = cardElements[i];

      applyExportColors(el);
      const canvas = await html2canvas(el, {
        scale: 4,
        backgroundColor: "#ffffff",
        useCORS: true,
        allowTaint: true,
      });
      const imgData = canvas.toDataURL("image/JPEG");
      if (i > 0) pdf.addPage([pageWidth, pageHeight], 'p');
      pdf.addImage(imgData, "JPEG", 0, 0, cardWidthMM, cardHeightMM);
    }

    pdf.save("LecturerCards_Pages.pdf");
    toast.add({ severity: "success", summary: "Exported All Pages", life: 2000 });
  } catch (error) {
    console.error("Export error:", error);
    toast.add({ severity: "error", summary: "Export failed", detail: error.message, life: 3000 });
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
    toast.add({ severity: 'success', summary: 'Grid Exported', life: 2000 });
  } catch (err) {
    console.error('Grid export error:', err);
    toast.add({ severity: "error", summary: "Export failed", detail: err.message, life: 3000 });
  } finally {
    exportCanvasVisible.value = false;
    isExporting.value = false;
  }
}

onMounted(() => {
    loadData();
});
</script>