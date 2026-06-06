<template>
  <div class="receipt-page bg-white text-black">
    <div class="receipt-a5 relative z-10 flex flex-col overflow-hidden bg-white text-[#111]">
      <!-- Watermark -->
      <img
        :src="Logo"
        alt=""
        class="receipt-watermark pointer-events-none select-none"
        width="350"
        height="350"
        aria-hidden="true"
      />

      <header class="relative z-20 mb-2 flex justify-between items-start">
        <div class="flex items-center gap-3">
          <div class="relative w-48 shrink-0">
            <img :src="receiptLogo" alt="AGA" class="h-full w-full object-contain" />
          </div>
        </div>
        <div class="text-right">
          <p class="text-sm font-bold font-weight-700">№ AI: {{ row.serial_no || '' }}</p>
        </div>
      </header>

      <section class="receipt-doc-title">
        <h3 class="receipt-doc-title-text">បង្កាន់ដៃទទួលប្រាក់</h3>
        <div class="">
          <span class="receipt-doc-tacteing">7</span>
        </div>
      </section>

      <main class="receipt-main relative z-20 flex flex-1 flex-col font-khmer">
        <!-- Name -->
        <div class="rc-field-row">
          <span class="rc-label shrink-0 whitespace-nowrap">គោត្តនាម និងនាម:</span>
          <div class="rc-dotted min-w-0 flex-1">
            <span class="khmer-moul rc-input">{{ row.name_khmer || '' }}</span>
          </div>
          <span class="rc-label ml-2 shrink-0 whitespace-nowrap">អក្សរឡាតាំង:</span>
          <div class="rc-dotted w-1/3 min-w-[7rem]">
            <span class="rc-input font-sans font-bold uppercase">{{ row.name_latin || '' }}</span>
          </div>
        </div>

        <!-- Gender, DOB, Phone -->
        <div class="rc-field-row">
          <span class="rc-label shrink-0 whitespace-nowrap">ភេទ:</span>
          <div class="rc-dotted w-28 shrink-0">
            <span class="rc-input">{{ row.gender || '' }}</span>
          </div>
          <span class="rc-label shrink-0 whitespace-nowrap">ថ្ងៃ-ខែ-ឆ្នាំកំណើត :</span>
          <div class="rc-dotted min-w-0 flex-1">
            <span class="rc-input">{{ birthDateKhmer }}</span>
          </div>
          <span class="rc-label ml-2 shrink-0 whitespace-nowrap">ទូរស័ព្ទ :</span>
          <div class="rc-dotted w-1/4 min-w-[5.5rem]">
            <span class="rc-input">{{ row.phone || '' }}</span>
          </div>
        </div>

        <!-- Faculty, batch, degree -->
        <div class="rc-field-row rc-field-row--wrap">
          <span class="rc-label shrink-0 whitespace-nowrap">មហាវិទ្យាល័យ :</span>
          <div class="rc-dotted w-4/12 shrink-0">
            <span class="rc-input">{{ row.faculty || '' }}</span>
          </div>
          <span class="rc-label shrink-0 whitespace-nowrap">ជំនាន់ទី :</span>
          <div class="rc-dotted w-28 shrink-0">
            <span class="rc-input">{{ row.batch || '' }}</span>
          </div>
          <span class="rc-label ml-2 shrink-0 whitespace-nowrap">ថ្នាក់ :</span>
          <div class="min-w-0 flex-1 basis-[22%]">
            <span class="khmer-moul rc-input font-bold">{{ row.degree_level || '' }}</span>
          </div>
        </div>

        <!-- Amount / purpose -->
        <div class="rc-field-row">
          <span class="rc-label shrink-0 whitespace-nowrap">ចំនួនទឹកប្រាក់ :</span>
          <div class="rc-dotted min-w-0 flex-1 text-center">
            <span class="rc-input">{{ row.amount || '' }}</span>
          </div>
          <span class="rc-label ml-2 shrink-0 whitespace-nowrap">សម្រាប់ :</span>
          <div class="rc-dotted--start w-4/6 min-w-[5.5rem]">
            <span class="rc-input">{{ row.purpose || '' }}</span>
          </div>
        </div>

        <!-- Additional note -->
        <div class="rc-field-row rc-field-row--note">
          <span class="rc-label shrink-0 whitespace-nowrap">បញ្ជាក់បន្ថែម :</span>
          <div class="rc-dotted min-w-0 flex-1">
            <span class="rc-input rc-input--sm">{{ row.additional_note || '' }}</span>
          </div>
        </div>

        <div class="rc-dotted rc-dotted-spacer w-full"></div>

        <!-- Warning + date / signature (spacing via scoped CSS for preview === PDF) -->
        <div class="receipt-sig-block">
          <div class="receipt-sig-row">
            <div class="receipt-sig-warning">
              <span class="receipt-sig-icon" aria-hidden="true"><i class="pi pi-exclamation-triangle"></i></span>
              <p class="receipt-sig-warning-text">ទឹកប្រាក់ដែលបង់ហើយមិនអាចដកវិញបានទេ</p>
            </div>
            <div class="receipt-sig-aside">
              <div class="receipt-sig-dateline">
                <p class="receipt-sig-date">
                  រាជធានីភ្នំពេញ ថ្ងៃទី<span class="tracking-widest">..................</span>ខែ<span class="tracking-widest"
                    >..................</span
                  >ឆ្នាំ<span class="tracking-widest">..................</span>
                </p>
                <p class="receipt-sig-handwriting">ហត្ថលេខា និងឈ្មោះអ្នកទទួល</p>
              </div>
              <div class="receipt-sig-space" aria-hidden="true"></div>
            </div>
          </div>
        </div>
      </main>

      <footer class="receipt-footer relative z-20 mt-auto border-t-2 border-blue-400">
        <div class="flex justify-center gap-2 text-[0.74rem]  font-medium leading-snug text-[#333]">
          <div class="flex min-w-0 flex-1 items-center gap-1  justify-center">
            <span>
              អាសយដ្ឋាន៖ អគារលេខ ៥៨៣Eo ភូមិទ្រា ៣ សង្កាត់ស្ទឹងមានជ័យទី១ ខណ្ឌមានជ័យ រាជធានីភ្នំពេញ, ទូរស័ព្ទលេខ: 068 434398 | 0966 434398 | 089 434398
            </span>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import receiptLogo from '@/assets/receiptlogo.png';
import Logo from '@/assets/ailogo.png';
import { waitForReceiptFonts } from './receiptFonts';

const props = defineProps({
  row: { type: Object, required: true },
});

const KHMER_DIGITS = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
const KHMER_MONTHS = [
  'មករា',
  'កុម្ភៈ',
  'មិនា',
  'មេសា',
  'ឧសភា',
  'មិថុនា',
  'កក្កដា',
  'សីហា',
  'កញ្ញា',
  'តុលា',
  'វិច្ឆកា',
  'ធ្នូ',
];

function toKhmerNumerals(n) {
  return String(Math.trunc(Number(n))).replace(/\d/g, (d) => KHMER_DIGITS[Number(d)]);
}

/** @returns {{ d: number, mo: number, y: number } | null} */
function parseBirthDateParts(raw) {
  if (raw == null) return null;
  const s = String(raw).trim();
  if (!s) return null;

  let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) return { y: Number(m[1]), mo: Number(m[2]) - 1, d: Number(m[3]) };

  m = s.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})/);
  if (m) return { d: Number(m[1]), mo: Number(m[2]) - 1, y: Number(m[3]) };

  const dt = new Date(s);
  if (!Number.isNaN(dt.getTime())) {
    return { d: dt.getDate(), mo: dt.getMonth(), y: dt.getFullYear() };
  }
  return null;
}

function formatBirthDateKhmer(raw) {
  if (raw == null || raw === '') return '';
  const s = String(raw).trim();
  const parts = parseBirthDateParts(s);
  if (!parts) return s;
  const { d, mo, y } = parts;
  if (mo < 0 || mo > 11 || d < 1 || d > 31 || y < 1 || y > 9999) return s;
  return `${toKhmerNumerals(d)} ${KHMER_MONTHS[mo]} ${toKhmerNumerals(y)}`;
}

const birthDateKhmer = computed(() => formatBirthDateKhmer(props.row.birth_date));

onMounted(() => {
  waitForReceiptFonts();
});

</script>

<style scoped>
@font-face {
  font-family: 'Tacteing';
  src: url('@/assets/fonts/Tacteing.ttf') format('truetype');
  font-display: block;
}

@font-face {
  font-family: 'Khmer OS Muol Light';
  src: local('Khmer OS Muol Light'), local('KhmerOSMuolLight');
  font-display: block;
}

.receipt-page {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background: #fff;
}

/* A5 landscape: 210mm × 148mm (matches PDF export) */
.receipt-a5 {
  width: 210mm;
  height: 148mm;
  max-width: 100%;
  box-sizing: border-box;
  padding: 10mm;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
}

.khmer-moul {
  font-family: 'Moul', 'Kantumruy Pro', 'Khmer', cursive;
}

.font-khmer {
  font-family: 'Kantumruy Pro', 'Inter', sans-serif;
}

.receipt-watermark {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 0;
  width: 300px;
  max-width: 75%;
  height: auto;
  opacity: 0.1;
  transform: translate(-50%, -50%);
  object-fit: contain;
}

/* Title block: explicit spacing for preview + PDF (ornament needs vertical room for Tacteing glyph) */
.receipt-doc-title {
  position: relative;
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-sizing: border-box;
}

.receipt-doc-title-text {
  display: block;
  width: fit-content;
  max-width: 100%;
  margin: 0 auto 0.1rem;
  padding: 0;
  font-family: 'Khmer OS Muol Light', 'KhmerOSMuolLight', 'Moul', 'Kantumruy Pro', 'Khmer', serif;
  font-size: 1.25rem;
  line-height: 1;
  font-weight: 400;
  color: #000000;
}

.receipt-doc-title-ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.1rem 0;
  min-height: 1.5rem;
  box-sizing: border-box;
}

.receipt-doc-title-line {
  display: block;
  width: 3rem;
  height: 1px;
  min-height: 1px;
  background-color: #000000;
  flex-shrink: 0;
}

.receipt-doc-tacteing {
  display: block;
  flex-shrink: 0;
  font-family: 'Tacteing', serif;
  font-size: 48px;
  font-weight: 400;
  line-height: 1;
  color: #000000;
  margin-top: -1rem;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: geometricPrecision;
}

/* Label + dotted share one line-height so underline meets label text bottom (preview === PDF) */
.rc-label {
  display: inline-block;
  flex-shrink: 0;
  font-size: 14px;
  line-height: var(--rc-line-h, 1.5rem);
  vertical-align: baseline;
  color: #111;
}

.rc-input {
  display: inline;
  margin: 0;
  padding: 0;
  font-weight: 700;
  font-family: 'Kantumruy Pro', 'Inter', sans-serif;
  font-size: 14px;
  font-size: 0.95rem;
  line-height: var(--rc-line-h, 1.5rem);
  vertical-align: baseline;
  color: #000;
}

.rc-input--sm {
  font-size: 0.875rem;
}

.rc-dotted {
  display: inline-block;
  box-sizing: border-box;
  min-width: 0;
  min-height: var(--rc-line-h, 1.5rem);
  padding: 0 0.5rem 0.125rem;
  font-size: 0.85rem;
  line-height: var(--rc-line-h, 1.5rem);
  vertical-align: baseline;
  border-bottom: 1.5px dotted #000;
  text-align: center;
}

.rc-dotted .rc-input:empty::before {
  content: '\00a0';
}

.rc-dotted--start {
  text-align: start;
}

.rc-field-row--note {
  --rc-line-h: 2rem;
}

.rc-dotted-spacer {
  min-height: 1.5rem;
}

/* One vertical rhythm for form rows (avoids Tailwind space-y + pb fighting each other) */
.rc-field-row {
  --rc-line-h: 1.75rem;
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  padding-bottom: 0.45rem;
  margin: 0;
  line-height: var(--rc-line-h, 1.5rem);
}

.rc-field-row--wrap {
  flex-wrap: wrap;
}

/* Warning / date / signature — explicit rem so preview and html2canvas match */
.receipt-sig-block {
  margin-top: 1rem;
  padding-bottom: 0.5rem;
}

.receipt-sig-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
}

.receipt-sig-warning {
  max-width: 40%;
  display: flex;
  align-items: flex-start;
  gap: 0.25rem;
  color: #dc2626;
  padding-top: 0.12rem;
}

.receipt-sig-icon {
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1;
  flex-shrink: 0;
}

.receipt-sig-warning-text {
  font-size: 0.7rem;
  font-weight: 700;
  line-height: 1.35;
  margin: 0;
}

.receipt-sig-aside {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex: 1;
  min-width: 0;
}

/* Shrink-wrap to date line width so handwriting centers under that line, not full aside */
.receipt-sig-dateline {
  display: flex;
  flex-direction: column;
  width: fit-content;
  max-width: 100%;
}

.receipt-sig-date {
  width: 100%;
  text-align: right;
  font-size: 0.75rem;
  line-height: 1.35;
  margin: 0 0 0.4rem 0;
}

.receipt-sig-handwriting {
  width: 100%;
  text-align: center;
  font-size: 0.75rem;
  margin: 0 0 0.35rem 0;
}

.receipt-sig-space {
  height: 4rem;
  align-self: stretch;
}

.receipt-footer {
  padding-top: 0.2rem;
}

@media print {
  @page {
    size: A5 landscape;
    margin: 0;
  }

  .receipt-page {
    background: #fff !important;
  }

  .receipt-a5 {
    width: auto;
    height: auto;
    min-height: 0;
    max-width: none;
    box-shadow: none;
    padding: 10mm;
  }
}
</style>
