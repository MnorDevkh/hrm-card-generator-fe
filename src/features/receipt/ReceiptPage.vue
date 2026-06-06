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
          <p class="text-xl font-bold text-gray-900">{{ t('receipt.excelTitle') }}</p>
          <p class="text-sm text-gray-500 mt-1">
            {{ t('receipt.excelHint') }}
          </p>
          <p v-if="activeBatchLabel" class="text-sm text-blue-700 mt-1 font-medium">
            {{ t('receipt.loadedFromDb', { filename: activeBatchLabel }) }}
          </p>
          <p v-else-if="saving" class="text-sm text-gray-500 mt-1">
            {{ t('receipt.savingChanges') }}
          </p>
        </div>
        <div class="grid grid-cols-1 sm:grid-flow-col gap-2 w-full lg:w-auto items-center">
          <Input
            v-model:value="rowSearchDraft"
            :placeholder="t('receipt.searchRows')"
            allow-clear
            class="w-full sm:w-64"
            @pressEnter="handleRowSearch"
          />
          <Button type="primary" @click="handleRowSearch">{{ t('common.search') }}</Button>
        </div>
        <Divider type="vertical" class="hidden lg:block h-8" />
        <div class="card flex flex-col sm:flex-row sm:flex-wrap justify-end gap-2 w-full lg:w-auto">
          <Button type="primary" :disabled="!uploadTarget" @click="openAddRow" class="w-full sm:w-auto">
            <template #icon>
              <PlusOutlined />
            </template>
            {{ t('receipt.addRow') }}
          </Button>
          <Button
            v-if="selectedRowKeys.length"
            danger
            @click="confirmBulkDeleteRows"
            class="w-full sm:w-auto"
          >
            <template #icon>
              <DeleteOutlined />
            </template>
            {{ t('receipt.bulkDeleteRows', { count: selectedRowKeys.length }) }}
          </Button>
          <Button type="primary" ghost :disabled="!uploadTarget" :loading="loading" @click="triggerFileInput" class="w-full sm:w-auto">
            <template #icon>
              <FileExcelOutlined />
            </template>
            {{ t('receipt.excelImport') }}
          </Button>
          <Button type="primary" :disabled="!canSave || saving" :loading="saving" @click="saveToBackend" class="w-full sm:w-auto">
            {{ t('receipt.saveToBackend') }}
          </Button>
          <Button :disabled="!rows.length" @click="downloadPdfAll(rows, { exportType: 'all' })" class="w-full sm:w-auto">
            <template #icon>
              <FilePdfOutlined />
            </template>
            {{ t('receipt.pdfAll') }}
          </Button>
          <Button :disabled="!selectedRowKeys.length" @click="downloadPdfSelected" class="w-full sm:w-auto">
            <template #icon>
              <FilePdfOutlined />
            </template>
            {{ t('receipt.pdfSelected') }}
          </Button>
        </div>
        </div>

        <div class="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
          <span class="text-sm font-medium text-gray-700 shrink-0">{{ t('receipt.selectTargetFile') }} *</span>
          <Select
            v-model:value="uploadTarget"
            :placeholder="t('receipt.selectTargetFilePlaceholder')"
            allow-clear
            class="w-full sm:max-w-md"
            :loading="batchesLoading"
            @change="onUploadTargetChange"
          >
            <SelectOption :value="UPLOAD_TARGET_NEW">{{ t('receipt.newUploadFile') }}</SelectOption>
            <SelectOption v-for="batch in batches" :key="batch.id" :value="batch.id">
              {{ batch.filename }} ({{ batch.row_count }} {{ t('receipt.rows') }})
            </SelectOption>
          </Select>
        </div>

        <Alert
          v-if="!uploadTarget"
          type="warning"
          show-icon
          :message="t('receipt.selectTargetFileRequired')"
        />

        <UploadDragger
          :multiple="false"
          :show-upload-list="false"
          :before-upload="beforeReceiptUpload"
          :accept="receiptAccept"
          :disabled="!uploadTarget"
          class="receipt-upload-dragger"
          :class="{ 'receipt-upload-dragger--disabled': !uploadTarget }"
        >
          <p class="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p class="ant-upload-text">{{ t('receipt.uploadText') }}</p>
          <p class="ant-upload-hint">
            {{ t('receipt.uploadHint') }}
          </p>
        </UploadDragger>
      </div>

      <div v-if="error" class="px-1">
        <Alert type="error" :message="error" show-icon />
      </div>

      <Divider />
      <Card :bordered="false" class="shadow-sm">
        <Table
          :dataSource="pagedRows"
          :columns="rowColumns"
          :pagination="rowsTablePagination"
          :row-selection="rowRowSelection"
          :loading="rowsLoading || loading"
          row-key="id"
          :scroll="{ x: 1100 }"
          @change="handleRowsTableChange"
        >
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.key === 'index'">
              {{ (rowsPagination.current - 1) * rowsPagination.pageSize + index + 1 }}
            </template>
            <template v-else-if="column.key === 'serial_no'">
              {{ record.serial_no }}
            </template>
            <template v-else-if="column.key === 'actions'">
              <div class="flex gap-1">
                <Button type="text" shape="circle" @click="openPreview(record)">
                  <template #icon>
                    <EyeOutlined class="text-blue-500" />
                  </template>
                </Button>
                <Button type="text" shape="circle" @click="openEditRow(record)">
                  <template #icon>
                    <EditOutlined class="text-orange-500" />
                  </template>
                </Button>
                <Button type="text" shape="circle" @click="downloadPdfOne(record)">
                  <template #icon>
                    <FilePdfOutlined class="text-green-600" />
                  </template>
                </Button>
                <Button type="text" danger shape="circle" @click="confirmDeleteRow(record)">
                  <template #icon>
                    <DeleteOutlined />
                  </template>
                </Button>
              </div>
            </template>
          </template>
        </Table>
      </Card>

      <!-- Saved batches toolbar -->
      <div class="card flex flex-col lg:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-md">
        <p class="text-xl font-bold text-gray-900 w-full lg:w-auto text-center lg:text-left">{{ t('receipt.savedUploads') }}</p>
        <div class="grid grid-cols-1 sm:grid-flow-col gap-2 w-full lg:w-auto items-center">
          <Input
            v-model:value="batchSearchDraft"
            :placeholder="t('receipt.searchFilename')"
            allow-clear
            class="w-full sm:w-64"
            @pressEnter="handleBatchSearch"
          />
          <Button type="primary" @click="handleBatchSearch">{{ t('common.search') }}</Button>
          <Button :loading="batchesLoading" @click="loadBatches">
            <template #icon>
              <ReloadOutlined />
            </template>
            {{ t('receipt.refresh') }}
          </Button>
        </div>
        <Divider type="vertical" class="hidden lg:block h-8" />
        <Button :disabled="!selectedBatchIds.length" @click="downloadSelectedBatchesPdf" class="w-full lg:w-auto">
          <template #icon>
            <FilePdfOutlined />
          </template>
          {{ t('receipt.downloadPdfSelected') }}
        </Button>
      </div>

      <div v-if="batchesError" class="px-1">
        <Alert type="error" :message="batchesError" show-icon />
      </div>

      <Card :bordered="false" class="shadow-sm">
        <Table
          :dataSource="batches"
          :columns="batchColumns"
          :pagination="batchTablePagination"
          :row-selection="batchRowSelection"
          :loading="batchesLoading"
          :custom-row="batchCustomRow"
          row-key="id"
          :scroll="{ x: 800 }"
          @change="handleBatchTableChange"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'uploaded_at'">
              {{ formatDate(record.uploaded_at) }}
            </template>
            <template v-else-if="column.key === 'actions'">
              <div class="flex gap-1">
                <Button type="text" shape="circle" @click="selectUploadTarget(record.id)">
                  <template #icon>
                    <FolderOpenOutlined class="text-orange-500" />
                  </template>
                </Button>
                <Button type="text" danger shape="circle" @click="confirmDeleteBatch(record)">
                  <template #icon>
                    <DeleteOutlined />
                  </template>
                </Button>
              </div>
            </template>
          </template>
        </Table>
      </Card>

      <!-- Export history -->
      <div class="card flex flex-col lg:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-md">
        <p class="text-xl font-bold text-gray-900 w-full lg:w-auto text-center lg:text-left">{{ t('receipt.exportHistory') }}</p>
        <div class="grid grid-cols-1 sm:grid-flow-col gap-2 w-full lg:w-auto items-center">
          <Input
            v-model:value="exportSearchDraft"
            :placeholder="t('receipt.searchExportHistory')"
            allow-clear
            class="w-full sm:w-64"
            @pressEnter="handleExportHistorySearch"
          />
          <Button type="primary" @click="handleExportHistorySearch">{{ t('common.search') }}</Button>
          <Button :loading="exportAuditsLoading" @click="loadExportHistory">
            <template #icon>
              <ReloadOutlined />
            </template>
            {{ t('receipt.refresh') }}
          </Button>
          <Button :loading="exportReportPdfLoading" :disabled="!exportPagination.total" @click="downloadExportHistoryPdf()">
            <template #icon>
              <FilePdfOutlined />
            </template>
            {{ t('receipt.exportReportPdf') }}
          </Button>
          <Button
            :loading="exportReportPdfLoading"
            :disabled="!selectedExportAuditKeys.length"
            @click="downloadSelectedExportHistoryPdf"
          >
            <template #icon>
              <FilePdfOutlined />
            </template>
            {{ t('receipt.exportReportPdfSelected') }}
          </Button>
        </div>
      </div>

      <div v-if="exportAuditsError" class="px-1">
        <Alert type="error" :message="exportAuditsError" show-icon />
      </div>

      <Card :bordered="false" class="shadow-sm">
        <Table
          :dataSource="exportAudits"
          :columns="exportAuditColumns"
          :pagination="exportAuditTablePagination"
          :row-selection="exportAuditRowSelection"
          :loading="exportAuditsLoading"
          row-key="id"
          :scroll="{ x: 880 }"
          @change="handleExportHistoryTableChange"
        >
          <template #expandedRowRender="{ record }">
            <Table
              :columns="exportAuditRowColumns"
              :dataSource="record.rows || []"
              :pagination="false"
              :row-key="exportAuditRowKey"
              size="small"
              :scroll="{ x: 900 }"
            >
              <template #bodyCell="{ column, index }">
                <template v-if="column.key === 'index'">
                  {{ index + 1 }}
                </template>
              </template>
            </Table>
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'exported_at'">
              {{ formatDate(record.exported_at) }}
            </template>
            <template v-else-if="column.key === 'export_type'">
              {{ formatExportType(record.export_type) }}
            </template>
            <template v-else-if="column.key === 'batch_filename'">
              {{ record.batch_filename || '—' }}
            </template>
            <template v-else-if="column.key === 'exported_by_username'">
              {{ record.exported_by_username || '—' }}
            </template>
            <template v-else-if="column.key === 'actions'">
              <Button type="text" shape="circle" :loading="exportReportPdfLoading" @click="downloadOneExportHistoryPdf(record)">
                <template #icon>
                  <FilePdfOutlined class="text-green-600" />
                </template>
              </Button>
            </template>
          </template>
        </Table>
      </Card>

      <Modal
        v-model:open="rowFormOpen"
        :title="selectedRowForEdit?.id ? t('receipt.editRow') : t('receipt.newRow')"
        :footer="null"
        destroyOnClose
        width="min(800px, 98vw)"
      >
        <ReceiptRowForm
          v-if="rowFormOpen"
          :row="selectedRowForEdit"
          :used-serials="formUsedSerials"
          @save="saveRow"
          @cancel="rowFormOpen = false"
        />
      </Modal>

      <Modal v-model:open="previewOpen" :footer="null" :title="t('receipt.preview')" width="80vw" centered>
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
        :title="t('receipt.exportingPdf')"
        centered
      >
        <div class="flex flex-col items-center justify-center p-6 gap-4">
          <Progress type="circle" :percent="exportProgress" />
          <div class="text-center">
            <p class="font-semibold text-lg">{{ t('receipt.processing') }}</p>
            <p class="text-gray-500">{{ t('receipt.pageProgress', { current: currentExportIndex, total: totalExportPages }) }}</p>
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
import { ref, nextTick, computed, watch, createVNode, onMounted } from 'vue';
import { onBeforeRouteUpdate } from 'vue-router';
import { useI18n } from 'vue-i18n';
import {
  Alert,
  Button,
  Card,
  ConfigProvider,
  Divider,
  Input,
  Modal,
  Progress,
  Select,
  SelectOption,
  Table,
  UploadDragger,
  message,
} from 'ant-design-vue';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  FolderOpenOutlined,
  InboxOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons-vue';
import ReceiptDocument from './ReceiptDocument.vue';
import ReceiptRowForm from './ReceiptRowForm.vue';
import { formatReceiptApiError, hasDuplicateSerial, localDateYMD, normalizeSerial } from './receiptSerial';
import { formatAppDateTime } from '@/utils/date';
import {
  createReceiptBatch,
  createReceiptExportAudit,
  deleteReceiptBatch,
  getNextReceiptSerial,
  getReceiptBatch,
  listReceiptBatches,
  listReceiptExportAudits,
  parseReceiptExcel,
  updateReceiptBatch,
  uploadReceiptExcel,
} from '@/service/receipt.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { getReceiptCaptureScale, waitForReceiptFonts } from './receiptFonts';
import { buildExportReportLabels, buildExportReportPdf } from './receiptExportReportPdf';

const { t } = useI18n();

const receiptAccept =
  '.xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv';

const fileInput = ref(null);
const loading = ref(false);
const rowsLoading = ref(false);
const error = ref('');
const rows = ref([]);
const selectedFile = ref(null);
const saving = ref(false);
const activeBatchId = ref(null);
const activeBatchFilename = ref('');
const isDirty = ref(false);

const ACTIVE_BATCH_STORAGE_KEY = 'receipt_active_batch_id';
const UPLOAD_TARGET_NEW = '__new__';

const uploadTarget = ref(null);

const rowFormOpen = ref(false);
const selectedRowForEdit = ref(null);

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

const exportAudits = ref([]);
const exportAuditsLoading = ref(false);
const exportReportPdfLoading = ref(false);
const exportAuditsError = ref('');
const exportSearch = ref('');
const exportSearchDraft = ref('');
const selectedExportAuditKeys = ref([]);
const exportPagination = ref({
  current: 1,
  pageSize: 20,
  total: 0,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '50', '100'],
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

const rowColumns = computed(() => [
  { title: t('receipt.no'), key: 'index', width: 56 },
  { title: t('receipt.serial'), key: 'serial_no', width: 200 },
  { title: t('receipt.khmerName'), dataIndex: 'name_khmer', key: 'name_khmer', ellipsis: true },
  { title: t('receipt.latinName'), dataIndex: 'name_latin', key: 'name_latin', ellipsis: true },
  { title: t('receipt.phone'), dataIndex: 'phone', key: 'phone', width: 120 },
  { title: t('receipt.amount'), dataIndex: 'amount', key: 'amount', width: 90 },
  { title: t('receipt.purpose'), dataIndex: 'purpose', key: 'purpose', ellipsis: true },
  { title: t('common.actions'), key: 'actions', fixed: 'right', width: 180 },
]);

const canSave = computed(() => rows.value.length > 0 && (isDirty.value || !activeBatchId.value));

const activeBatchLabel = computed(() => {
  if (!activeBatchId.value) return '';
  if (activeBatchFilename.value) return activeBatchFilename.value;
  const batch = batches.value.find((b) => b.id === activeBatchId.value);
  return batch?.filename || '';
});

const formUsedSerials = computed(() =>
  rows.value.map((r) => normalizeSerial(r.serial_no)).filter(Boolean),
);

const batchCustomRow = (record) => ({
  class: record.id === uploadTarget.value || record.id === activeBatchId.value ? 'receipt-batch-row-active' : '',
  onClick: (event) => {
    if (event.target.closest('.ant-checkbox-wrapper, .ant-checkbox, button, a')) return;
    selectUploadTarget(record.id);
  },
});

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

const batchColumns = computed(() => [
  { title: t('receipt.filename'), dataIndex: 'filename', key: 'filename', ellipsis: true },
  { title: t('receipt.rows'), dataIndex: 'row_count', key: 'row_count', width: 80 },
  { title: t('receipt.uploaded'), key: 'uploaded_at', width: 200 },
  { title: t('common.actions'), key: 'actions', fixed: 'right', width: 104 },
]);

const exportAuditTablePagination = computed(() => ({
  current: exportPagination.value.current,
  pageSize: exportPagination.value.pageSize,
  total: exportPagination.value.total,
  showSizeChanger: exportPagination.value.showSizeChanger,
  pageSizeOptions: exportPagination.value.pageSizeOptions,
}));

const exportAuditColumns = computed(() => [
  { title: t('receipt.exportedAt'), key: 'exported_at', width: 180 },
  { title: t('receipt.exportType'), key: 'export_type', width: 110 },
  { title: t('receipt.exportCount'), dataIndex: 'receipt_count', key: 'receipt_count', width: 80 },
  { title: t('receipt.filename'), key: 'batch_filename', ellipsis: true },
  { title: t('receipt.exportedBy'), key: 'exported_by_username', width: 140 },
  { title: t('common.actions'), key: 'actions', fixed: 'right', width: 72 },
]);

const exportAuditRowSelection = computed(() => ({
  selectedRowKeys: selectedExportAuditKeys.value,
  preserveSelectedRowKeys: true,
  onChange: (keys) => {
    selectedExportAuditKeys.value = keys;
  },
}));

const exportAuditRowColumns = computed(() => [
  { title: t('receipt.no'), key: 'index', width: 56 },
  { title: t('receipt.serial'), dataIndex: 'serial_no', key: 'serial_no', width: 140 },
  { title: t('receipt.khmerName'), dataIndex: 'name_khmer', key: 'name_khmer', ellipsis: true },
  { title: t('receipt.latinName'), dataIndex: 'name_latin', key: 'name_latin', ellipsis: true },
  { title: t('receipt.phone'), dataIndex: 'phone', key: 'phone', width: 120 },
  { title: t('receipt.fields.faculty'), dataIndex: 'faculty', key: 'faculty', ellipsis: true },
  { title: t('receipt.fields.batch'), dataIndex: 'batch', key: 'batch', width: 90 },
  { title: t('receipt.amount'), dataIndex: 'amount', key: 'amount', width: 90 },
  { title: t('receipt.purpose'), dataIndex: 'purpose', key: 'purpose', ellipsis: true },
]);

function exportAuditRowKey(row, index) {
  return String(row?.serial_no || index);
}

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

function handleExportHistoryTableChange(pag) {
  exportPagination.value.current = pag.current;
  exportPagination.value.pageSize = pag.pageSize;
  loadExportHistory();
}

function handleExportHistorySearch() {
  exportSearch.value = (exportSearchDraft.value || '').trim();
  exportPagination.value.current = 1;
  loadExportHistory();
}

function activeBatchExportMeta() {
  return {
    batchId: activeBatchId.value || null,
    batchFilename: activeBatchLabel.value || null,
  };
}

function formatExportType(type) {
  const map = {
    single: t('receipt.exportTypeSingle'),
    selected: t('receipt.exportTypeSelected'),
    all: t('receipt.exportTypeAll'),
    batch: t('receipt.exportTypeBatch'),
  };
  return map[type] || type || '—';
}

async function auditPdfExport({ rows, exportType, batchId, batchIds, batchFilename }) {
  const normalized = (Array.isArray(rows) ? rows : []).map((r) => normalizeRow(r));
  if (!normalized.length) return;
  try {
    await createReceiptExportAudit({
      exportType,
      rows: normalized,
      batchId,
      batchIds,
      batchFilename,
    });
    await loadExportHistory();
  } catch (err) {
    console.error(err);
    message.warning(t('receipt.exportAuditFailed'));
  }
}

function triggerFileInput() {
  if (!requireUploadTarget()) return;
  const el = fileInput.value;
  if (!el) return;
  el.value = '';
  el.click();
}

function clearRowSelection() {
  selectedRowKeys.value = [];
}

function rememberActiveBatch(batchId) {
  activeBatchId.value = batchId || null;
  try {
    if (batchId) sessionStorage.setItem(ACTIVE_BATCH_STORAGE_KEY, batchId);
    else sessionStorage.removeItem(ACTIVE_BATCH_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

function applyBatchFromDb(batch, { silent = false } = {}) {
  const list = Array.isArray(batch?.rows) ? batch.rows : [];
  rows.value = assignIdsToRows(list);
  rememberActiveBatch(batch?.id || null);
  activeBatchFilename.value = batch?.filename || '';
  if (batch?.id) uploadTarget.value = batch.id;
  selectedFile.value = null;
  isDirty.value = false;
  clearRowSelection();
  rowsPagination.value.current = 1;
  if (!silent) message.success(t('receipt.batchLoaded'));
}

function requireUploadTarget() {
  if (!uploadTarget.value) {
    message.warning(t('receipt.selectTargetFileRequired'));
    return false;
  }
  if (uploadTarget.value !== UPLOAD_TARGET_NEW && !activeBatchId.value) {
    message.warning(t('receipt.selectTargetFileRequired'));
    return false;
  }
  return true;
}

async function selectUploadTarget(batchId) {
  uploadTarget.value = batchId;
  await loadBatchIntoTable(batchId, { silent: true });
}

async function onUploadTargetChange(value) {
  if (!value) {
    resetRowTable();
    return;
  }
  if (value === UPLOAD_TARGET_NEW) {
    rows.value = [];
    rememberActiveBatch(null);
    activeBatchFilename.value = '';
    selectedFile.value = null;
    isDirty.value = false;
    clearRowSelection();
    rowsPagination.value.current = 1;
    uploadTarget.value = UPLOAD_TARGET_NEW;
    return;
  }
  await loadBatchIntoTable(value, { silent: true });
}

function rowsForApi() {
  return rows.value.map((r) => normalizeRow(r));
}

async function persistActiveBatchRows({ silent = false } = {}) {
  if (!rows.value.length) {
    if (!silent) message.warning(t('receipt.noRowsToSave'));
    return false;
  }

  saving.value = true;
  rowsLoading.value = true;
  try {
    let saved;
    if (activeBatchId.value) {
      saved = await updateReceiptBatch(activeBatchId.value, { rows: rowsForApi() });
    } else {
      saved = await createReceiptBatch({
        filename: defaultBatchFilename(),
        rows: rowsForApi(),
      });
    }
    applyBatchFromDb(saved, { silent: true });
    if (!silent) {
      message.success(t('receipt.saved', { filename: saved?.filename || 'receipt batch' }));
    }
    await loadBatches();
    return true;
  } catch (err) {
    console.error(err);
    const msg = await formatReceiptApiError(err, t('receipt.saveFailed'), t);
    message.error(msg);
    return false;
  } finally {
    saving.value = false;
    rowsLoading.value = false;
  }
}

function defaultBatchFilename() {
  if (selectedFile.value?.name) return selectedFile.value.name;
  return `receipt-${localDateYMD()}.xlsx`;
}

async function importReceiptFile(file) {
  if (!file) return;
  if (!requireUploadTarget()) return;
  if (saving.value) return;

  selectedFile.value = file;
  error.value = '';
  loading.value = true;
  rowsLoading.value = true;
  try {
    if (uploadTarget.value === UPLOAD_TARGET_NEW) {
      const saved = await uploadReceiptExcel(file);
      applyBatchFromDb(saved, { silent: true });
      message.success(t('receipt.excelImported', { filename: saved?.filename || file.name }));
    } else {
      const res = await parseReceiptExcel(file);
      const list = Array.isArray(res?.rows) ? res.rows : Array.isArray(res) ? res : [];
      rows.value = assignIdsToRows(list);
      const ok = await persistActiveBatchRows({ silent: true });
      if (!ok) throw new Error(t('receipt.saveFailed'));
      message.success(t('receipt.excelImportedInto', { filename: activeBatchFilename.value || file.name }));
    }
    await loadBatches();
  } catch (err) {
    error.value = await formatReceiptApiError(err, t('receipt.parseFailed'), t);
    if (uploadTarget.value === UPLOAD_TARGET_NEW) {
      rows.value = [];
      rememberActiveBatch(null);
      activeBatchFilename.value = '';
      clearRowSelection();
    }
  } finally {
    loading.value = false;
    rowsLoading.value = false;
  }
}

async function beforeReceiptUpload(file) {
  await importReceiptFile(file);
  return false;
}

async function onFileChange(e) {
  const file = e.target.files?.[0];
  if (!file) {
    e.target.value = '';
    return;
  }
  await importReceiptFile(file);
  e.target.value = '';
}

async function saveToBackend() {
  if (activeBatchId.value && !isDirty.value) {
    message.info(t('receipt.alreadySaved'));
    return;
  }
  await persistActiveBatchRows();
}

function openAddRow() {
  if (!requireUploadTarget()) return;
  selectedRowForEdit.value = {};
  rowFormOpen.value = true;
}

function openEditRow(record) {
  selectedRowForEdit.value = { ...record };
  rowFormOpen.value = true;
}

async function saveRow(rowData) {
  const isEdit = !!rowData.id;
  let serial = normalizeSerial(rowData.serial_no);

  if (!isEdit) {
    try {
      const res = await getNextReceiptSerial({ reservedSerials: formUsedSerials.value });
      serial = normalizeSerial(res?.serial_no);
    } catch {
      serial = '';
    }
  }

  if (serial && hasDuplicateSerial(rows.value, serial, rowData.id)) {
    message.error(t('receipt.serialDuplicate', { serial }));
    return;
  }

  const payload = normalizeRow({ ...rowData, serial_no: serial });
  const previousRows = rows.value.map((r) => ({ ...r }));

  if (isEdit) {
    const idx = rows.value.findIndex((r) => r.id === rowData.id);
    if (idx >= 0) {
      rows.value[idx] = { ...payload, id: rowData.id };
    }
  } else {
    rows.value = [...rows.value, { ...payload, id: newRowId() }];
  }

  rowFormOpen.value = false;
  const ok = await persistActiveBatchRows({ silent: true });
  if (ok) {
    message.success(isEdit ? t('receipt.rowUpdated') : t('receipt.rowCreated'));
  } else {
    rows.value = previousRows;
    rowFormOpen.value = true;
    selectedRowForEdit.value = { ...rowData };
  }
}

async function removeRowsByIds(ids) {
  if (!ids.length) return false;

  const idSet = new Set(ids);
  const nextRows = rows.value.filter((r) => !idSet.has(r.id));
  if (!nextRows.length) {
    message.warning(t('receipt.cannotDeleteAllRows'));
    return false;
  }

  const previousRows = rows.value.map((r) => ({ ...r }));
  const previousKeys = [...selectedRowKeys.value];
  rows.value = nextRows;
  selectedRowKeys.value = selectedRowKeys.value.filter((id) => !idSet.has(id));

  const ok = await persistActiveBatchRows({ silent: true });
  if (!ok) {
    rows.value = previousRows;
    selectedRowKeys.value = previousKeys;
  }
  return ok;
}

function confirmDeleteRow(record) {
  Modal.confirm({
    title: t('receipt.deleteRowConfirm'),
    icon: createVNode(ExclamationCircleOutlined),
    content: t('common.cannotUndo'),
    okText: t('common.yes'),
    okType: 'danger',
    cancelText: t('common.no'),
    async onOk() {
      const ok = await removeRowsByIds([record.id]);
      if (ok) message.success(t('receipt.rowDeleted'));
    },
  });
}

function confirmBulkDeleteRows() {
  if (!selectedRowKeys.value.length) return;
  Modal.confirm({
    title: t('receipt.bulkDeleteRows', { count: selectedRowKeys.value.length }),
    icon: createVNode(ExclamationCircleOutlined),
    content: t('common.cannotUndo'),
    okText: t('common.yes'),
    okType: 'danger',
    cancelText: t('common.no'),
    async onOk() {
      const ok = await removeRowsByIds([...selectedRowKeys.value]);
      if (ok) message.success(t('receipt.bulkRowsDeleted'));
    },
  });
}

function confirmDeleteBatch(batch) {
  Modal.confirm({
    title: t('receipt.deleteBatchConfirm', { filename: batch.filename }),
    icon: createVNode(ExclamationCircleOutlined),
    content: t('common.cannotUndo'),
    okText: t('common.yes'),
    okType: 'danger',
    cancelText: t('common.no'),
    async onOk() {
      try {
        await deleteReceiptBatch(batch.id);
        const wasActive = activeBatchId.value === batch.id;
        if (wasActive) {
          rememberActiveBatch(null);
          activeBatchFilename.value = '';
          uploadTarget.value = null;
          rows.value = [];
          selectedFile.value = null;
          isDirty.value = false;
          clearRowSelection();
        }
        selectedBatchIds.value = selectedBatchIds.value.filter((id) => id !== batch.id);
        message.success(t('receipt.batchDeleted'));
        await loadBatches();
      } catch (err) {
        console.error(err);
        message.error(t('receipt.saveFailed'));
      }
    },
  });
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
    message.warning(t('receipt.selectRow'));
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

async function receiptElementToCanvas(el) {
  applyExportColors(el);
  return html2canvas(el, {
    scale: getReceiptCaptureScale(),
    backgroundColor: '#ffffff',
    useCORS: true,
    logging: false,
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
  await waitForReceiptFonts();
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

    const pdf = new jsPDF({ orientation: 'l', unit: 'mm', format: 'a5', compress: false });
    const canvas = await receiptToCanvas(pages[0]);
    _addCanvasToPdf(pdf, canvas);
    currentExportIndex.value = 1;
    exportProgress.value = 100;

    const serial = row?.serial_no ? `-${_fileSafeName(row.serial_no)}` : '';
    pdf.save(`receipt${serial}.pdf`);
    message.success(t('receipt.pdfDownloaded'));
    await auditPdfExport({
      rows: [row],
      exportType: 'single',
      ...activeBatchExportMeta(),
    });
  } catch (err) {
    console.error(err);
    message.error(t('receipt.pdfExportFailed'));
  } finally {
    hideExportRoot();
    isExportingPdf.value = false;
  }
}

async function downloadPdfAll(exportRowsRefOrArray, meta = {}) {
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

    const pdf = new jsPDF({ orientation: 'l', unit: 'mm', format: 'a5', compress: false });

    for (let i = 0; i < pages.length; i++) {
      const el = receiptCaptureTarget(pages[i]);
      if (!el) continue;
      const canvas = await receiptElementToCanvas(el);

      if (i > 0) pdf.addPage();
      _addCanvasToPdf(pdf, canvas);

      currentExportIndex.value = i + 1;
      exportProgress.value = Math.round(((i + 1) / pages.length) * 100);
    }

    pdf.save(`receipts-${localDateYMD()}.pdf`);
    message.success(t('receipt.pdfDownloaded'));
    const batchMeta = activeBatchExportMeta();
    await auditPdfExport({
      rows: exportRows,
      exportType: meta.exportType || 'all',
      batchId: meta.batchId ?? batchMeta.batchId,
      batchIds: meta.batchIds ?? null,
      batchFilename: meta.batchFilename ?? batchMeta.batchFilename,
    });
  } catch (err) {
    console.error(err);
    message.error(t('receipt.pdfExportFailed'));
  } finally {
    hideExportRoot();
    isExportingPdf.value = false;
  }
}

function downloadPdfSelected() {
  const list = getSelectedReceiptRows();
  if (!list.length) {
    message.warning(t('receipt.selectRow'));
    return;
  }
  downloadPdfAll(list, { exportType: 'selected', ...activeBatchExportMeta() });
}

function formatDate(v) {
  return formatAppDateTime(v);
}

async function loadExportHistory() {
  exportAuditsLoading.value = true;
  exportAuditsError.value = '';
  try {
    const skip = (exportPagination.value.current - 1) * exportPagination.value.pageSize;
    const limit = exportPagination.value.pageSize;
    const res = await listReceiptExportAudits({ search: exportSearch.value, skip, limit });
    exportAudits.value = Array.isArray(res?.items) ? res.items : [];
    exportPagination.value.total = Number(res?.total ?? 0);
  } catch (err) {
    console.error(err);
    exportAuditsError.value = err?.message || t('receipt.exportHistoryLoadFailed');
    exportAudits.value = [];
    exportPagination.value.total = 0;
  } finally {
    exportAuditsLoading.value = false;
  }
}

async function fetchAllExportAuditsForReport() {
  const all = [];
  const limit = 200;
  let skip = 0;
  let total = Infinity;

  while (skip < total) {
    const res = await listReceiptExportAudits({ search: exportSearch.value, skip, limit });
    const items = Array.isArray(res?.items) ? res.items : [];
    total = Number(res?.total ?? items.length);
    all.push(...items);
    if (!items.length || all.length >= total) break;
    skip += limit;
  }

  return all;
}

function buildReportSearchLabel({ audits, mode = 'all' }) {
  if (mode === 'specific' && audits.length === 1) {
    return t('receipt.exportReportFilterSpecific', {
      date: formatDate(audits[0].exported_at),
    });
  }
  if (mode === 'selected') {
    return t('receipt.exportReportFilterSelected', { count: audits.length });
  }
  return exportSearch.value.trim();
}

async function resolveAuditsForReport({ auditsOverride = null, mode = 'all' } = {}) {
  if (Array.isArray(auditsOverride) && auditsOverride.length) {
    return auditsOverride;
  }
  if (mode === 'selected') {
    if (!selectedExportAuditKeys.value.length) {
      message.warning(t('receipt.selectExportReport'));
      return null;
    }
    const all = await fetchAllExportAuditsForReport();
    const idSet = new Set(selectedExportAuditKeys.value);
    const selected = all.filter((audit) => idSet.has(audit.id));
    if (!selected.length) {
      message.warning(t('receipt.selectExportReport'));
      return null;
    }
    return selected;
  }
  return fetchAllExportAuditsForReport();
}

async function downloadExportHistoryPdf(auditsOverride = null, { mode = 'all' } = {}) {
  exportReportPdfLoading.value = true;
  try {
    const audits = await resolveAuditsForReport({ auditsOverride, mode });
    if (!audits?.length) {
      if (audits !== null) message.warning(t('receipt.exportReportPdfEmpty'));
      return;
    }

    const pdf = await buildExportReportPdf({
      audits,
      labels: buildExportReportLabels(t),
      formatDate,
      formatExportType,
      generatedAt: formatDate(new Date().toISOString()),
      searchFilter: buildReportSearchLabel({ audits, mode }),
    });
    const suffix = mode === 'specific' && audits.length === 1
      ? `-${localDateYMD()}`
      : mode === 'selected'
        ? `-selected-${localDateYMD()}`
        : `-${localDateYMD()}`;
    pdf.save(`receipt-export-report${suffix}.pdf`);
    message.success(t('receipt.exportReportPdfSuccess'));
  } catch (err) {
    console.error(err);
    message.error(t('receipt.exportReportPdfFailed'));
  } finally {
    exportReportPdfLoading.value = false;
  }
}

function downloadSelectedExportHistoryPdf() {
  downloadExportHistoryPdf(null, { mode: 'selected' });
}

function downloadOneExportHistoryPdf(record) {
  downloadExportHistoryPdf([record], { mode: 'specific' });
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
    batchesError.value = err?.message || t('receipt.uploadsLoadFailed');
    batches.value = [];
    batchPagination.value.total = 0;
  } finally {
    batchesLoading.value = false;
  }
}

async function loadBatchIntoTable(batchId, { silent = false } = {}) {
  if (saving.value) return false;

  rowsLoading.value = true;
  error.value = '';
  try {
    const batch = await getReceiptBatch(batchId);
    applyBatchFromDb(batch, { silent });
    return rows.value.length > 0;
  } catch (err) {
    console.error(err);
    if (!silent) message.error(t('receipt.batchLoadFailed'));
    return false;
  } finally {
    rowsLoading.value = false;
  }
}

function resetRowTable() {
  rows.value = [];
  rememberActiveBatch(null);
  activeBatchFilename.value = '';
  uploadTarget.value = null;
  selectedFile.value = null;
  isDirty.value = false;
  clearRowSelection();
  rowsPagination.value.current = 1;
}

async function initPage() {
  batchPagination.value.current = 1;
  exportPagination.value.current = 1;
  resetRowTable();
  await Promise.all([loadBatches(), loadExportHistory()]);
}

async function downloadSelectedBatchesPdf() {
  if (!selectedBatchIds.value.length) return;
  try {
    const batchIds = [...selectedBatchIds.value];
    const details = await Promise.all(batchIds.map((id) => getReceiptBatch(id)));
    const allRows = details.flatMap((b) => (Array.isArray(b?.rows) ? b.rows : [])).map(normalizeRow);
    const batchFilename = details.map((b) => b?.filename).filter(Boolean).join(', ');
    await downloadPdfAll(allRows, {
      exportType: 'batch',
      batchIds,
      batchFilename,
    });
  } catch (err) {
    console.error(err);
    message.error(t('receipt.batchExportFailed'));
  }
}

onMounted(() => {
  initPage();
});

onBeforeRouteUpdate((to) => {
  if (to.path === '/receipt' || to.path === '/receipts') {
    initPage();
  }
});
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

.receipt-upload-dragger--disabled {
  opacity: 0.55;
  pointer-events: none;
}

:deep(.receipt-batch-row-active) {
  background-color: #eff6ff !important;
}

:deep(.receipt-batch-row-active:hover > td) {
  background-color: #dbeafe !important;
}
</style>
