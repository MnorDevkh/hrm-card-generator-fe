<template>
  <div class="container mx-auto my-8">
    <!-- Add Skeleton component for loading states -->
    <div class="bg-gray-100 p-8 rounded-xl shadow-lg">
      <!-- Top Bar -->
      <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div class="flex gap-2">
          <Button type="primary" danger @click="exportCards" :loading="isExporting">
            <template #icon>
              <FilePdfOutlined />
            </template>
            Export Grid
          </Button>
          <Button type="primary" ghost @click="exportCardsAsPages" :loading="isExportingPages">
            <template #icon>
              <CopyOutlined />
            </template>
            Export Pages
          </Button>
        </div>

        <div class="flex flex-wrap gap-4 items-center">
          <div class="flex flex-col">
            <label for="issueDate" class="font-bold block mb-2 text-sm">Issue</label>
            <DatePicker v-model:value="issueDate" valueFormat="YYYY-MM-DD" class="w-40" />
          </div>
          <div class="flex flex-col">
            <label for="expiryDate" class="font-bold block mb-2 text-sm">Expiry</label>
            <DatePicker v-model:value="expiryDate" valueFormat="YYYY-MM-DD" class="w-40" />
          </div>
          <div class="flex flex-col">
            <label for="year" class="font-bold block mb-2 text-sm">Year</label>
            <Input v-model:value="year" class="w-24" />
          </div>
        </div>
      </div>

      <Divider />

      <!-- Export Progress Modal -->
      <Modal v-model:open="isExportingPages" :footer="null" :closable="false" :maskClosable="false"
        title="Exporting Pages" centered>
        <div class="flex flex-col items-center justify-center p-6 gap-4">
          <Progress type="circle" :percent="exportProgress" />
          <div class="text-center">
            <p class="font-semibold text-lg">Processing...</p>
            <p class="text-gray-500">Card {{ currentCardIndex }} of {{ totalCards }}</p>
          </div>
        </div>
      </Modal>

      <!-- Skeleton Loader -->
      <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <div v-for="i in studentIdCount" :key="i"
          class="id-card relative rounded-xl shadow-lg bg-white border border-gray-200 overflow-hidden p-4"
          :style="{ width: '216px', height: '342px' }">
          <div class="absolute inset-0 flex flex-col items-center pt-[90px] text-center gap-2">
            <Skeleton.Button active :style="{ width: '65px', height: '80px' }" />
            <Skeleton.Button active :style="{ width: '50%', height: '12px' }" />
            <Skeleton.Button active :style="{ width: '80%', height: '16px', marginTop: '16px' }" />
            <Skeleton.Button active :style="{ width: '70%', height: '14px' }" />
            <div class="mt-2 w-[170px] space-y-2 flex flex-col items-center">
              <Skeleton.Button active :style="{ width: '100%', height: '10px' }" v-for="j in 5" :key="j" />
            </div>
            <div class="absolute bottom-[26px] right-5">
              <Skeleton.Button active :style="{ width: '52px', height: '52px' }" />
            </div>
          </div>
        </div>
      </div>

      <!-- Export-only Card List (rendered only while exporting; placed off-screen) -->
      <div id="canvas" v-if="exportCanvasVisible && !isLoading && students.length && templateImageUrl"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
        style="position:fixed; left:-9999px; top:-9999px; width:auto; height:auto; pointer-events:none;">
        <div v-for="student in students" :key="student.id"
          class="id-card relative rounded-xl shadow-lg border border-gray-200 overflow-hidden"
          :data-student-id="student.id" style="width: 216px; height: 342px;">

          <!-- Template image at fixed size -->
          <div class="absolute inset-0 z-0">
            <img :src="templateImageUrl" class="w-[216px] h-[342px] object-cover" crossorigin="anonymous" />
          </div>

          <!-- Hover Overlay for Single Export -->


          <div class="absolute inset-0 flex flex-col items-center text-center card-content" style="padding-top: 90px;">
            <!-- Student Photo -->
            <div
              class="photo-container border border-gray-300 rounded flex items-center justify-center overflow-hidden shadow"
              style="width: 65px; height: 80px;">
              <img v-if="student.photo" :src="getPhotoUrl(student.photo)" alt="Student Photo" class="student-photo"
                crossorigin="anonymous" />
              <UserOutlined v-else class="text-3xl text-gray-300" />
            </div>


            <!-- Card ID - fixed spacing -->
            <p class="card-id font-bold font-koh text-gray-900 tracking-wider " style="margin-top: -8px;">{{
              student.card_id }}</p>

            <!-- Rest of content with adjusted spacing -->
            <div class="card-details justify-center items-baseline gap-x-2" style="min-height: 38px;">
              <p class="font-khmer text-red-600 leading-none" :style="{ fontSize: (student.name.khmer || '').length > 15 ? '14px' : '16px' }">{{ student.name.khmer }}</p>
              <p class="font-bold text-blue-900 tracking-wide" :style="{ fontSize: (student.name.english || '').length > 15 ? '10px' : '14px' }">{{ student.name.english }}</p>
            </div>

            <!-- Info Table -->
            <div class="mt-1 w-[170px] text-gray-900">
              <table class="w-full text-[10px] text-left">
                <tbody>
                  <tr>
                    <td class="w-[50px]">DOB</td>
                    <td>: {{ formatDate(student.birth_date) }}</td>
                  </tr>
                  <tr>
                    <td>Faculty</td>
                    <td>: {{ getFacultyInEnglish(student.faculty) || '-' }}
                    </td>
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
          <div
            class="absolute bottom-[29px] right-5 w-[1.5cm] h-[1.5cm] flex items-center justify-center bg-white p-[2px] rounded">
            <QrcodeVue :value="`${environment.url}student-identity-verification/${student.id}`" :size="52" level="M"
              render-as="svg" class="w-13 h-13" />
          </div>
        </div>
      </div>

      <!-- Card List -->
      <div v-if="!isLoading && students.length && templateImageUrl"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <div v-for="student in students" :key="student.id"
          class="id-card relative rounded-xl shadow-lg border border-gray-200 overflow-hidden"
          :data-student-id="student.id" style="width: 216px; height: 342px;">

          <!-- Template image at fixed size -->
          <div class="absolute inset-0 z-0">
            <img :src="templateImageUrl" class="w-[216px] h-[342px] object-cover" crossorigin="anonymous" />
          </div>

          <!-- Hover Overlay for Single Export -->

          <div class="absolute inset-0 flex flex-col items-center text-center card-content" style="padding-top: 90px;">
            <!-- Student Photo -->
            <div
              class="photo-container w-[65px] h-[80px] border border-gray-300 rounded flex items-center justify-center overflow-hidden shadow">
              <img v-if="student.photo" :src="getPhotoUrl(student.photo)" alt="Student Photo"
                class="w-full h-full object-cover" />
              <UserOutlined v-else class="text-3xl text-gray-300" />
            </div>

            <!-- Card ID - fixed spacing -->
            <p class="card-id text-[12px] font-bold font-koh text-gray-900 tracking-wider" style="margin-top: 2px;">{{
              student.card_id }}</p>

            <!-- Rest of content with adjusted spacing -->
            <div class="card-details justify-center items-baseline gap-x-2" style="min-height: 38px;">
              <p class="font-khmer text-red-600 leading-none" :style="{ fontSize: (student.name.khmer || '').length > 15 ? '14px' : '16px' }">{{ student.name.khmer }}</p>
              <p class="font-bold text-blue-900 tracking-wide" :style="{ fontSize: (student.name.english || '').length > 15 ? '10px' : '14px' }">{{ student.name.english }}</p>
            </div>

            <!-- Info Table -->
            <div class="mt-1 w-[170px]">
              <table class="w-full text-[10px] text-left">
                <tbody class="text-gray-900">
                  <tr>
                    <td class="w-[50px]">DOB</td>
                    <td>: {{ formatDate(student.birth_date) }}</td>
                  </tr>
                  <tr>
                    <td>Faculty</td>
                    <td>: {{ getFacultyInEnglish(student.faculty) || '-' }}
                    </td>
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
          <div
            class="absolute bottom-[29px] right-5 w-[1.5cm] h-[1.5cm] flex items-center justify-center bg-white p-[2px] rounded">
            <QrcodeVue :value="`${environment.url}student-identity-verification/${student.id}`" :size="52" level="M"
              render-as="svg" class="w-13 h-13" />
          </div>
        </div>
      </div>

      <div v-if="!isLoading && (!students.length || !templateImageUrl)" class="text-center text-gray-500 mt-8">No
        students or template loaded.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { getStudentsByIds } from '../../service/student.service';
import { getfileByid } from '../../service/image.service';
import { environment } from '../../environments/environment';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import QrcodeVue from 'qrcode.vue';
import { Button, Input, DatePicker, Divider, Skeleton, message, Modal, Progress } from 'ant-design-vue';
import { FilePdfOutlined, CopyOutlined, UserOutlined } from '@ant-design/icons-vue';

const route = useRoute();
const students = ref([]);
const template = ref(null);
const templateId = ref(null);

const issueDate = ref(new Date().toISOString().split('T')[0]);
const expiryDate = ref(new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]);
const year = ref(new Date().getFullYear().toString());
const isExportingPages = ref(false);
const isExporting = ref(false);
const isLoading = ref(true);
const studentIdCount = ref(0);
const exportProgress = ref(0);
const currentCardIndex = ref(0);
const totalCards = ref(0);

const exportCanvasVisible = ref(false);


const getFacultyInEnglish = (faculty) => {
  const facultyMap = {
    'ភាសាបរទេស': 'Foreign Languages',
    'ព័ត៌មានវិទ្យា': 'Information Technology',
    'គ្រប់គ្រង': 'Management',
  };
  return facultyMap[faculty] || faculty;
};

const templateImageUrl = computed(() =>
  template.value?.filename
    ? `${environment.apiBaseUrl}media/image/${template.value.filename}`
    : ''
);

const getPhotoUrl = (photo) =>
  photo ? `${environment.apiBaseUrl}media/image/${photo}` : '';

function parseDateString(value) {
  if (!value && value !== 0) return null;
  // numeric timestamp
  if (typeof value === 'number') {
    const d = new Date(value);
    return isNaN(d) ? null : d;
  }
  if (typeof value !== 'string') return null;

  const s = value.trim();
  if (!s) return null;

  // If ISO-like with T or timezone, let Date handle it
  if (s.includes('T') || /[zZ]|[+\-]\d{2}:\d{2}$/.test(s)) {
    const d = new Date(s);
    return isNaN(d) ? null : d;
  }

  // If contains a space (e.g. "2006-08-27 00:00:00"), take the date part before space
  let datePart = s.split(' ')[0];

  // Normalize slashes to dashes
  datePart = datePart.replace(/\//g, '-');

  const m = datePart.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (m) {
    const y = parseInt(m[1], 10);
    const mo = parseInt(m[2], 10) - 1;
    const d = parseInt(m[3], 10);
    const dt = new Date(y, mo, d);
    return isNaN(dt) ? null : dt;
  }

  // Last resort: try Date constructor
  const d0 = new Date(s);
  return isNaN(d0) ? null : d0;
}

function formatDate(dateStr) {
  const d = parseDateString(dateStr);
  if (!d) return '-';
  return d.toLocaleDateString('en-GB').replace(/\//g, '-');
}


function applyExportColors(el) {
  const allEls = [el, ...el.querySelectorAll('*')];

  // Map of Tailwind classes to Hex values to bypass oklch issues in html2canvas
  allEls.forEach(element => {
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

    await showExportCanvas();

    const cardElements = document.querySelectorAll("#canvas .id-card");
    if (!cardElements.length) throw new Error("No card elements found!");
    totalCards.value = cardElements.length;

    const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: [cardWidthMM, cardHeightMM], compress: false });

    for (let i = 0; i < cardElements.length; i++) {
      const el = cardElements[i];

      applyExportColors(el);

      // High-res canvas capture
      const canvas = await html2canvas(el, {
        scale: window.devicePixelRatio * 4,  // super high resolution
        width: 216,
        height: 342,
        backgroundColor: null,
        useCORS: true,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL("image/png");

      if (i > 0) pdf.addPage([cardWidthMM, cardHeightMM], 'p');
      pdf.addImage(imgData, "PNG", 0, 0, cardWidthMM, cardHeightMM);

      currentCardIndex.value = i + 1;
      exportProgress.value = Math.round(((i + 1) / cardElements.length) * 100);
    }

    pdf.save("StudentCards_Pages.pdf");
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
      scale: 6,
      backgroundColor: "#ffffff",
      useCORS: true,
      logging: false,
    });

    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save('StudentCards_Grid.pdf');
    message.success('Grid Exported');
  } catch (err) {
    console.error('Grid export error:', err);
    message.error("Export failed: " + err.message);
  } finally {
    exportCanvasVisible.value = false;
    isExporting.value = false;
  }
}


onMounted(async () => {
  try {
    const studentIds = JSON.parse(route.query.ids || '[]');
    studentIdCount.value = studentIds.length;
    templateId.value = route.query.templateId;

    const promises = [];

    if (templateId.value) {
      promises.push(getfileByid(templateId.value).then(data => {
        template.value = data;
      }).catch(err => console.error('Template fetch error:', err)));
    }

    if (studentIds.length > 0) {
      promises.push(getStudentsByIds(studentIds).then(data => {
        students.value = data;
      }).catch(err => console.error('Student fetch error:', err)));
    }

    await Promise.all(promises);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.id-card:hover {
  cursor: pointer;
}
.font-khmer {
  font-family: 'Kantumruy Pro', sans-serif;
  font-weight: 512;
}
.font-koh {
  font-family: 'Koh Santepheap', serif;
  font-size: 9px;
}
</style>
