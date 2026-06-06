import { apiFetch } from './api';

export async function getNextReceiptSerial({ reservedSerials = [] } = {}) {
  const params = new URLSearchParams();
  for (const serial of reservedSerials) {
    const value = String(serial ?? '').trim();
    if (value) params.append('reserved', value);
  }
  const qs = params.toString();
  return apiFetch(`/receipts/next-serial${qs ? `?${qs}` : ''}`, { method: 'GET' });
}

export async function parseReceiptExcel(file) {
  const form = new FormData();
  form.append('file', file);
  return apiFetch('/receipts/parse-excel', { method: 'POST', body: form });
}

export async function uploadReceiptExcel(file) {
  const form = new FormData();
  form.append('file', file);
  return apiFetch('/receipts/upload-excel', { method: 'POST', body: form });
}

export async function listReceiptBatches({ search = '', skip = 0, limit = 50 } = {}) {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  params.set('skip', String(skip));
  params.set('limit', String(limit));
  return apiFetch(`/receipts/batches?${params.toString()}`, { method: 'GET' });
}

export async function getReceiptBatch(batchId) {
  return apiFetch(`/receipts/batches/${encodeURIComponent(batchId)}`, { method: 'GET' });
}

export async function getLatestReceiptBatch() {
  return apiFetch('/receipts/batches/latest', { method: 'GET' });
}

export async function createReceiptBatch({ filename, rows }) {
  return apiFetch('/receipts/batches', {
    method: 'POST',
    body: JSON.stringify({ filename, rows }),
  });
}

export async function updateReceiptBatch(batchId, { rows }) {
  return apiFetch(`/receipts/batches/${encodeURIComponent(batchId)}`, {
    method: 'PATCH',
    body: JSON.stringify({ rows }),
  });
}

export async function deleteReceiptBatch(batchId) {
  return apiFetch(`/receipts/batches/${encodeURIComponent(batchId)}`, { method: 'DELETE' });
}

export async function createReceiptExportAudit({
  exportType,
  rows,
  batchId = null,
  batchIds = null,
  batchFilename = null,
}) {
  return apiFetch('/receipts/exports', {
    method: 'POST',
    body: JSON.stringify({
      export_type: exportType,
      rows,
      batch_id: batchId || undefined,
      batch_ids: batchIds?.length ? batchIds : undefined,
      batch_filename: batchFilename || undefined,
    }),
  });
}

export async function listReceiptExportAudits({ search = '', skip = 0, limit = 50 } = {}) {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  params.set('skip', String(skip));
  params.set('limit', String(limit));
  return apiFetch(`/receipts/exports?${params.toString()}`, { method: 'GET' });
}

