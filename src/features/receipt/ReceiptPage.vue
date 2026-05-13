<template>
  <ConfigProvider :theme="{ token: { fontFamily: 'inherit' } }">
    <div class="p-4 sm:p-6 lg:p-8 space-y-4">
      <input
        ref="fileInput"
        type="file"
        :accept="receiptAccept"
        style="display: none"
        @change="onFileChange"
      />

      <!-- Receipt rows toolbar -->
      <div class="card flex flex-col gap-4 bg-white p-4 rounded-xl shadow-md">
        <div class="flex flex-col lg:flex-row justify-between items-center gap-4">
        <div class="w-full lg:w-auto text-center lg:text-left">
          <p class="text-xl font-bold text-gray-900">Receipts from Excel</p>
          <p class="text-sm text-gray-500 mt-1">
            Select a file below or use Excel import, then Save to backend to store the batch.
          </p>
        </div>
        <div class="grid grid-cols-1 sm:grid-flow-col gap-2 w-full lg:w-auto items-center">
          <Input
            v-model:value="rowSearchDraft"
            placeholder="Search name, phone, or serial"
            allow-clear
            class="w-full sm:w-64"
            @pressEnter="handleRowSearch"
          />
          <Button type="primary" @click="handleRowSearch">Search</Button>
        </div>
        <Divider type="vertical" class="hidden lg:block h-8" />
        <div class="card flex flex-col sm:flex-row sm:flex-wrap justify-end gap-2 w-full lg:w-auto">
          <Button type="primary" ghost :loading="loading" @click="triggerFileInput" class="w-full sm:w-auto">
            <template #icon>
              <FileExcelOutlined />
            </template>
            Excel import
          </Button>
          <Button type="primary" :disabled="!selectedFile || saving" :loading="saving" @click="saveToBackend" class="w-full sm:w-auto">
            Save to backend
          </Button>
          <Button :disabled="!rows.length" @click="downloadPdfAll(rows)" class="w-full sm:w-auto">
            <template #icon>
              <FilePdfOutlined />
            </template>
            PDF (all)
          </Button>
          <Button :disabled="!rows.length" @click="printAll" class="w-full sm:w-auto">
            <template #icon>
              <PrinterOutlined />
            </template>
            Print all
          </Button>
          <Button :disabled="!selectedRowKeys.length" @click="downloadPdfSelected" class="w-full sm:w-auto">
            <template #icon>
              <FilePdfOutlined />
            </template>
            PDF (selected)
          </Button>
          <Button :disabled="!selectedRowKeys.length" @click="printSelected" class="w-full sm:w-auto">
            <template #icon>
              <PrinterOutlined />
            </template>
            Print selected
          </Button>
        </div>
        </div>

        <UploadDragger
          :multiple="false"
          :show-upload-list="false"
          :before-upload="beforeReceiptUpload"
          :accept="receiptAccept"
          class="receipt-upload-dragger"
        >
          <p class="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p class="ant-upload-text">Click or drag Excel / CSV here to parse</p>
          <p class="ant-upload-hint">
            .xlsx, .xls, or .csv — columns include serial_no, name_khmer, name_latin, phone, amount, purpose, …
          </p>
        </UploadDragger>
      </div>

      <div v-if="error" class="px-1">
        <Alert type="error" :message="error" show-icon />
      </div>

      <Divider />
      <Card :bordered="false" class="shadow-sm">
        <Table
          :data-source="pagedRows"
          :columns="rowColumns"
          :pagination="rowsTablePagination"
          :row-selection="rowRowSelection"
          :loading="loading"
          row-key="id"
          :scroll="{ x: 1100 }"
          @change="handleRowsTableChange"
        >
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.key === 'index'">
              {{ (rowsPagination.current - 1) * rowsPagination.pageSize + index + 1 }}
            </template>
            <template v-else-if="column.key === 'serial_no'">
              {{ record.serial_no || (rowsPagination.current - 1) * rowsPagination.pageSize + index + 1 }}
            </template>
            <template v-else-if="column.key === 'actions'">
              <div class="flex gap-1">
                <Button type="text" shape="circle" @click="openPreview(record)">
                  <template #icon>
                    <EyeOutlined class="text-blue-500" />
                  </template>
                </Button>
                <Button type="text" shape="circle" @click="downloadPdfOne(record)">
                  <template #icon>
                    <FilePdfOutlined class="text-green-600" />
                  </template>
                </Button>
                <Button type="text" shape="circle" @click="printOne(record)">
                  <template #icon>
                    <PrinterOutlined class="text-gray-700" />
                  </template>
                </Button>
              </div>
            </template>
          </template>
        </Table>
      </Card>

      <!-- Saved batches toolbar -->
      <div class="card flex flex-col lg:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-md">
        <p class="text-xl font-bold text-gray-900 w-full lg:w-auto text-center lg:text-left">Saved uploads</p>
        <div class="grid grid-cols-1 sm:grid-flow-col gap-2 w-full lg:w-auto items-center">
          <Input
            v-model:value="batchSearchDraft"
            placeholder="Search by filename…"
            allow-clear
            class="w-full sm:w-64"
            @pressEnter="handleBatchSearch"
          />
          <Button type="primary" @click="handleBatchSearch">Search</Button>
          <Button :loading="batchesLoading" @click="loadBatches">
            <template #icon>
              <ReloadOutlined />
            </template>
            Refresh
          </Button>
        </div>
        <Divider type="vertical" class="hidden lg:block h-8" />
        <Button :disabled="!selectedBatchIds.length" @click="downloadSelectedBatchesPdf" class="w-full lg:w-auto">
          <template #icon>
            <FilePdfOutlined />
          </template>
          Download PDF (selected)
        </Button>
      </div>

      <div v-if="batchesError" class="px-1">
        <Alert type="error" :message="batchesError" show-icon />
      </div>

      <Card :bordered="false" class="shadow-sm">
        <Table
          :data-source="batches"
          :columns="batchColumns"
          :pagination="batchTablePagination"
          :row-selection="batchRowSelection"
          :loading="batchesLoading"
          row-key="id"
          :scroll="{ x: 800 }"
          @change="handleBatchTableChange"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'uploaded_at'">
              {{ formatDate(record.uploaded_at) }}
            </template>
            <template v-else-if="column.key === 'actions'">
              <Button type="text" shape="circle" @click="loadBatchIntoTable(record.id)">
                <template #icon>
                  <FolderOpenOutlined class="text-orange-500" />
                </template>
              </Button>
            </template>
          </template>
        </Table>
      </Card>

      <Modal v-model:open="previewOpen" :footer="null" title="Receipt preview" width="80vw" centered>
        <div class="overflow-auto">
          <div class="preview-sheet mx-auto">
            <ReceiptDocument v-if="previewRow" :row="previewRowForDoc" />
          </div>
        </div>
      </Modal>

      <Modal
        v-model:open="isExportingPdf"
        :footer="null"
        :closable="false"
        :maskClosable="false"
        title="Exporting PDF"
        centered
      >
        <div class="flex flex-col items-center justify-center p-6 gap-4">
          <Progress type="circle" :percent="exportProgress" />
          <div class="text-center">
            <p class="font-semibold text-lg">Processing…</p>
            <p class="text-gray-500">Page {{ currentExportIndex }} of {{ totalExportPages }}</p>
          </div>
        </div>
      </Modal>

      <div ref="printRoot" class="print-root" aria-hidden="true">
        <div v-for="(r, idx) in rowsToPrint" :key="idx" class="print-page">
          <ReceiptDocument :row="stripRowId(r)" />
        </div>
      </div>

      <div ref="exportRoot" class="export-root" aria-hidden="true" v-if="exportRootVisible">
        <div v-for="(r, idx) in rowsToExport" :key="idx" class="receipt-export-page">
          <ReceiptDocument :row="stripRowId(r)" />
        </div>
      </div>
    </div>
  </ConfigProvider>
</template>

<script setup>
import { ref, nextTick, computed, watch } from 'vue';
import {
  Alert,
  Button,
  Card,
  ConfigProvider,
  Divider,
  Input,
  Modal,
  Progress,
  Table,
  UploadDragger,
  message,
} from 'ant-design-vue';
import {
  EyeOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  FolderOpenOutlined,
  InboxOutlined,
  PrinterOutlined,
  ReloadOutlined,
} from '@ant-design/icons-vue';
import ReceiptDocument from './ReceiptDocument.vue';
import { getReceiptBatch, listReceiptBatches, parseReceiptExcel, uploadReceiptExcel } from '@/service/receipt.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const receiptAccept =
  '.xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv';

const fileInput = ref(null);
const loading = ref(false);
const error = ref('');
const rows = ref([]);
const selectedFile = ref(null);
const saving = ref(false);

const batches = ref([]);
const batchesLoading = ref(false);
const batchesError = ref('');
const batchSearch = ref('');
const batchSearchDraft = ref('');
const selectedBatchIds = ref([]);

const printRoot = ref(null);
const rowsToPrint = ref([]);

const previewOpen = ref(false);
const previewRow = ref(null);
const previewRowForDoc = computed(() => (previewRow.value ? stripRowId(previewRow.value) : null));

const exportRoot = ref(null);
const exportRootVisible = ref(false);
const rowsToExport = ref([]);

const isExportingPdf = ref(false);
const exportProgress = ref(0);
const currentExportIndex = ref(0);
const totalExportPages = ref(0);

const rowSearchDraft = ref('');
const rowSearchQuery = ref('');

const selectedRowKeys = ref([]);

const rowsPagination = ref({
  current: 1,
  pageSize: 100,
  total: 0,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '100', '200', '500'],
});

const batchPagination = ref({
  current: 1,
  pageSize: 100,
  total: 0,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '100', '200', '500'],
});

function normalizeRow(r) {
  return {
    serial_no: r.serial_no ?? '',
    name_khmer: r.name_khmer ?? '',
    name_latin: r.name_latin ?? '',
    gender: r.gender ?? '',
    birth_date: r.birth_date ?? '',
    phone: r.phone ?? '',
    faculty: r.faculty ?? '',
    batch: r.batch ?? '',
    degree_level: r.degree_level ?? '',
    amount: r.amount ?? '',
    purpose: r.purpose ?? '',
    additional_note: r.additional_note ?? '',
  };
}

function newRowId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function assignIdsToRows(list) {
  return list.map((r) => ({
    ...normalizeRow(r),
    id: newRowId(),
  }));
}

function stripRowId(r) {
  if (!r) return r;
  const { id: _omit, ...rest } = r;
  return rest;
}

const filteredRows = computed(() => {
  const q = rowSearchQuery.value.trim().toLowerCase();
  if (!q) return rows.value;
  return rows.value.filter((r) => {
    const hay = [r.serial_no, r.name_khmer, r.name_latin, r.phone]
      .map((x) => String(x || '').toLowerCase())
      .join(' ');
    return hay.includes(q);
  });
});

watch(
  () => filteredRows.value.length,
  (len) => {
    const { current, pageSize } = rowsPagination.value;
    const maxPage = Math.max(1, Math.ceil(len / pageSize) || 1);
    if (current > maxPage) rowsPagination.value.current = maxPage;
  },
);

const pagedRows = computed(() => {
  const { current, pageSize } = rowsPagination.value;
  const start = (current - 1) * pageSize;
  return filteredRows.value.slice(start, start + pageSize);
});

const rowsTablePagination = computed(() => ({
  current: rowsPagination.value.current,
  pageSize: rowsPagination.value.pageSize,
  total: filteredRows.value.length,
  showSizeChanger: rowsPagination.value.showSizeChanger,
  pageSizeOptions: rowsPagination.value.pageSizeOptions,
}));

const rowRowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  preserveSelectedRowKeys: true,
  onChange: (keys) => {
    selectedRowKeys.value = keys;
  },
}));

const rowColumns = [
  { title: 'No', key: 'index', width: 56 },
  { title: '№ / Serial', key: 'serial_no', width: 100 },
  { title: 'Khmer name', dataIndex: 'name_khmer', key: 'name_khmer', ellipsis: true },
  { title: 'Latin name', dataIndex: 'name_latin', key: 'name_latin', ellipsis: true },
  { title: 'Phone', dataIndex: 'phone', key: 'phone', width: 120 },
  { title: 'Amount', dataIndex: 'amount', key: 'amount', width: 90 },
  { title: 'Purpose', dataIndex: 'purpose', key: 'purpose', ellipsis: true },
  { title: 'Actions', key: 'actions', fixed: 'right', width: 132 },
];

const batchTablePagination = computed(() => ({
  current: batchPagination.value.current,
  pageSize: batchPagination.value.pageSize,
  total: batchPagination.value.total,
  showSizeChanger: batchPagination.value.showSizeChanger,
  pageSizeOptions: batchPagination.value.pageSizeOptions,
}));

const batchRowSelection = computed(() => ({
  selectedRowKeys: selectedBatchIds.value,
  preserveSelectedRowKeys: true,
  onChange: (keys) => {
    selectedBatchIds.value = keys;
  },
}));

const batchColumns = [
  { title: 'Filename', dataIndex: 'filename', key: 'filename', ellipsis: true },
  { title: 'Rows', dataIndex: 'row_count', key: 'row_count', width: 80 },
  { title: 'Uploaded', key: 'uploaded_at', width: 200 },
  { title: 'Actions', key: 'actions', fixed: 'right', width: 72 },
];

function handleRowsTableChange(pag) {
  rowsPagination.value.current = pag.current;
  rowsPagination.value.pageSize = pag.pageSize;
}

function handleRowSearch() {
  rowSearchQuery.value = rowSearchDraft.value.trim();
  rowsPagination.value.current = 1;
}

function handleBatchTableChange(pag) {
  batchPagination.value.current = pag.current;
  batchPagination.value.pageSize = pag.pageSize;
  loadBatches();
}

function handleBatchSearch() {
  batchSearch.value = (batchSearchDraft.value || '').trim();
  batchPagination.value.current = 1;
  loadBatches();
}

function triggerFileInput() {
  const el = fileInput.value;
  if (!el) return;
  el.value = '';
  el.click();
}

function clearRowSelection() {
  selectedRowKeys.value = [];
}

async function parseReceiptFile(file) {
  if (!file) return;
  selectedFile.value = file;
  error.value = '';
  loading.value = true;
  try {
    const res = await parseReceiptExcel(file);
    const list = Array.isArray(res?.rows) ? res.rows : Array.isArray(res) ? res : [];
    rows.value = assignIdsToRows(list);
    clearRowSelection();
    rowsPagination.value.current = 1;
  } catch (err) {
    error.value = err?.message || 'Failed to parse Excel.';
    rows.value = [];
    clearRowSelection();
  } finally {
    loading.value = false;
  }
}

async function beforeReceiptUpload(file) {
  await parseReceiptFile(file);
  return false;
}

async function onFileChange(e) {
  const file = e.target.files?.[0];
  if (!file) {
    e.target.value = '';
    return;
  }
  await parseReceiptFile(file);
  e.target.value = '';
}

async function saveToBackend() {
  if (!selectedFile.value) return;
  saving.value = true;
  try {
    const saved = await uploadReceiptExcel(selectedFile.value);
    message.success(`Saved: ${saved?.filename || 'receipt batch'}`);
    await loadBatches();
  } catch (err) {
    console.error(err);
    message.error('Failed to save to backend');
  } finally {
    saving.value = false;
  }
}

function doPrint() {
  requestAnimationFrame(() => window.print());
}

function printAll() {
  rowsToPrint.value = rows.value.map((r) => stripRowId(r));
  doPrint();
}

function getSelectedReceiptRows() {
  const keySet = new Set(selectedRowKeys.value);
  return rows.value.filter((r) => keySet.has(r.id));
}

function printSelected() {
  const list = getSelectedReceiptRows();
  if (!list.length) {
    message.warning('Select at least one row.');
    return;
  }
  rowsToPrint.value = list.map((r) => stripRowId(r));
  doPrint();
}

function printOne(r) {
  rowsToPrint.value = [stripRowId(r)];
  doPrint();
}

function openPreview(r) {
  previewRow.value = r;
  previewOpen.value = true;
}

function _fileSafeName(name) {
  return String(name || 'receipt')
    .trim()
    .replace(/[\\/:*?"<>|]+/g, '-')
    .replace(/\s+/g, ' ')
    .slice(0, 120);
}

function applyExportColors(el) {
  const allEls = [el, ...el.querySelectorAll('*')];
  allEls.forEach((element) => {
    if (element.classList.contains('text-gray-900')) element.style.color = '#111827';
    else if (element.classList.contains('text-gray-700')) element.style.color = '#374151';
    else if (element.classList.contains('text-gray-600')) element.style.color = '#4B5563';
    else if (element.classList.contains('text-gray-500')) element.style.color = '#6B7280';
    else if (element.classList.contains('text-blue-800')) element.style.color = '#1E40AF';
    else if (element.classList.contains('text-red-600')) element.style.color = '#dc2626';
    else if (element.classList.contains('text-black')) element.style.color = '#000000';
    else if (element.classList.contains('text-[#111]')) element.style.color = '#111111';
    else if (element.classList.contains('text-[#1a365d]')) element.style.color = '#1a365d';
    else if (element.classList.contains('text-[#333]')) element.style.color = '#333333';
    else if (element.classList.contains('border-blue-400')) element.style.borderColor = '#60a5fa';

    if (element.classList.contains('bg-white')) element.style.backgroundColor = '#ffffff';
    if (element.classList.contains('bg-black')) element.style.backgroundColor = '#000000';

    if (element.classList.contains('border-gray-200')) element.style.borderColor = '#E5E7EB';
  });
}

function receiptCaptureTarget(pageEl) {
  return pageEl?.querySelector?.('.receipt-a5') || pageEl;
}

async function waitForReceiptFonts() {
  try {
    if (typeof document !== 'undefined' && document.fonts?.ready) await document.fonts.ready;
  } catch {
    /* ignore */
  }
}

async function receiptElementToCanvas(el) {
  applyExportColors(el);
  return html2canvas(el, {
    scale: Math.min(3, (typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1) * 2),
    backgroundColor: '#ffffff',
    useCORS: true,
  });
}

async function receiptToCanvas(pageEl) {
  const el = receiptCaptureTarget(pageEl);
  if (!el) throw new Error('Nothing to export.');
  await waitForReceiptFonts();
  return receiptElementToCanvas(el);
}

async function showExportRoot(exportRows) {
  rowsToExport.value = exportRows;
  exportRootVisible.value = true;
  await nextTick();
  await new Promise((r) => setTimeout(r, 200));
}

function hideExportRoot() {
  exportRootVisible.value = false;
  rowsToExport.value = [];
}

function _addCanvasToPdf(pdf, canvas) {
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const imgData = canvas.toDataURL('image/png');
  const imgW = pageW;
  const imgH = (canvas.height / canvas.width) * pageW;
  const y = Math.max(0, (pageH - imgH) / 2);
  pdf.addImage(imgData, 'PNG', 0, y, imgW, Math.min(imgH, pageH));
}

async function downloadPdfOne(r) {
  const row = stripRowId(r);
  isExportingPdf.value = true;
  exportProgress.value = 0;
  currentExportIndex.value = 0;
  totalExportPages.value = 1;

  try {
    await showExportRoot([row]);
    const pages = exportRoot.value?.querySelectorAll('.receipt-export-page') || [];
    if (!pages.length) throw new Error('Nothing to export.');

    const pdf = new jsPDF({ orientation: 'l', unit: 'mm', format: 'a5', compress: true });
    const canvas = await receiptToCanvas(pages[0]);
    _addCanvasToPdf(pdf, canvas);
    currentExportIndex.value = 1;
    exportProgress.value = 100;

    const serial = row?.serial_no ? `-${_fileSafeName(row.serial_no)}` : '';
    pdf.save(`receipt${serial}.pdf`);
    message.success('PDF downloaded');
  } catch (err) {
    console.error(err);
    message.error('Failed to export PDF');
  } finally {
    hideExportRoot();
    isExportingPdf.value = false;
  }
}

async function downloadPdfAll(exportRowsRefOrArray) {
  const exportRows = Array.isArray(exportRowsRefOrArray?.value)
    ? exportRowsRefOrArray.value.map((r) => stripRowId(r))
    : Array.isArray(exportRowsRefOrArray)
      ? exportRowsRefOrArray.map((r) => stripRowId(r))
      : rows.value.map((r) => stripRowId(r));
  if (!exportRows.length) return;
  isExportingPdf.value = true;
  exportProgress.value = 0;
  currentExportIndex.value = 0;
  totalExportPages.value = exportRows.length;

  try {
    await showExportRoot(exportRows);
    const pages = Array.from(exportRoot.value?.querySelectorAll('.receipt-export-page') || []);
    if (!pages.length) throw new Error('Nothing to export.');

    await waitForReceiptFonts();

    const pdf = new jsPDF({ orientation: 'l', unit: 'mm', format: 'a5', compress: true });

    for (let i = 0; i < pages.length; i++) {
      const el = receiptCaptureTarget(pages[i]);
      if (!el) continue;
      const canvas = await receiptElementToCanvas(el);

      if (i > 0) pdf.addPage();
      _addCanvasToPdf(pdf, canvas);

      currentExportIndex.value = i + 1;
      exportProgress.value = Math.round(((i + 1) / pages.length) * 100);
    }

    pdf.save(`receipts-${new Date().toISOString().slice(0, 10)}.pdf`);
    message.success('PDF downloaded');
  } catch (err) {
    console.error(err);
    message.error('Failed to export PDF');
  } finally {
    hideExportRoot();
    isExportingPdf.value = false;
  }
}

function downloadPdfSelected() {
  const list = getSelectedReceiptRows();
  if (!list.length) {
    message.warning('Select at least one row.');
    return;
  }
  downloadPdfAll(list);
}

function formatDate(v) {
  if (!v) return '';
  try {
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return String(v);
    return d.toLocaleString();
  } catch {
    return String(v);
  }
}

async function loadBatches() {
  batchesLoading.value = true;
  batchesError.value = '';
  try {
    const skip = (batchPagination.value.current - 1) * batchPagination.value.pageSize;
    const limit = batchPagination.value.pageSize;
    const res = await listReceiptBatches({ search: batchSearch.value, skip, limit });
    batches.value = Array.isArray(res?.items) ? res.items : [];
    const total = Number(res?.total ?? 0);
    batchPagination.value.total = total;
  } catch (err) {
    console.error(err);
    batchesError.value = err?.message || 'Failed to load saved uploads.';
    batches.value = [];
    batchPagination.value.total = 0;
  } finally {
    batchesLoading.value = false;
  }
}

async function loadBatchIntoTable(batchId) {
  try {
    const batch = await getReceiptBatch(batchId);
    const list = Array.isArray(batch?.rows) ? batch.rows : [];
    rows.value = assignIdsToRows(list);
    clearRowSelection();
    rowsPagination.value.current = 1;
    message.success('Loaded batch');
  } catch (err) {
    console.error(err);
    message.error('Failed to load batch');
  }
}

async function downloadSelectedBatchesPdf() {
  if (!selectedBatchIds.value.length) return;
  try {
    const details = await Promise.all(selectedBatchIds.value.map((id) => getReceiptBatch(id)));
    const allRows = details.flatMap((b) => (Array.isArray(b?.rows) ? b.rows : [])).map(normalizeRow);
    await downloadPdfAll(allRows);
  } catch (err) {
    console.error(err);
    message.error('Failed to export selected batches');
  }
}

loadBatches();
</script>

<style scoped>
.print-root {
  position: fixed;
  left: -99999px;
  top: 0;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

/* Off-screen but real A5 width so flex/%/mm layout matches preview for html2canvas */
.export-root {
  position: fixed;
  left: -220mm;
  top: 0;
  width: 210mm;
  min-width: 210mm;
  max-width: 210mm;
  height: auto;
  overflow: visible;
  pointer-events: none;
  z-index: -1;
  background: transparent;
}

.receipt-export-page {
  width: 210mm;
  min-height: 148mm;
  box-sizing: border-box;
  background: #ffffff;
}

.preview-sheet {
  width: fit-content;
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
  overflow-x: auto;
}

@media print {
  .print-root {
    position: static;
    left: auto;
    width: auto;
    height: auto;
    overflow: visible;
  }

  body *:not(.print-root):not(.print-root *) {
    display: none !important;
  }

  .print-page {
    break-after: page;
    page-break-after: always;
  }
}
</style>
