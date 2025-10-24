<template>
  <div class="container mx-auto my-8">
    <Toast />
    <div class="bg-surface-100 dark:bg-surface-800 p-8 rounded-xl shadow-lg">
      <!-- Top Bar -->
      <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div class="flex gap-2">
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
            <label for="issueDate" class="font-bold block mb-2 text-sm">Issue</label>
            <input type="date" id="issueDate" v-model="issueDate" class="p-inputtext p-component" />
          </div>
          <div class="flex flex-col">
            <label for="expiryDate" class="font-bold block mb-2 text-sm">Expiry</label>
            <input type="date" id="expiryDate" v-model="expiryDate" class="p-inputtext p-component" />
          </div>
          <div class="flex flex-col">
            <label for="year" class="font-bold block mb-2 text-sm">Year</label>
            <input type="text" id="year" v-model="year" class="p-inputtext p-component" />
          </div>
        </div>
      </div>

      <Divider />

      <!-- Card List -->
      <div v-if="students.length && templateImageUrl" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <div v-for="student in students" :key="student.id" :data-card-id="student.id"
          class="relative rounded-xl shadow-lg bg-white border border-gray-200 overflow-hidden"
          :style="{
            width: '216px',
            height: '348px',
            backgroundImage: `url(${templateImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }"
        >
          <!-- Hover Overlay for Single Export -->
          <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
            <button @click="exportSingleCard(student)" class="p-button p-button-help flex items-center gap-2">
              <i class="pi pi-file-pdf"></i>
              <span>Export This Card</span>
            </button>
          </div>

          <div class="absolute inset-0 flex flex-col items-center pt-24 text-center">
            <!-- Student Photo -->
            <div class="w-[65px] h-[80px] border border-gray-300 rounded flex items-center justify-center overflow-hidden shadow">
              <img v-if="student.photo" :src="getPhotoUrl(student.photo)" alt="Student Photo" class="w-full h-full object-cover" />
              <span v-else class="pi pi-user text-3xl text-gray-300"></span>
            </div>

            <!-- Card ID -->
            <p class="mt-[11px] text-[12px] font-bold text-gray-900 tracking-wider">{{ student.card_id }}</p>

            <!-- Khmer Name -->
            <p class="text-[16px] font-bold text-red-600 leading-tight mt-8">{{ student.name.khmer }}</p>

            <!-- English Name -->
            <p class="text-sm font-bold text-blue-900 tracking-wide mt-[-4px]">{{ student.name.english }}</p>

            <!-- Info Table -->
            <div class="mt-1 w-[170px]">
              <table class="w-full text-[10px] text-left">
                <tbody>
                  <tr>
                    <td class="w-[50px]">DOB</td>
                    <td>: {{ formatDate(student.birth_date) }}</td>
                  </tr>
                  <tr>
                    <td>Faculty</td>
                    <td>: {{ student.faculty || '-' }}, <span class="font-bold">Batch</span>: {{ student.batch || '-' }}</td>
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
          <div class="absolute bottom-7 right-4 w-[1.5cm] h-[1.5cm] flex items-center justify-center">
            <QrcodeVue :value="`${environment.url}students/${student.id}`" :size="52" level="M" render-as="svg" class="w-13 h-13" />
          </div>
        </div>
      </div>

      <div v-else class="text-center text-gray-500 mt-8">No students or template loaded.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { getStudentsByIds } from '../../service/student.service';
import { getfileByid } from '../../service/image.service';
import { environment } from '../../environments/environment';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import QrcodeVue from 'qrcode.vue';
import Divider from 'primevue/divider';
import { Toast } from 'primevue';
import { useToast } from 'primevue/usetoast';
import convert from 'color-convert';

const route = useRoute();
const students = ref([]);
const templateId = ref(null);
const toast = useToast();
const template = ref(null);

const issueDate = ref(new Date().toISOString().split('T')[0]);
const expiryDate = ref(new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]);
const year = ref(new Date().getFullYear().toString());

const templateImageUrl = computed(() => template.value?.filename
  ? `${environment.apiBaseUrl}upload_image/image/${template.value.filename}`
  : ''
);

const getPhotoUrl = (photo) => photo ? `${environment.apiBaseUrl}upload_image/image/${photo}` : '';

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const d = new Date(parts[0], parts[1]-1, parts[2]);
  return d.toLocaleDateString('en-GB');
}

// ✅ OKLCH to RGB conversion
function oklchToRgbString(oklchStr) {
  const match = oklchStr.match(/oklch\(\s*([\d.]+)%?\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)/i);
  if (!match) return 'rgb(128,128,128)';
  const L = parseFloat(match[1]);
  const C = parseFloat(match[2]);
  const H = parseFloat(match[3]);
  const [r,g,b] = convert.oklch.rgb([L,C,H]).map(x => Math.round(x*255));
  return `rgb(${r},${g},${b})`;
}

function patchOkLCHColorsInElement(el) {
  const style = getComputedStyle(el);
  const props = ['color','backgroundColor','borderColor','outlineColor','fill','stroke'];
  props.forEach(prop => {
    const value = style[prop];
    if (value?.includes('oklch(')) el.style[prop] = oklchToRgbString(value);
  });
}

const onCloneWithColorConversion = (clonedDoc) => {
  clonedDoc.querySelectorAll('*').forEach(el => patchOkLCHColorsInElement(el));
};

const isExporting = ref(false);
const isExportingPages = ref(false);

// ------------------ Export Functions ------------------
async function exportCards() {
  if (isExporting.value) return;
  isExporting.value = true;
  toast.add({ severity:'info', summary:'Exporting', detail:'Generating PDF...', life:5000 });

  try {
    const doc = new jsPDF('p','mm','a4');
    const cardElements = document.querySelectorAll('[data-card-id]');
    const cardWidthMm = 54, cardHeightMm = 87;
    const marginX = 10, marginY = 10;
    const cardsPerRow = 3, rowsPerPage = 3;
    const gapX = (210 - 2*marginX - cardsPerRow*cardWidthMm)/(cardsPerRow-1);
    const gapY = 5;

    for (let i=0; i<cardElements.length; i++) {
      const card = cardElements[i];
      const indexOnPage = i % (cardsPerRow*rowsPerPage);
      const row = Math.floor(indexOnPage/cardsPerRow);
      const col = indexOnPage%cardsPerRow;

      const canvas = await html2canvas(card, {
        scale: 3, useCORS: true, backgroundColor: null,
        onclone: onCloneWithColorConversion
      });
      const imgData = canvas.toDataURL('image/png');

      if(i>0 && indexOnPage===0) doc.addPage();
      const x = marginX + col*(cardWidthMm+gapX);
      const y = marginY + row*(cardHeightMm+gapY);
      doc.addImage(imgData,'PNG',x,y,cardWidthMm,cardHeightMm);
    }
    doc.save('student-cards.pdf');
    toast.add({ severity:'success', summary:'Success', detail:'PDF exported successfully!', life:3000 });
  } catch(err){
    console.error("PDF Export Error:", err);
    toast.add({ severity:'error', summary:'Export Failed', detail:'Could not generate PDF', life:3000 });
  } finally { isExporting.value=false; }
}

async function exportCardsAsPages() {
  if (isExportingPages.value) return;
  isExportingPages.value = true;
  toast.add({ severity:'info', summary:'Exporting', detail:'Generating PDF pages...', life:5000 });

  try {
    const cardElements = document.querySelectorAll('[data-card-id]');
    const cardWidthMm = 54, cardHeightMm = 87;
    const doc = new jsPDF({orientation:'p', unit:'mm', format:[cardWidthMm,cardHeightMm]});

    for (let i=0; i<cardElements.length; i++) {
      const card = cardElements[i];
      const canvas = await html2canvas(card, {
        scale: 4, useCORS: true, backgroundColor: null,
        onclone: onCloneWithColorConversion
      });
      const imgData = canvas.toDataURL('image/png');
      if(i>0) doc.addPage();
      doc.addImage(imgData,'PNG',0,0,cardWidthMm,cardHeightMm);
    }
    doc.save('student-cards-by-page.pdf');
    toast.add({ severity:'success', summary:'Success', detail:'PDF pages exported successfully!', life:3000 });
  } catch(err){
    console.error("PDF Pages Export Error:", err);
    toast.add({ severity:'error', summary:'Export Failed', detail:'Could not generate PDF pages', life:3000 });
  } finally { isExportingPages.value=false; }
}

async function exportSingleCard(student) {
  const cardElement = document.querySelector(`[data-card-id="${student.id}"]`);
  if(!cardElement){
    toast.add({severity:'error', summary:'Error', detail:'Card not found', life:3000});
    return;
  }
  toast.add({ severity:'info', summary:'Exporting', detail:`Generating PDF for ${student.name.english}...`, life:3000 });

  try{
    const canvas = await html2canvas(cardElement, {
      scale:4, useCORS:true, backgroundColor:null,
      onclone:onCloneWithColorConversion
    });
    const imgData = canvas.toDataURL('image/png');
    const doc = new jsPDF({orientation:'p', unit:'mm', format:[54,87]});
    doc.addImage(imgData,'PNG',0,0,54,87);
    doc.save(`card-${student.card_id || student.id}.pdf`);
    toast.add({severity:'success', summary:'Success', detail:'Single card exported!', life:3000});
  } catch(err){
    console.error("Single Card PDF Export Error:", err);
    toast.add({severity:'error', summary:'Export Failed', detail:'Could not generate PDF', life:3000});
  }
}

// ------------------ Mounted ------------------
onMounted(async()=>{
  const studentIds = JSON.parse(route.query.ids || '[]');
  templateId.value = route.query.templateId;

  if(templateId.value){
    try{ template.value = await getfileByid(templateId.value); }
    catch(err){ console.error("Template fetch error:", err); }
  }

  if(studentIds.length>0){
    try{ students.value = await getStudentsByIds(studentIds); }
    catch(err){ console.error("Student fetch error:", err); }
  }
});
</script>

<style scoped>
</style>
